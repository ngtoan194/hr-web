import React, { Component } from 'react'
import moment from 'moment';
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
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import TablePaginationActions from '../../components/pagination/pagination'
import Checkbox from '@material-ui/core/Checkbox';
import ConfirmDialog from '../../components/confirm/'
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import EnhancedTableToolbar from '../../components/table-toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import ActionsComponent from '../../components/actions/actions_cmp';
import contractProvider from '../../data-access/contract';
import AddIcon from '@material-ui/icons/Add';
import ModalAddContact from './add_contract';
import userProvider from '../../data-access/user';
class Contract extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            size: 10,
            name: '',
            type: -1,
            data: [],
            selected: [],
            numSelected: 0,
            users: [],
            contractEdit:null,
            progress: true
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

    onSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(item => item.contract.id) }));
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

    componentWillMount() {
        this.getData()
        this.getUsers()
    }

    getData() {
        const { page, size, name, type } = this.state;
        const param = {
            page: page + 1, size, name, type
        }
        contractProvider.search(param, (s, e) => {
            console.log(s, e)
            if (s && s.data) {
                this.setState({
                    data: s.data.data,
                    total: s.data.total,
                    progress: false
                })
            } else {
                this.setState({ progress: false })
            }
        })
    }

    callbackDelete(text) {
        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    clearTimeOutAffterRequest = null
    handleChangeFilter(event, action) {
        if (action == 1) {
            this.setState({
                page: 0,
                name: event.target.value
            }, () => {
                if (this.clearTimeOutAffterRequest) {
                    try {
                        clearTimeout(this.clearTimeOutAffterRequest);

                    } catch (error) {

                    }
                }
                this.clearTimeOutAffterRequest = setTimeout(() => {
                    this.getData()
                }, 500)
            })
        }
        if (action == 2) {
            this.setState({
                page: 0,
                type: event.target.value
            }, () => {
                this.getData()
            })
        }
    }

    createUpdateContact(contract) {
        if(contract) {
            this.setState({
                modalAdd: true,
                contractEdit:contract
            })
        } else {
            this.setState({
                modalAdd: true,
                contractEdit:null
            })
        }
    }

    closeModal() {
        this.getData()
        this.setState({ modalAdd: false });
    }

    renderChirenToolbar() {
        const { classes } = this.props;
        const { type, name } = this.state;
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
                    value={name}
                    onChange={(event) => this.handleChangeFilter(event, 1)}
                    margin="normal"
                />
                <FormControl style={{ marginLeft: 20, marginTop:8 }}>
                    <Select
                        value={type}
                        onChange={
                            (event) => this.handleChangeFilter(event, 2)
                        }
                        inputProps={{
                            name: 'filter',
                            id: 'filterByType',
                        }}
                        style={{
                            width: 130,
                            marginTop: 8
                        }}
                    >
                        <MenuItem value={-1}>Tất cả</MenuItem>
                        <MenuItem value={0}>Chính thức</MenuItem>
                        <MenuItem value={1}>Thử Việc</MenuItem>
                        <MenuItem value={2}>Cộng Tác Viên</MenuItem>
                        <MenuItem value={3}>Thực tập có lương</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" size="small" color="primary" style={{ marginLeft: 20, marginTop:10 }} onClick={() =>this.createUpdateContact(null)}>
                    Thêm mới <CheckIcon style={{ marginLeft: 10 }} />
                </Button>
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { page, size, selected, progress, data, total, users, modalAdd, contractEdit } = this.state;
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            title="Danh sách hợp đồng"
                            actionsChiren={
                                this.renderChirenToolbar()
                            }
                        />
                        {progress ? <LinearProgress /> : null}
                        {data && data.length ?
                            <Table className={classes.table} aria-labelledby="tableTitle">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox checked={selected.length === data.length} onChange={this.onSelectAllClick} />
                                        </TableCell>
                                        <TableCell>Số HĐ</TableCell>
                                        <TableCell>Nhân viên</TableCell>
                                        <TableCell>Bộ phận</TableCell>
                                        <TableCell>Loại HĐ</TableCell>
                                        <TableCell>File HĐ</TableCell>
                                        <TableCell>Ngày ký</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data ? data.map(item => {
                                        const isSelected = this.isSelected(item.contract.id);
                                        return (
                                            <TableRow
                                                hover
                                                key={item.contract.id}
                                                tabIndex={-1}
                                                selected={isSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onClick={event => this.listItemClicked(event, item.contract.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.contract.code}</TableCell>
                                                <TableCell>{item.employees.name ? item.employees.name : ''}</TableCell>
                                                <TableCell>{item.department.name ? item.department.name : ''}</TableCell>
                                                <TableCell>
                                                    {
                                                        item.contract.type == 0 ? "Chính thức" :
                                                            item.contract.type == 1 ? "Thử Việc" :
                                                                item.contract.type == 2 ? "Cộng Tác Viên" :
                                                                    item.contract.type == 3 ? "Thực tập có lương" : 'Chưa có loại'
                                                    }
                                                </TableCell>
                                                <TableCell style={{ width: 250, paddingRight: 24 }}>
                                                    <Tooltip title={item.contract.contractAttach ? item.contract.contractAttach : ''}>
                                                        <div className={classes.contentClass}>
                                                            {/* {item.contract.contractAttach}  */}
                                                            <a href="">  https://wiki.isofh.com.vn/index.php/Quanlynhansu</a>
                                                        </div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>{moment(item.contract.dateContract).format('DD-MM-YYYY')}</TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        onClick={() => this.createUpdateContact(item.contract)} 
                                                        size="small"
                                                        color="primary"
                                                        className={classes.button} aria-label="Edit">
                                                        <EditIcon />
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
                            : <p>Danh sách trống</p>
                        }

                    </div>
                </Paper>
                {
                    modalAdd && <ModalAddContact dataselect={contractEdit} users={users} callbackOff={this.closeModal.bind(this)} />
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
});

Contract.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Contract);