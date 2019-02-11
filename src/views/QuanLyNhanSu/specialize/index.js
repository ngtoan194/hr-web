import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import specialize from '../../../data-access/specialize';
import roleProvider from '../../../data-access/roles';
import ActionsComponent from '../../../components/actions/actions_cmp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import TablePaginationActions from '../../../components/pagination/pagination'
import Checkbox from '@material-ui/core/Checkbox';
import ModalAddSpecialize from './add_specialize'
import ConfirmDialog from '../../../components/confirm/'
import ModalGrantRoleForSpecialize from './grant_role'

class PositionCMP extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            specializes: [],
            page: 0,
            size: 10,
            total: 0,
            selected: [],
            numSelected: 0,
            modalAdd: false,
            modalGrantRole: false,
            dataSpecialize: {},
            dataEdit: {},
            confirmDialog: false,
        }
    }

    callbackDelete(text) {

        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    componentWillMount() {
        this.getData()
        this.getRoles()
    }
    getRoles() {
        let param = {
            value: ''
        }
        roleProvider.search(param,(s, e) => {
            console.log(s)
            if(s && s.data && s.data.data.length > 0) {
                this.setState({roles: s.data.data})
            } else {
                console.log("Không lấy được rolse")
            }
        })
    }
    getData() {
        let param = {
            page: this.state.page + 1,
            size: this.state.size
        }
        specialize.search(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    specializes: s.data.data,
                    total: s.data.total
                })
            }
        })
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
            this.setState(state => ({ selected: state.specializes.map(item => item.specialize.id) }));
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

    addNew(item) {
        this.setState({ modalAdd: true })
        if (item) {
            this.setState({ dataEdit: item });
        } else {
            this.setState({ dataEdit: {} });
        }
    }

    closeModal() {
        this.getData()
        this.setState({ modalAdd: false });
    }

    closeModalGrantRoleForSpecialize() {
        this.setState({modalGrantRole: false},() => {
            this.getData();
        })
    }

    cbDialog(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            specialize.delete(param, this.state.tempDelete.id, (s, e) => {
                if (s && s.data) {
                    toast.success("Xóa chuyên môn thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                    this.getData();
                    this.setState({tempDelete: {}});
                } else {
                    toast.error("Xóa chuyên môn không thành công!", {
                        position: toast.POSITION.TOP_RIGHT
                    });
                }
            })
        }
    }

    delete(item) {
        this.setState({ confirmDialog: true, tempDelete:item })
    }

    grantRoles(item) {
        this.setState({
            modalGrantRole: true,
            rolseOfSpecialize: item
        })
    }

    render() {
        const { classes } = this.props;
        const { specializes, total, page, size, selected, dataSpecialize, dataEdit, confirmDialog } = this.state;
        const DELETEDATA = {
            url: "dấdsadsadas",
            param: { test: 1, valie: "asdada", tesst: 0 },
            callback: this.callbackDelete.bind(this)
        }
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <ActionsComponent
                    children={
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.addNew.bind(this, null)}>
                            Thêm <Icon className={classNames(classes.icon, 'fa fa-plus-circle')} />
                        </Button>
                    }
                    DELETE={DELETEDATA}
                />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell padding="checkbox">
                                        <Checkbox checked={selected.length === specializes.length} onChange={this.onSelectAllClick} />
                                    </TableCell>
                                    <TableCell>Chuyên Môn</TableCell>
                                    <TableCell>Ghi chú</TableCell>
                                    <TableCell>Nhóm quyền</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {specializes ? specializes.map(item => {
                                    const isSelected = this.isSelected(item.specialize.id);
                                    return (
                                        <TableRow
                                            hover
                                            key={item.specialize.id}
                                            tabIndex={-1}
                                            selected={isSelected}>
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onClick={event => this.listItemClicked(event, item.specialize.id)}
                                                />
                                            </TableCell>
                                            <TableCell>{item.specialize.name}</TableCell>
                                            <TableCell>{item.specialize.note}</TableCell>
                                            <TableCell><Button size="small" color="primary" onClick={() => this.grantRoles(item)}>Gán quyền</Button></TableCell>
                                            <TableCell>
                                                <IconButton onClick={this.addNew.bind(this, item.specialize)} color="primary" className={classes.button} aria-label="Edit">
                                                    <EditIcon />
                                                </IconButton>
                                                <IconButton onClick={this.delete.bind(this, item.specialize)} color="secondary" className={classes.button} aria-label="Edit">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                }) : null}
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
                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn xóa chuyên môn này?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.cbDialog.bind(this)} />}
                {this.state.modalAdd && <ModalAddSpecialize dataEdit={dataEdit} dataselect={dataSpecialize} callbackOff={this.closeModal.bind(this)} />}
                {this.state.modalGrantRole && <ModalGrantRoleForSpecialize 
                    data={this.state.rolseOfSpecialize} 
                    roles={this.state.roles} 
                    cbOffModal={this.closeModalGrantRoleForSpecialize.bind(this)}/>}
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

PositionCMP.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PositionCMP);