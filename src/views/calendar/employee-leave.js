import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import dayOff from '../../data-access/dayOff';
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
import TablePaginationActions from '../../components/pagination/pagination'
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Tooltip from '@material-ui/core/Tooltip';
import EnhancedTableToolbar from '../../components/table-toolbar';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';

class EmployeeLeave extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 0,
            size: 10,
            total: 0,
            selected: [],
            numSelected: 0,
            modalAdd: false,
            dataDayOff: {},
            dataEdit: {},
            confirmDialog: false,
            filterByStatus: 0,
            progress: true
        }
        this.renderChirenToolbar = this.renderChirenToolbar.bind(this)
    }

    callbackDelete(text) {
        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    componentWillMount() {
        this.getData()
    }

    getData() {
        let param = {
            page: this.state.page + 1,
            size: this.state.size,
            status: this.state.filterByStatus
        }
        dayOff.search(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    data: s.data.data,
                    total: s.data.total,
                    progress: false
                })
            } else {
                this.setState({
                    progress: false
                })
            }
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

    onSelectAllClick = event => {
        if (event.target.checked) {
            this.setState(state => ({ selected: state.data.map(item => item.dayOffs.id) }));
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

    handleChangeFilter(event) {
        this.setState({
            page: 0,
            filterByStatus: event.target.value
        }, () => {
            this.getData()
        })
    }

    update(item, type) {
        this.setState({ progress: true })
        let params = {
            "dayOffs": [
                {
                    "id": item[0].id,
                    "status": type
                }
            ]
        }
        dayOff.update(params, (s, e) => {
            if (s && s.code == 0) {
                toast.success("Thực hiện thành công ", {
                    position: toast.POSITION.TOP_CENTER
                });
                this.setState({ page: 0 }, () => {
                    this.getData()
                })
            } else {
                toast.error("Không thể thực hiện vào lúc này", {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        })
    }

    appoverAll() {

    }

    checkEmployee(item) {
        let user = JSON.parse(localStorage.getItem("isofh"));
        if (user.specialize.name == "Leader" && item.employees.id == user.employees.id)
            return false
        return true
    }

    renderChirenToolbar() {
        const { filterByStatus } = this.state;
        return (
            <div>
                <FormControl>
                    <Select
                        value={filterByStatus}
                        onChange={
                            (event) => this.handleChangeFilter(event)
                        }
                        inputProps={{
                            name: 'filter',
                            id: 'filterByStatus',
                        }}
                        style={{
                            width: 130,
                            marginTop: 8
                        }}
                    >
                        <MenuItem value={0}>Chờ duyệt</MenuItem>
                        <MenuItem value={1}>Xác nhận</MenuItem>
                        <MenuItem value={2}>Từ chối</MenuItem>
                    </Select>
                </FormControl>
                {filterByStatus == 0 || filterByStatus == 2 ?
                    <Button variant="contained" size="small" color="primary" style={{ marginLeft: 20 }} onClick={this.appoverAll.bind(this)}>
                        Duyệt tất cả <CheckIcon style={{ marginLeft: 10 }} />
                    </Button>
                    :
                    null
                }
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, total, page, size, selected, filterByStatus, progress } = this.state;
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            title="Danh sách báo nghỉ"
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
                                        <TableCell>Họ và tên</TableCell>
                                        <TableCell>Phòng ban</TableCell>
                                        <TableCell>Ngày xin nghỉ</TableCell>
                                        <TableCell>Tổng số ngày nghỉ</TableCell>
                                        <TableCell>Lý do</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data ? data.map(item => {
                                        const isSelected = this.isSelected(item.dayOffs.id);
                                        return (
                                            <TableRow
                                                hover
                                                key={item.dayOffs.id}
                                                tabIndex={-1}
                                                selected={isSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onClick={event => this.listItemClicked(event, item.dayOffs.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.employees && item.employees.name}</TableCell>
                                                <TableCell>{item.department && item.department.name}</TableCell>
                                                <TableCell>{moment(item.dayOffs.dayOffDate).format('DD-MM-YYYY')}</TableCell>
                                                <TableCell>{item.dayOffs.totalDayOff}</TableCell>
                                                <TableCell style={{ width: 250, paddingRight: 24 }}>
                                                    <Tooltip title={item.dayOffs.reason}>
                                                        <div className={classes.contentClass}>{item.dayOffs.reason}</div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.dayOffs.status == 0 ? "Chờ duyệt" :
                                                            item.dayOffs.status == 1 ? "Đã duyệt" :
                                                                item.dayOffs.status == 2 ? "Đã từ chối" : ""
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {filterByStatus != 1 && this.checkEmployee(item) ?
                                                        <IconButton onClick={() => this.update([item.dayOffs], 1)} size="small" color="primary" className={classes.button} aria-label="Edit">
                                                            <CheckIcon />
                                                        </IconButton>
                                                        : null
                                                    }
                                                    {filterByStatus != 2 && this.checkEmployee(item) ?
                                                        <IconButton onClick={() => this.update([item.dayOffs], 2)} size="small" color="secondary" className={classes.button} aria-label="Edit">
                                                            <CloseIcon />
                                                        </IconButton>
                                                        : null
                                                    }
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
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: '100%',
        // marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    contentClass: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 1,
        WebkitBoxOrient: 'vertical'
    }
});

EmployeeLeave.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeLeave);