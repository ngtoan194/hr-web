import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePaginationActions from '../../components/pagination/pagination'
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';
import EnhancedTableToolbar from '../../components/table-toolbar';
import moment from 'moment';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import ConfirmDialog from '../../components/confirm/'
import overTimeProvider from '../../data-access/overtime';

class OfferOT extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: true,
            data: {},
            tempDelete: {},
            totalOT: '',
            page: 0,
            size: 10,
            dataOverTime: [],
            total: 0,
            stt: 0,
            selectedDate: new Date(),
            startOT: new Date(),
            note: '',
            confirmDialog: false,
            timeSelected: [],
            arrTimeOt: [
                { lable: '1h', value: 1 },
                { lable: '1h30', value: 1.5 },
                { lable: '2h', value: 2 },
                { lable: '2h30', value: 2.5 },
                { lable: '3h', value: 3 },
                { lable: '3h30', value: 3.5 },
                { lable: '4h', value: 4 },
                { lable: '4h30', value: 4.5 },
                { lable: '5h', value: 5 },
                { lable: '5h30', value: 5.5 },
                { lable: '6h', value: 6 },
                { lable: '6h30', value: 6.5 },
                { lable: '7h', value: 7 },
                { lable: '7h30', value: 7.5 },
                { lable: '8h', value: 8 },
            ]
        }
    }

    getOverTime() {
        this.setState({ progress: true })
        let param = {
            page: this.state.page + 1,
            size: this.state.size,
            employeesId: this.state.data.employees.id,
        }
        overTimeProvider.search(param, (s, e) => {
            if (s && s.data) {
                let stt = 1 + (param.page - 1) * param.size;
                this.setState({
                    dataOverTime: s.data.data,
                    stt,
                    total: s.data.total,
                })
                this.getTotalOverTime();
            } else {
            }
            this.setState({ progress: false })
        })
    }

    getTotalOverTime() {
        let date = new Date();
        let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        let startDayOT = moment(firstDay).format('YYYY-MM-DD')
        let endDayOT = moment(lastDay).format('YYYY-MM-DD')
        let param = {
            employeesId: this.state.data.employees.id,
            startDayOT,
            endDayOT
        }
        overTimeProvider.search(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    totalOT: s.data.totalOT
                })
            } else {
            }

        })
    }

    componentWillMount() {
        let local = JSON.parse(localStorage.getItem('isofh'))
        if (local) {
            this.setState({
                data: JSON.parse(localStorage.getItem('isofh'))
            }, () => {
                this.getOverTime();
                // this.getTotalOverTime();
            })
        }

    }

    validateDataSend() {
        const { note, time } = this.state;
        let msg = ''
        if (!note) {
            msg = msg + "Nhập lý do! \n"
        }
        if (!time) {
            msg = msg + "Chọn thời gian OT! \n"
        }
        return msg
    }

    offerOt() {
        const { startOT, note, time } = this.state;
        let param = {
            "overTime": {
                "startOT": moment(startOT).format('YYYY-MM-DD HH:mm:00'),
                "totalOT": time && time.value,
                "note": note
            },
            "employeesId": this.state.data.employees.id,
        }
        if (this.validateDataSend() === '') {
            overTimeProvider.create(param, (s, e) => {
                if (s && s.data) {
                    this.handleCancelData();
                    this.getOverTime();
                    toast.success("Offer OT success !", {
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
        this.setState({
            startOT: new Date(),
            timeSelected: [],
            time: '',
            note: ''
        })
    }

    handleDateChange = date => {
        this.setState({ selectedDate: date });
    };

    isSelected = item => this.state.timeSelected.indexOf(item.lable) !== -1;
    setTimeOffer(item) {
        const { timeSelected } = this.state;
        const selectedIndex = timeSelected.indexOf(item.lable);
        let newSelected = [];
        if (selectedIndex === -1) {
            newSelected = newSelected.concat(timeSelected, item.lable);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(timeSelected.slice(1));
        } else if (selectedIndex === timeSelected.length - 1) {
            newSelected = newSelected.concat(timeSelected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                timeSelected.slice(0, selectedIndex),
                timeSelected.slice(selectedIndex + 1),
            );
        }
        this.setState({
            timeSelected: newSelected,
            time: item
        });
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.getOverTime()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getOverTime()
        });
    };

    showModalDelete(item) {
        this.setState({ confirmDialog: true, tempDelete: item })
    }

    delete(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            debugger
            overTimeProvider.delete(this.state.tempDelete.id, param, (s, e) => {
                if (s && s.data) {
                    toast.success("Hủy lịch OT thành công!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({ page: 0 })
                    this.getOverTime();
                    this.setState({ tempDelete: {} });
                } else {
                    toast.error("Hủy lịch OT không thành công!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        }
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const { totalOT } = this.state;
        return (
            <div>
                <p style={{ marginTop: '30px' }}>Tổng số giờ OT trong tháng: {totalOT}</p>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { dataOverTime, arrTimeOt, startOT, note, stt, page, size, total, progress, confirmDialog } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer autoClose={3000} />
                <Row>
                    <Col xs="12" sm="8" md="8">
                        <Card>
                            <CardHeader>
                                <EnhancedTableToolbar
                                    title="Danh sách đề xuất OT"
                                    numSelected={0}
                                    actionsChiren={
                                        this.renderChirenToolbar()
                                    }
                                />
                            </CardHeader>
                            <CardBody>
                                {progress ? <LinearProgress /> : null}
                                <Table className={classes.table} aria-labelledby="tableTitle">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Ngày OT</TableCell>
                                            <TableCell>Tổng số giờ OT</TableCell>
                                            <TableCell>Lý do</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            dataOverTime && dataOverTime.length ? dataOverTime.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        tabIndex={-1}>
                                                        <TableCell>{index + stt}</TableCell>
                                                        <TableCell>{moment(item.overTime.dayOT).format("DD-MM-YYYY")}</TableCell>
                                                        <TableCell>{item.overTime.totalOT}</TableCell>
                                                        <TableCell>{item.overTime.note}</TableCell>
                                                        <TableCell>
                                                            {
                                                                item.overTime.confirm == 1 ?
                                                                    <IconButton color="primary" className={classes.button} aria-label="CheckIcon">
                                                                        <CheckIcon />
                                                                    </IconButton> :
                                                                    <IconButton onClick={this.showModalDelete.bind(this, item.overTime)} color="secondary" className={classes.button} aria-label="CloseIcon">
                                                                        <CloseIcon />
                                                                    </IconButton>
                                                            }
                                                        </TableCell>
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
                                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn hủy lịch OT này không?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="4" md="4">
                        <Card>
                            <CardHeader style={{ height: '92px' }}>
                                <button onClick={() => { this.offerOt() }} style={{ marginTop: '20px' }}>Thêm đề xuất OT</button>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12">
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <DateTimePicker
                                                ampm={false}
                                                label="Thời gian OT"
                                                format="DD-MM-YYYY HH:mm"
                                                value={startOT}
                                                onChange={(date) => this.setState({ startOT: date })}
                                                leftArrowIcon={<KeyboardArrowLeft />}
                                                rightArrowIcon={<KeyboardArrowRight />}
                                                style={{ width: '100%', textAlign: 'center' }}
                                            />
                                        </MuiPickersUtilsProvider>
                                    </Col>
                                </Row>
                                <div style={{ margin: '25px' }}>
                                    {arrTimeOt.map((item, index) => {
                                        const isSelected = this.isSelected(item);
                                        return (
                                            <Button variant="contained" className={isSelected ? classes.active : classes.inActive} onClick={() =>
                                                this.setState({ timeSelected: [] }, () => {
                                                    this.setTimeOffer(item);
                                                })}
                                                key={index}
                                                style={{
                                                    width: 80,
                                                    borderWidth: 1,
                                                    borderRadius: 50,
                                                    margin: 5,
                                                    paddingTop: 5,
                                                    paddingBottom: 5,
                                                    paddingLeft: 10,
                                                    paddingRight: 10
                                                }}>
                                                {isSelected ? <img className={classes.iconSelected} src={require('../../assets/group.png')} /> : null}
                                                <span style={[isSelected ? { color: "#f05673" } : { color: "#4a4a4a" }, { textAlign: 'center', fontSize: 18, fontWeight: "bold" }]}>{item.lable}</span>
                                            </Button>
                                        )
                                    })}
                                </div>
                                <div>
                                    <textarea onChange={(event) => this.setState({ note: event.target.value })}
                                        style={{ width: '100%', borderTop: 'none', borderRight: 'none', borderLeft: 'none', lineHeight: 1 }}
                                        value={note} placeholder='Lý do OT(*)' rows='4'></textarea>
                                    <p>Note: Lịch nghỉ này sẽ được gửi cho leader và Hr</p>
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
    divTableTitle: {
        margin: '4px',
        fontWeight: 'bold'
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

export default withStyles(styles)(OfferOT);