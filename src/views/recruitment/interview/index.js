import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import EnhancedTableToolbar from '../../../components/table-toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import CheckCircle from '@material-ui/icons/CheckCircle';
import AvTimer from '@material-ui/icons/AvTimer';
import Cancel from '@material-ui/icons/Cancel';
import Apps from '@material-ui/icons/Apps';
import TablePaginationActions from '../../../components/pagination/pagination'
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';

import ModalAddUpdate from './add_interview'
import ModalResultInterview from './result_interview'
import interviewProvider from '../../../data-access/interview';
import specializeProvider from '../../../data-access/specialize';
import recruitmentProvider from '../../../data-access/recruitment';
import ConfirmDialog from '../../../components/confirm/'

class Interview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            email: '',
            result: -1,
            name: '',
            specializeId: -1,
            recruitmentSourcesId: -1,
            bucketTs: '',
            data: [],
            total: 0,
            selected: [],
            progress: true,
            modalAdd: false,
            modalResult: false,
            confirmDialog: false,
            listSpecialize: [],
            listRecruitment: [],
        }
        this.renderChirenToolbar = this.renderChirenToolbar.bind(this)
    }

    addNew() {
        console.log("add new")
    }

    callbackDelete(text) {

        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    getData() {
        this.setState({ progress: true })

        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            name: this.state.name,
            webSite: this.state.webSite,
            address: this.state.address,
            phoneNumber: this.state.phoneNumber,
            contact: this.state.contact,
            price: this.state.price,
            numberEmployee: this.state.numberEmployee,
        }
        interviewProvider.search(params, (s, e) => {
            console.log(s, e)
            if (s && s.data) {
                console.log(s.data)
                this.setState({
                    data: s.data.data,
                    total: s.data.total
                })
            } else {
                toast.error("Không lấy được dữ liệu !", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            }
            this.setState({ progress: false })
        })

        this.progress();
    }

    progress = () => {
        const { completed } = this.state;
        if (completed > 100) {
            this.setState({ completed: 0, buffer: 10 });
        } else {
            const diff = Math.random() * 10;
            const diff2 = Math.random() * 10;
            this.setState({ completed: completed + diff, buffer: completed + diff + diff2 });
        }
    };

    getSpecialize() {
        let param = {
            page: 1,
            size: ''
        }
        specializeProvider.search(param, (s, e) => {
            if (s && s.data) {
                let dataTemp = [{
                    specialize: {
                        id: -1,
                        name: 'Vị trí*'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }
                this.setState({
                    listSpecialize: dataTemp
                })
            } else {
            }
        })
    }

    getRecruitment() {
        let param = {
            page: 1,
            size: ''
        }
        recruitmentProvider.search(param, (s, e) => {
            if (s && s.data) {
                let dataTemp = [{
                    recruitmentSources: {
                        id: -1,
                        name: 'Nguồn tuyển dụng'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }
                this.setState({
                    listRecruitment: dataTemp
                })
            } else {
            }
        })
    }

    componentWillMount() {
        this.getData();
        this.getSpecialize();
        this.getRecruitment();
    }

    modalCreateUpdate(item) {
        if (item) {
            this.setState({
                modalAdd: true,
                dataUpdate: item,
                dataSpecialize: this.state.listSpecialize,
                dataRecruitment: this.state.listRecruitment,
            })
        } else {
            this.setState({
                modalAdd: true,
                dataUpdate: {},
                dataSpecialize: this.state.listSpecialize,
                dataRecruitment: this.state.listRecruitment,
            })
        }

    }

    modalSetResult(item) {
        this.setState({
            modalResult: true,
            dataResult: item,
        })
    }

    closeModal() {
        this.getData();
        this.setState({ modalAdd: false, modalResult: false });
    }

    delete(item) {
        this.setState({ confirmDialog: true, tempDelete: item })
    }

    cbDialog(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            interviewProvider.delete(param, this.state.tempDelete.id, (s, e) => {
                if (s && s.data) {
                    toast.success("Xóa tuyển dụng thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.getData();
                    this.setState({ tempDelete: {} });
                } else {
                    toast.error(s.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        }
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            console.log(this.state.page)
            this.getData()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getData()
        });
    };

    handleChangeFilter(event, type) {
        switch (type) {
            case 1:
                this.setState({
                    page: 0,
                    name: event.target.value
                }, () => {
                    if (this.xxx) {
                        try {
                            clearTimeout(this.xxx);
                        } catch (error) {
                        }
                    }
                    this.xxx = setTimeout(() => {
                        this.getData()
                    }, 500)
                })
                break;
            case 2:
                this.setState({
                    page: 0,
                    email: event.target.value
                }, () => {
                    if (this.xxx) {
                        try {
                            clearTimeout(this.xxx);
                        } catch (error) {
                        }
                    }
                    this.xxx = setTimeout(() => {
                        this.getData()
                    }, 500)
                })
                break;
        }
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        return (
            <div>
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-name"
                    label="Tìm kiếm họ và tên"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={(event) => this.handleChangeFilter(event, 1)}
                    margin="normal"
                />
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-email"
                    label="Tìm kiếm email"
                    className={classes.textField}
                    value={this.state.email}
                    onChange={(event) => this.handleChangeFilter(event, 2)}
                    margin="normal"
                />
                <Button variant="contained" color="primary" onClick={() => this.modalCreateUpdate()} style={{ marginLeft: 20 }}>Thêm mới</Button>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, page, size, total, progress, dataUpdate, confirmDialog, dataSpecialize, dataRecruitment, dataResult } = this.state;
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            title="Danh sách lịch phỏng vấn"
                            numSelected={0}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                        {progress ? <LinearProgress /> : null}
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Họ & Tên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>SĐT</TableCell>
                                    <TableCell>Vị trí</TableCell>
                                    <TableCell>Giờ phỏng vấn</TableCell>
                                    <TableCell>Trường</TableCell>
                                    <TableCell>Chuyên ngành</TableCell>
                                    <TableCell>Nguồn tuyển dụng</TableCell>
                                    <TableCell>Confirm</TableCell>
                                    <TableCell>Tham dự phỏng vấn</TableCell>
                                    <TableCell>Kết quả</TableCell>
                                    <TableCell>Actions</TableCell>
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
                                                <TableCell>{item.interview.name}</TableCell>
                                                <TableCell>{item.interview.email}</TableCell>
                                                <TableCell>{item.interview.phoneNumber}</TableCell>
                                                <TableCell>{item.specialize.name}</TableCell>
                                                <TableCell>{moment(item.interview.dateInterview).format('HH:mm DD-MM-YYYY')}</TableCell>
                                                <TableCell>{item.interview.university}</TableCell>
                                                <TableCell>{item.interview.majors}</TableCell>
                                                <TableCell>{item.recruitmentSources.name}</TableCell>
                                                <TableCell>
                                                    {
                                                        item.interview.confirm ?
                                                            <IconButton color="primary" className={classes.button} aria-label="CheckCircle">
                                                                <CheckCircle />
                                                            </IconButton> : ''
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.interview.attendInterview ?
                                                            <IconButton color="primary" className={classes.button} aria-label="CheckCircle">
                                                                <CheckCircle />
                                                            </IconButton> : ''
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.interview.result == 0 ?
                                                            <IconButton color="primary" className={classes.button} aria-label="AvTimer">
                                                                <AvTimer />
                                                            </IconButton>
                                                            : item.interview.result == 1 ?
                                                                <IconButton color="primary" className={classes.button} aria-label="CheckCircle">
                                                                    <CheckCircle />
                                                                </IconButton>
                                                                : <IconButton color="secondary" className={classes.button} aria-label="Cancel">
                                                                    <Cancel />
                                                                </IconButton>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => this.modalSetResult(item)} color="primary" className={classes.button} aria-label="Edit">
                                                        <Apps />
                                                    </IconButton>
                                                    <IconButton onClick={() => this.modalCreateUpdate(item)} color="primary" className={classes.button} aria-label="Edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                    <IconButton onClick={this.delete.bind(this, item.interview)} color="secondary" className={classes.button} aria-label="Edit">
                                                        <DeleteIcon />
                                                    </IconButton>
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
                    </div>
                </Paper>
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa tuyển dụng này?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.cbDialog.bind(this)} />}
                {this.state.modalAdd && <ModalAddUpdate data={dataUpdate} dataSpecialize={dataSpecialize} dataRecruitment={dataRecruitment} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalResult && <ModalResultInterview data={dataResult} callbackOff={this.closeModal.bind(this)} />}
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

Interview.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Interview);