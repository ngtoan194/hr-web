import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { ToastContainer, toast } from 'react-toastify';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import moment from 'moment';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import employeeProvider from '../../data-access/user';
import fileProvider from '../../data-access/file'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePaginationActions from '../../components/pagination/pagination'
import LinearProgress from '@material-ui/core/LinearProgress';
import { th } from 'date-fns/esm/locale';

class ExportTimeKeeping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dateSelect: new Date(),
            page: 0,
            size: 10,
            total: 0,
            data: [],
            progress: true,

        }
    }

    componentWillMount() {
        this.getData();
    }

    handleDateChange = date => {
        this.setState({ dateSelect: date });
    };

    exportFile() {
        let param = {
            date: moment(this.state.dateSelect).format('YYYYMMDD'),
            page: this.state.page + 1,
            size: this.state.size,
        }
        employeeProvider.getFileTimeKeepingByMonth(param, (s, e) => {
            console.log(s, e)
            if (s && s.code == 0 && s.data) {
                this.downloadFile(s.data.fileName)
            } else {
                toast.error(s.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }

        })
    }

    getData() {
        this.setState({ progress: true })
        let param = {
            date: moment(this.state.dateSelect).format('YYYYMMDD'),
            page: this.state.page + 1,
            size: this.state.size,
        }
        employeeProvider.getFileTimeKeepingByMonth(param, (s, e) => {
            console.log(s, e)
            if (s && s.code == 0 && s.data) {
                this.setState({
                    data: s.data.data,
                    total: s.data.total
                })
            } else {
                toast.error(s.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
            this.setState({ progress: false })
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
        this.setState({
            size: event.target.value
        }, () => {
            this.getData()
        });
    };

    downloadFile(file) {
        fileProvider.downloadFile(file, (s, e) => {
            window.open(s);
        })
    }

    render() {
        const { classes } = this.props;
        const { dateSelect, data, page, size, total, progress } = this.state;
        return (
            <div>
                <ToastContainer autoClose={3000} />
                <Paper className={classes.root}>
                    <Grid container spacing={16}>
                        <Grid item xs={3} md={3}>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <DatePicker
                                    value={dateSelect}
                                    onChange={this.handleDateChange}
                                    leftArrowIcon={<KeyboardArrowLeft />} 
                                    rightArrowIcon={<KeyboardArrowRight />}
                                    maxDate={new Date()}
                                    labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                    style={{ width: '100%' }}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={3} md={3}>
                            <Button onClick={() => this.exportFile()} variant="contained" color="primary" className={classes.button}>Export</Button>
                        </Grid>
                    </Grid>
                    <div className={classes.tableWrapper}>
                        {progress ? <LinearProgress /> : null}
                        <Table className={classes.table} aria-labelledby="tableTitle">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Họ & Tên</TableCell>
                                    <TableCell>Chuyên môn</TableCell>
                                    <TableCell>Phòng  ban</TableCell>
                                    <TableCell>Lương cứng</TableCell>
                                    <TableCell>Điện thoại</TableCell>
                                    <TableCell>OT</TableCell>
                                    <TableCell>Ăn trưa</TableCell>
                                    <TableCell>Ăn đêm</TableCell>
                                    <TableCell>Số ngày làm trong tháng</TableCell>
                                    <TableCell>Ngày phép</TableCell>
                                    <TableCell>Số ngày công trong tháng</TableCell>
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
                                                <TableCell>{item.name}</TableCell>
                                                <TableCell>{item.specializeName}</TableCell>
                                                <TableCell>{item.departmentName}</TableCell>
                                                <TableCell>{item.salaryProposed}</TableCell>
                                                <TableCell></TableCell>
                                                <TableCell>{item.sumOt}</TableCell>
                                                <TableCell>{item.sumLunchDay}</TableCell>
                                                <TableCell>{item.sumDinnerDay}</TableCell>
                                                <TableCell>{item.sumDayWorking}</TableCell>
                                                <TableCell>{item.sumDayOff}</TableCell>
                                                <TableCell>{item.dayWorkingMonth}</TableCell>
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
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: '100%',
    },
    table: {
        minWidth: 1024,
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

ExportTimeKeeping.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExportTimeKeeping);