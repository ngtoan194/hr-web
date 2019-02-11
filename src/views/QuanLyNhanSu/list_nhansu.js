import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import { Link } from 'react-router-dom'
import ActionsComponent from '../../components/actions/actions_cmp';
import API from '../../config/api'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import userProvider from '../../data-access/user';
import Button from '@material-ui/core/Button';
import AttachFile from '@material-ui/icons/AttachFile';
import LinearProgress from '@material-ui/core/LinearProgress';
import ModalAddUser from './add_nhansu'
import TablePaginationActions from '../../components/pagination/pagination'
import EnhancedTableToolbar from '../../components/table-toolbar';
import departMentProvider from '../../data-access/department';
import specializeProvider from '../../data-access/specialize';
import recruitmentProvider from '../../data-access/recruitment';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import fileProvider from '../../data-access/file';
import moment from 'moment';

class ListNhanSu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            specializeId: -1,
            salaryProposed: -1,
            departmentId: -1,
            recruitmentSourcesId: -1,
            contractId: -1,
            insurranceId: -1,
            birthDay: null,
            users: [],
            modalAdd: false,
            total: 0,
            name: '',
            selected: [],
            selectDepartmentPosition: {
                department: [],
                position: [],
                recruitment: [],
                user: null
            },
            completed: 0,
            buffer: 10,
            progress: true
        }
        this.renderChirenToolbar = this.renderChirenToolbar.bind(this)
    }

    componentWillMount() {
        this.getData();
        // Promise.all([this.getDepartment(), this.getPosition(), this.getRecruitment()]).then(values => {
        //     debugger;
        //     this.setState({
        //         selectDepartmentPosition: {
        //             department: values[0],
        //             position: values[1],
        //             recruitment: values[2],
        //         }
        //     });
        // });

        this.getDepartment().then(x => {
            var selectDepartmentPosition = this.state.selectDepartmentPosition;
            selectDepartmentPosition.department = x;
            this.setState({ selectDepartmentPosition: selectDepartmentPosition }, () => {
                this.getPosition().then(x => {
                    var selectDepartmentPosition = this.state.selectDepartmentPosition;
                    selectDepartmentPosition.position = x;
                    this.setState({ selectDepartmentPosition: selectDepartmentPosition }, () => {
                        this.getRecruitment().then(x => {
                            var selectDepartmentPosition = this.state.selectDepartmentPosition;
                            selectDepartmentPosition.recruitment = x;
                            this.setState({ selectDepartmentPosition: selectDepartmentPosition })
                        })
                    })
                })
            })
        });
    }

    getDepartment() {
        let param = {
            page: 1,
            size: ''
        }
        return new Promise((resolve, reject) => {
            departMentProvider.search(param, (s, e) => {
                if (s && s.data) {
                    let tempData = [{
                        department: {
                            id: -1,
                            name: 'Phòng ban'
                        }
                    }]
                    for (var i = 0; i < s.data.data.length; i++) {
                        tempData.push(s.data.data[i])
                    }
                    resolve(tempData);
                } else {
                    resolve({});
                }
            })
        })
    }

    getPosition() {
        let param = {
            page: -1,
            size: -1
        }
        return new Promise((resolve, reject) => {
            specializeProvider.search(param, (s, e) => {
                if (s && s.data) {
                    let tempData = [{
                        specialize: {
                            id: -1,
                            name: 'Chuyên môn'
                        }
                    }]
                    for (var i = 0; i < s.data.data.length; i++) {
                        tempData.push(s.data.data[i])
                    }
                    resolve(tempData);
                } else {
                    resolve({});
                }
            })
        })
    }

    getRecruitment() {
        let param = {
            page: -1,
            size: -1,
            name: '',
            webSite: '',
            address: '',
            phoneNumber: '',
            contact: '',
            price: -1,
            numberEmployee: -1
        }
        return new Promise((resolve, reject) => {
            recruitmentProvider.search(param, (s, e) => {
                if (s && s.data) {
                    resolve(s.data.data);
                } else {
                    resolve({});
                }
            })
        })
    }

    getData() {
        this.setState({ progress: true })
        let params = {
            page: this.state.page + 1,
            size: this.state.size,
            specializeId: this.state.specializeId,
            salaryProposed: this.state.salaryProposed,
            departmentId: this.state.departmentId,
            recruitmentSourcesId: this.state.recruitmentSourcesId,
            contractId: this.state.contractId,
            insurranceId: this.state.insurranceId,
            birthDay: this.state.birthDay,
            name: this.state.name
        }
        userProvider.search(params, (s, e) => {
            if (s && s.data) {
                this.setState({
                    users: s.data.data,
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

    callbackDelete(text) {
        toast.success("Success Notification !", {
            position: toast.POSITION.TOP_CENTER
        });

        toast.error("Error Notification !", {
            position: toast.POSITION.TOP_LEFT
        });

        toast.warn("Warning Notification !", {
            position: toast.POSITION.BOTTOM_LEFT
        });

        toast.info("Info Notification !", {
            position: toast.POSITION.BOTTOM_CENTER
        });

        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
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

    modalCreateUpdateUser(employeer) {
        if (employeer) {
            var selectDepartmentPosition = this.state.selectDepartmentPosition;
            selectDepartmentPosition.user = employeer
            this.setState({
                selectDepartmentPosition: selectDepartmentPosition,
                modalAdd: true
            })
        } else {
            var selectDepartmentPosition = this.state.selectDepartmentPosition;
            selectDepartmentPosition.user = null
            this.setState({
                selectDepartmentPosition: selectDepartmentPosition,
                modalAdd: true
            })
        }

    }

    closeModal() {
        this.getData()
        this.setState({ modalAdd: false });
    }

    // edit(event, id) {
    //     // {
    //     //     "employees": {
    //     //         "name":"Quach Thanh Vu",
    //     //         "isofhMail":"mail@isofh.com.vn"
    //     //     }, 
    //     //     "departmentId":1, 
    //     //     "recruitmentSourcesId":1, 
    //     //     "contractId":1, 
    //     //     "insurranceId":2
    //     // }

    //     // toast.warn("Chức năng đang phát triển !", {
    //     //     position: toast.POSITION.BOTTOM_LEFT
    //     // });
    // }

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

    xxx = null

    handleChangeFilter(event, type) {
        if (type == 1) {
            this.setState({ page: 0, departmentId: event.target.value }, () => { this.getData() })
        }
        if (type == 2) {
            this.setState({ page: 0, specializeId: event.target.value }, () => { this.getData() })
        }
        if (type == 3) {
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
        }

    }

    showCV(cv) {
        fileProvider.viewFile(cv.split('/').pop(), cb => {
            if (cb) {
                window.open("https://drive.google.com/viewerng/viewer?url=" + cb, "_blank")
            } else {
                alert("Lỗi")
            }
        })

    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const { departmentId, specializeId, selectDepartmentPosition } = this.state;
        return (
            <div>
                <TextField
                    style={{
                        marginTop: 0,
                        marginLeft: 20
                    }}
                    id="standard-name"
                    label="Tìm kiếm tên nhân viên"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={(event) => this.handleChangeFilter(event, 3)}
                    margin="normal"
                />
                {
                    selectDepartmentPosition && selectDepartmentPosition.department ?
                        <FormControl style={{ marginLeft: 20 }}>
                            <Select
                                value={departmentId}
                                onChange={(event) => this.handleChangeFilter(event, 1)}
                                inputProps={{ name: 'filter', id: 'filterByStatus', }}
                                style={{ width: 130, marginTop: 16 }}>
                                {
                                    selectDepartmentPosition.department.map((option, index) =>
                                        <MenuItem key={index} value={option.department.id}>{option.department.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        : null
                }

                {
                    selectDepartmentPosition && selectDepartmentPosition.position ?
                        <FormControl style={{ marginLeft: 20 }}>
                            <Select
                                value={specializeId}
                                onChange={(event) => this.handleChangeFilter(event, 2)}
                                inputProps={{ name: 'filter', id: 'filterByStatus', }}
                                style={{ width: 130, marginTop: 16 }}>
                                {

                                    selectDepartmentPosition.position.map((option, index) =>
                                        <MenuItem key={index} value={option.specialize.id}>{option.specialize.name}</MenuItem>
                                    )
                                }
                            </Select>
                        </FormControl>
                        : null
                }

                <Button variant="contained" color="primary" onClick={() => this.modalCreateUpdateUser()} style={{ marginLeft: 20 }}>Thêm mới</Button>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { users, page, size, total, selectDepartmentPosition, progress } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            title="Danh sách nhân viên"
                            numSelected={0}
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                        {progress ? <LinearProgress /> : null}
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Avatar</TableCell>
                                    <TableCell>Họ & Tên</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>T/G Làm Việc</TableCell>
                                    <TableCell>Chuyên Môn</TableCell>
                                    <TableCell>Mức Lương</TableCell>
                                    <TableCell>Phòng Ban</TableCell>
                                    <TableCell style={{ paddingLeft: 40 }}>CV</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    users && users.length ? users.map((user, index) => {
                                        return (
                                            <TableRow
                                                hover
                                                key={index}
                                                tabIndex={-1}>
                                                <TableCell>
                                                    {user.employees.image ?
                                                        <Avatar alt="Remy Sharp" src={user.employees.image.absoluteUrl()} className={classes.avatar} />
                                                        :
                                                        <Avatar alt="Remy Sharp" src="/assets/avatars/1.jpg" className={classes.avatar} />
                                                    }
                                                </TableCell>
                                                <TableCell>{user.employees.name}</TableCell>
                                                <TableCell>{user.employees.mail}</TableCell>
                                                <TableCell>{user.workingTime ? moment(user.workingTime.startDate).format('DD-MM-YYYY') : ''}</TableCell>
                                                <TableCell>{user.specialize ? user.specialize.name : ''}</TableCell>
                                                <TableCell>{user.employees.salaryProposed && user.employees.salaryProposed != 0 ? user.employees.salaryProposed.toLocaleString('it-IT', { style: 'currency', currency: 'VND' }) : user.employees.salaryProposed}</TableCell>
                                                <TableCell>{user.department ? user.department.name : "Chưa có phòng ban"}</TableCell>
                                                <TableCell>
                                                    {
                                                        user.employees.cv ?
                                                            <IconButton onClick={() => this.showCV(user.employees.cv)} color="primary"> <AttachFile /> </IconButton>
                                                            :
                                                            <IconButton disabled={true}><AttachFile /></IconButton>
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {/* {
                                                        user.employees.cv ?
                                                            <IconButton onClick={() => this.showCV(user.employees.cv)} color="primary"> <Visibility /> </IconButton>
                                                            :
                                                            <IconButton disabled={true}><Visibility /></IconButton>
                                                    } */}
                                                    <IconButton onClick={() => this.modalCreateUpdateUser(user)} color="primary" className={classes.button} aria-label="Edit">
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                        :
                                        <TableRow>
                                            <TableCell>Danh sách trống</TableCell>
                                        </TableRow>}
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
                {
                    this.state.modalAdd && <ModalAddUser dataselect={selectDepartmentPosition} callbackOff={this.closeModal.bind(this)} />
                }
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
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto',
        },
    },
    searchIcon: {
        width: theme.spacing.unit * 9,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

ListNhanSu.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ListNhanSu);