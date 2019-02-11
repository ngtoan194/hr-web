import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ModalAddDepartment from './add_department'
import TablePaginationActions from '../../../components/pagination/pagination'
import DeleteIcon from '@material-ui/icons/Delete';
import departMentProvider from '../../../data-access/department';
import ActionsComponent from '../../../components/actions/actions_cmp';
import userProvider from '../../../data-access/user';
import ConfirmDialog from '../../../components/confirm/'

class DepartMent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            departments: [],
            page: 0,
            size: 10,
            rowsPerPage: 10,
            numSelected: 0,
            count: 0,
            modalAdd: false,
            selected: [],
            users: [],
            confirmDialog: false,
        }
        this.addDepartment = this.addDepartment.bind(this)
    }

    componentWillMount() {
        this.getData();
        this.getUsers();
    }

    getUsers() {
        let params = {
            page: -1,
            size: -1,
            specialize: '',
            salaryProposed: '',
            departmentId: '',
            recruitmentSourcesId: '',
            contractId: '',
            insurranceId: '',
            birthDay: '',
            name:''
        }
        userProvider.search(params, (s, e) => {
            console.log(s)
            if (s && s.data) {
                this.setState({
                    users: s.data.data,
                })
            }
        })
    }

    getData() {
        let param = {
            page: this.state.page + 1,
            size: this.state.size
        }
        departMentProvider.search(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    departments: s.data.data,
                    count: s.data.total
                })
            } else {
                toast.error("Không lấy được phòng ban", {
                    position: toast.POSITION.BOTTOM_CENTER
                });
            }
        })
    }

    addDepartment(department) {
        if(department) {
            this.setState({ 
                departmentModal: department,
                modalAdd: true 
            })
        } else {
            this.setState({
                departmentModal:null, 
                modalAdd: true 
            })
        }
    }

    closeModal() {
        this.setState({ modalAdd: false })
        this.getData();
    }

    callbackDelete(text) {
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
            console.log(this.state.page)
            this.getData()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getData()
        });
    };

    onSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.departments.map(departments => departments.department.id) }));
            return;
        }
        this.setState({ selected: [] });
    }

    isSelected = id => this.state.selected.indexOf(id) !== -1;

    listItemClicked(event, id) {
        const { selected } = this.state;
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        this.setState({ selected: newSelected });
    }


    cbDialog(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            departMentProvider.delete(param, this.state.tempDelete.id, (s, e) => {
                if (s && s.data) {
                    toast.success("Xóa phòng thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.getData();
                    this.setState({ tempDelete: {} });
                } else {
                    if(s.code == 2) {
                        toast.error("Phòng (" + this.state.tempDelete.name + ") đang có nhân viên", {
                            position: toast.POSITION.TOP_CENTER
                        });
                    } else {
                        toast.error(s.message, {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                }
            })
        }
    }

    delete(item) {
        this.setState({ confirmDialog: true, tempDelete: item })
    }

    render() {
        const { classes } = this.props;
        const { departments, departmentModal, rowsPerPage, page, numSelected, rowCount, count, users, confirmDialog } = this.state;
        console.log(departments)
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <ActionsComponent
                    children={
                        <Button variant="contained" color="primary" className={classes.button} onClick={() => this.addDepartment()}>
                            Thêm <Icon className={classNames(classes.icon, 'fa fa-plus-circle')} />
                        </Button>
                    }
                />
                <Paper className={classes.root}>
                    <Table className={classes.table} aria-labelledby="tableTitle">
                        <TableHead>
                            <TableRow>
                                {/* <TableCell padding="checkbox">
                                    <Checkbox
                                        indeterminate={numSelected > 0 && numSelected < rowCount}
                                        checked={numSelected === rowCount}
                                        onChange={this.onSelectAllClick}
                                    />
                                </TableCell> */}
                                <TableCell>Tên phòng ban</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Người phụ Trách</TableCell>
                                <TableCell>Tổng số nhân viên</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {departments ? departments.map((department, index) => {
                                const isSelected = this.isSelected(department.department.id);
                                return (
                                    <TableRow
                                        hover
                                        key={department.department.id}
                                        tabIndex={-1}
                                        selected={isSelected}>
                                        {/* <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isSelected}
                                                onClick={event => this.listItemClicked(event, department.department.id)}
                                            />
                                        </TableCell> */}
                                        <TableCell>{department.department.name}</TableCell>
                                        <TableCell>{department.department.describeDepartment}</TableCell>
                                        <TableCell>{department.leader ? department.leader.name : ''}</TableCell>
                                        <TableCell>{department.totalEmployees}</TableCell>
                                        <TableCell>
                                            <IconButton onClick={event => this.addDepartment(department)} color="primary" className={classes.button} aria-label="Edit">
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton onClick={this.delete.bind(this, department.department)} color="secondary" className={classes.button} aria-label="Edit">
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                                : <div>không có dữ liệu</div>
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    labelRowsPerPage="Số dòng trên trang"
                                    rowsPerPageOptions={[10, 20, 50, 100]}
                                    colSpan={3}
                                    count={count}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActions}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </Paper>
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa phòng ban này?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.cbDialog.bind(this)} />}
                {this.state.modalAdd && <ModalAddDepartment dataselect={users} department={departmentModal}  callbackOff={this.closeModal.bind(this)} />}
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
});

DepartMent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DepartMent);