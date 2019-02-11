import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import overtimeProvider from '../../data-access/overtime';
import moment from 'moment';
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

class OderOT extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            page: 0,
            size: 10,
            filterByConfirm: 0,
            total: 0,
            selected: [],
            numSelected: 0,
            modalAdd: false,
            dataDayOff: {},
            dataEdit: {},
            confirmDialog: false,
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
            confirm: this.state.filterByConfirm
        }
        overtimeProvider.search(param, (s, e) => {
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
            this.setState(state => ({ selected: state.data.map(item => item.overTime.id) }));
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
            filterByConfirm: event.target.value,
            numSelected: 0,
            selected: []
        }, () => {
            this.getData()
        })
    }

    update(item, type) {
        this.setState({ progress: true })
        let params = {
            "id": item[0].id,
            "overTime": {
                "confirm": type
            }
        }
        overtimeProvider.update(params, (s, e) => {
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
                this.setState({ progress: false })
            }
        })
    }

    appoverAll() {

    }

    checkEmployee(item){
        let user = JSON.parse(localStorage.getItem("isofh"));
        if (user.specialize.name == "Leader" && item.employees.id == user.employees.id)
            return false
        return true
    }

    renderChirenToolbar() {
        const { filterByConfirm } = this.state;
        return (
            <div>
                <FormControl>
                    <Select
                        value={filterByConfirm}
                        onChange={
                            (event) => this.handleChangeFilter(event)
                        }
                        inputProps={{
                            name: 'filter',
                            id: 'filterByConfirm',
                        }}
                        style={{
                            width: 130,
                            marginTop: 8
                        }}>
                        <MenuItem value={0}>Chờ duyệt</MenuItem>
                        <MenuItem value={1}>Đã Xác nhận</MenuItem>
                        <MenuItem value={2}>Đã Từ chối</MenuItem>
                    </Select>
                </FormControl>
                {/* { filterByConfirm == 0 || filterByConfirm == 2 ?
                    <Button variant="contained" size="small" color="primary" style={{ marginLeft: 20 }} onClick={this.appoverAll.bind(this)}>
                        Duyệt tất cả <CheckIcon style={{ marginLeft: 10 }} />
                    </Button>
                    :
                    null
                } */}
            </div>
        )
    }

    render() {
        const { classes } = this.props;
        const { data, total, page, size, selected, filterByConfirm, progress } = this.state;
        console.log(data)
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <div className={classes.tableWrapper}>
                        <EnhancedTableToolbar
                            numSelected={selected.length}
                            title="Danh sách OT"
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
                                        <TableCell>Ngày</TableCell>
                                        <TableCell>Thời gian</TableCell>
                                        <TableCell>Time OT</TableCell>
                                        <TableCell>Lý do</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data ? data.map(item => {
                                        const isSelected = this.isSelected(item.overTime.id);
                                        return (
                                            <TableRow
                                                hover
                                                key={item.overTime.id}
                                                tabIndex={-1}
                                                selected={isSelected}>
                                                <TableCell padding="checkbox">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onClick={event => this.listItemClicked(event, item.overTime.id)}
                                                    />
                                                </TableCell>
                                                <TableCell>{item.employees.name}</TableCell>
                                                <TableCell>{item.department ? item.department.name : ''}</TableCell>
                                                <TableCell>{moment(item.overTime.startOT).format('DD-MM-YYYY')}</TableCell>
                                                <TableCell>{moment(item.overTime.startOT).format('HH:mm')}</TableCell>
                                                <TableCell>{item.overTime.totalOT}</TableCell>
                                                <TableCell style={{ width: 150, paddingRight: 24 }}>
                                                    <Tooltip title={item.overTime.note ? item.overTime.note : ''}>
                                                        <div className={classes.contentClass}> {item.overTime.note} </div>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {
                                                        item.overTime.confirm == 0 ? "Chờ duyệt" :
                                                            item.overTime.confirm == 1 ? "Đã duyệt" :
                                                                item.overTime.confirm == 2 ? "Đã từ chối" : ""
                                                    }
                                                </TableCell>
                                                <TableCell>
                                                    {filterByConfirm != 1 && this.checkEmployee(item) ?
                                                        <IconButton onClick={() => this.update([item.overTime], 1)} size="small" color="primary" className={classes.button} aria-label="Edit">
                                                            <CheckIcon />
                                                        </IconButton>
                                                        : null
                                                    }
                                                    {filterByConfirm != 2  && this.checkEmployee(item)?
                                                        <IconButton onClick={() => this.update([item.overTime], 2)} size="small" color="secondary" className={classes.button} aria-label="Edit">
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

OderOT.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(OderOT);