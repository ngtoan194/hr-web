import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardBody, CardFooter, CardHeader, Col, Row, Collapse, Fade } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePaginationActions from '../../components/pagination/pagination';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import "react-daterange-picker/dist/css/react-calendar.css";
import departmentProvider from '../../data-access/department';
import notificationProvider from '../../data-access/notification';

class OfferLeave extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: true,
            page: 0,
            size: 10,
            data: [],
            total: 0,
            stt: 0,
            title: '',
            value: '',
            listDepartment: [],
        }
    }

    getData() {
        this.setState({ progress: true })
        let param = {
            page: this.state.page + 1,
            size: this.state.size,
        }
        notificationProvider.search(param, (s, e) => {
            if (s && s.data) {
                let stt = 1 + (param.page - 1) * param.size;
                this.setState({
                    data: s.data.data,
                    stt,
                    total: s.data.total,
                })
            } else {
            }
            this.setState({ progress: false })
        })
    }

    getDepartment() {
        let param = {
            page: 1,
            size: ''
        }
        let dataTemp = [{
            department: {
                id: -1,
                name: 'Tất cả nhân viên'
            },
            isSelected: false
        }]
        departmentProvider.search(param, (s, e) => {
            if (s && s.data) {
                if (s.data && s.data.data.length > 0) {
                    for (let i = 0; i < s.data.data.length; i++) {
                        let a = s.data.data[i]
                        a.isSelected = false
                        dataTemp.push(a)
                    }
                    this.setState({ listDepartment: dataTemp, loading: false })
                }
            }
        })
    }

    componentWillMount() {
        this.getData();
        let local = JSON.parse(localStorage.getItem('isofh'));
        if (local && local.specialize.name == 'HR') {
            this.getDepartment();
        }
        if (local && local.specialize.name == "Leader") {
            if (local.department) {
                let department = local.department;
                let listDepartment = [{
                    department,
                    isSelected: false
                }];
                this.setState({
                    listDepartment
                })
            }
        }

    }

    validateDataSend() {
        const { listDepartment, title, value } = this.state;
        let departmentIds = [];
        for (let i = 0; i < listDepartment.length; i++) {
            if (listDepartment[i].isSelected) {
                departmentIds.push(listDepartment[i].department.id)
            }
        }
        let msg = '';
        if (departmentIds.length <= 0) {
            msg = msg + "Chọn phòng ban! \n"
        }
        if (!title) {
            msg = msg + "Nhập tiêu đề thông báo! \n"
        }
        if (!value) {
            msg = msg + "Nhập nội dung thông báo! \n"
        }
        return msg
    }

    send() {
        const { listDepartment, title, value } = this.state;
        let departmentIds = [];
        for (let i = 0; i < listDepartment.length; i++) {
            if (listDepartment[i].isSelected && listDepartment[i].department.id != -1) {
                departmentIds.push(listDepartment[i].department.id)
            }
        }
        let param = {
            notification: {
                title,
                value
            },
            departmentIds
        }
        if (this.validateDataSend() === '') {
            notificationProvider.create(param, (s, e) => {
                if (s && s.data) {
                    this.handleCancelData();
                    this.setState({page: 0})
                    this.getData();
                    toast.success("Send notification success !", {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    toast.error(s.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        } else {
            alert(this.validateDataSend())
        }
    }

    handleCancelData() {
        const { listDepartment } = this.state;
        for (let i = 0; i < listDepartment.length; i++) {
            listDepartment[i].isSelected = false;
        }
        this.setState({
            title: '',
            value: '',
            listDepartment,
        })
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.getData()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getData()
        });
    };

    onSelect = (value, states) => {
        this.setState({ dateValue: value });
    };

    selectDepartment(item) {
        const { listDepartment } = this.state;
        item.isSelected = !item.isSelected
        if (item.department.id == -1) {
            for (let i = 0; i < listDepartment.length; i++) {
                if (item.isSelected) {
                    listDepartment[i].isSelected = true
                } else {
                    listDepartment[i].isSelected = false
                }
            }
        } else {
            for (let i = 0; i < listDepartment.length; i++) {
                if (listDepartment[0].department.id == -1) {
                    listDepartment[0].isSelected = false;
                }
            }
        }
        this.setState({ listDepartment })
    }

    render() {
        const { classes } = this.props;
        const { data, listDepartment, title, value, stt, page, size, total, progress } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer autoClose={3000} />
                <Row>
                    <Col xs="12" sm="7" md="7">
                        <Card>
                            <CardHeader>
                                <p>Danh sách thông báo</p>
                            </CardHeader>
                            <CardBody>
                                {progress ? <LinearProgress /> : null}
                                <Table className={classes.table} aria-labelledby="tableTitle">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Tiêu đề</TableCell>
                                            <TableCell>Nội dung</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            data && data.length ? data.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        tabIndex={-1}>
                                                        <TableCell>{index + stt}</TableCell>
                                                        <TableCell>{item.notification.title}</TableCell>
                                                        {/* <TableCell>{item.notification.value}</TableCell> */}
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                );
                                            })
                                                :
                                                <TableRow>
                                                    <TableCell>Danh sách trống</TableCell>
                                                </TableRow>
                                        }
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                labelRowsPerPage="Số dòng trên trang"
                                                rowsPerPageOptions={[10, 20, 50, 100]}
                                                colSpan={3}
                                                count={total}
                                                rowsPerPage={size}
                                                page={page}
                                                onChangePage={this.handleChangePage}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                                ActionsComponent={TablePaginationActions}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="5" md="5">
                        <Card>
                            <CardHeader>
                                <button onClick={() => { this.send() }}>Gửi thông báo</button>
                            </CardHeader>
                            <CardBody>
                                <div style={{ margin: '25px' }}>
                                    {listDepartment.map((item, index) => {
                                        return (
                                            <Button variant="contained" className={item.isSelected ? classes.active : classes.inActive}
                                                onClick={() => this.selectDepartment(item)}
                                                key={index}
                                                style={{
                                                    borderWidth: 1,
                                                    borderRadius: 50,
                                                    margin: 5,
                                                    paddingTop: 5,
                                                    paddingBottom: 5,
                                                    paddingLeft: 10,
                                                    paddingRight: 10,
                                                }}>
                                                {item.isSelected ? <img className={classes.iconSelected} src={require('../../assets/group.png')} /> : null}
                                                <span style={[item.isSelected ? { color: "#f05673" } : { color: "#4a4a4a" }, { textAlign: 'center', fontSize: 18, fontWeight: "bold" }]}>{item.department.name}</span>
                                            </Button>
                                        )
                                    })}
                                </div>
                                <div>
                                    <input onChange={(event) => this.setState({ title: event.target.value })}
                                        style={{ width: '100%', height: '35px', borderTop: 'none', borderRight: 'none', borderLeft: 'none', borderBottom: '1px solid #a2a2a2', marginBottom: '20px' }}
                                        value={title} placeholder='Tiêu đề thông báo'></input>
                                    <textarea onChange={(event) => this.setState({ value: event.target.value })}
                                        style={{ width: '100%', borderTop: 'none', borderRight: 'none', borderLeft: 'none', lineHeight: 1 }}
                                        value={value} placeholder='Nội dung thông báo' rows='15'></textarea>
                                    {/* <p>Note: Lịch nghỉ này sẽ được gửi cho leader và Hr</p> */}
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    datePicker: {
        border: '1px solid',
        textAlign: 'center'
    },
    alertFadeIn: {
        height: '50px',
        lineHeight: '3',
        textAlign: 'left',
        marginLeft: '15px',
        fontWeight: 'bold'
    },
    button: {
        borderRadius: 25,
        margin: 5
    },
    iconSelected: {
        position: 'absolute',
        right: 5,
        top: -5
    },
    active: {
        border: '1px solid #f05673',
        color: '#f05673',
        fontWeight: 'bold'
    },
    inActive: {
        borderColor: '#4a4a4a',
        color: '#4a4a4a'
    }
});

export default withStyles(styles)(OfferLeave);