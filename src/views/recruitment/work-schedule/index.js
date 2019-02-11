import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
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
import CheckIcon from '@material-ui/icons/Check';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';
import Apps from '@material-ui/icons/Apps';
import TablePaginationActions from '../../../components/pagination/pagination'
import DeleteIcon from '@material-ui/icons/Delete';
import moment from 'moment';
import Tooltip from '@material-ui/core/Tooltip';
import ModalUpdate from './update'
import ModalConfirm from './confirm'
import workScheduleProvider from '../../../data-access/workSchedule';
import specializeProvider from '../../../data-access/specialize';
import departmentProvider from '../../../data-access/department';
import recruitmentProvider from '../../../data-access/recruitment';
import ConfirmDialog from '../../../components/confirm/'

class WorkSchedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            dateStartWork: '',
            data: [],
            total: 0,
            selected: [],
            progress: true,
            popupUpdate: false,
            modalConfirm: false,
            confirmDialog: false,
            listSpecialize: [],
            listRecruitment: [],
            listDepartment: [],
        }
        this.renderChirenToolbar = this.renderChirenToolbar.bind(this)
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
            dateStartWork: this.state.dateStartWork,
        }
        workScheduleProvider.search(params, (s, e) => {
            if (s && s.data) {
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

    getDepartment() {
        let param = {
            page: 1,
            size: ''
        }
        departmentProvider.search(param, (s, e) => {
            if (s && s.data) {
                let dataTemp = [{
                    department: {
                        id: -1,
                        name: 'Phòng ban'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }
                this.setState({
                    listDepartment: dataTemp
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
        this.getDepartment();
        // this.getRecruitment();
    }

    showUpdate(item) {
        this.setState({
            popupUpdate: true,
            dataUpdate: item,
        })
    }

    modalSetResult(item) {
        this.setState({
            modalConfirm: true,
            dataResult: item,
            dataSpecialize: this.state.listSpecialize,
            dataDepartment: this.state.listDepartment,
        })
    }

    closeModal() {
        this.getData();
        this.setState({ popupUpdate: false, modalConfirm: false });
    }

    delete(item) {
        this.setState({ confirmDialog: true, tempDelete: item })
    }

    cbDialog(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            workScheduleProvider.delete(param, this.state.tempDelete.id, (s, e) => {
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
                {/* <TextField
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
                /> */}
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, page, size, total, progress, dataUpdate, confirmDialog, dataResult, dataSpecialize, dataDepartment, dataRecruitment } = this.state;
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            title="Danh sách lịch đi làm"
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
                                    {/* <TableCell>Email iSofh</TableCell> */}
                                    <TableCell>Vị trí</TableCell>
                                    {/* <TableCell>Trường</TableCell>
                                    <TableCell>Chuyên ngành</TableCell>
                                    <TableCell>Nguồn tuyển dụng</TableCell> */}
                                    <TableCell>Ngày đi làm</TableCell>
                                    <TableCell>Lương</TableCell>
                                    {/* <TableCell>Xác nhận</TableCell> */}
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
                                                <TableCell className={classes.table_cell}>{item.interview.name}</TableCell>
                                                <TableCell className={classes.table_cell}>{item.interview.email}</TableCell>
                                                <TableCell className={classes.table_cell}>{item.interview.phoneNumber}</TableCell>
                                                {/* <TableCell className={classes.table_cell}></TableCell> */}
                                                <TableCell className={classes.table_cell}>{item.specialize.name}</TableCell>
                                                {/* <TableCell className={classes.table_cell}>{item.interview.university}</TableCell>
                                                <TableCell className={classes.table_cell}>{item.interview.majors}</TableCell>
                                                <TableCell className={classes.table_cell}>{item.recruitmentSources.name}</TableCell> */}
                                                <TableCell className={classes.table_cell}>{moment(item.workSchedule.dateStartWork).format("DD-MM-YYYY")}</TableCell>
                                                <TableCell className={classes.table_cell}>{item.workSchedule.salaryProposed}</TableCell>
                                                {/* <TableCell className={classes.table_cell}>
                                                    {
                                                        item.workSchedule.status ?
                                                            <IconButton color="primary" className={classes.button} aria-label="CheckCircle">
                                                                <CheckCircle />
                                                            </IconButton>
                                                            : <IconButton color="secondary" className={classes.button} aria-label="Cancel">
                                                                <Cancel />
                                                            </IconButton>
                                                    }
                                                </TableCell> */}
                                                <TableCell className={classes.table_cell}>
                                                    <Tooltip title='Edit'>
                                                        <IconButton onClick={() => this.showUpdate(item)} color="primary" className={classes.button} aria-label="Edit">
                                                            <EditIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title='Xác nhận đến làm việc'>
                                                        <IconButton onClick={() => this.modalSetResult(item)} color="primary" className={classes.button} aria-label="Edit">
                                                            <CheckIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {/* <IconButton onClick={this.delete.bind(this, item.interview)} color="secondary" className={classes.button} aria-label="Edit">
                                                        <DeleteIcon />
                                                    </IconButton> */}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell className={classes.table_cell}>Danh sách trống</TableCell>
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
                {this.state.popupUpdate && <ModalUpdate data={dataUpdate} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalConfirm && <ModalConfirm data={dataResult} dataSpecialize={dataSpecialize} dataDepartment={dataDepartment} callbackOff={this.closeModal.bind(this)} />}
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
        minWidth: 1024,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    table_cell: {
        // borderLeft: '1px solid #ececec'
    }
});

WorkSchedule.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(WorkSchedule);