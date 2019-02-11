import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardBody, CardFooter, CardHeader, Col, Row, Collapse, Fade } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Radio from '@material-ui/core/Radio';
import TablePaginationActions from '../../components/pagination/pagination'
import IconButton from '@material-ui/core/IconButton';
import CheckIcon from '@material-ui/icons/Check';
import CloseIcon from '@material-ui/icons/Close';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment';
import DateRangePicker from 'react-daterange-picker';
import "react-daterange-picker/dist/css/react-calendar.css";
import ConfirmDialog from '../../components/confirm/'
import dayOffProvider from '../../data-access/dayOff';

const today = moment();

class OfferLeave extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: true,
            data: {},
            tempDelete: {},
            totalOT: '',
            page: 0,
            size: 10,
            dataDayOff: [],
            total: 0,
            stt: 0,
            reason: '',
            dateValue: moment.range(today.clone(), today.clone()),
            breakTime: 0,
            holidayForm: 0,
            confirmDialog: false,
        }
    }

    getDayOff() {
        this.setState({ progress: true })
        let param = {
            page: this.state.page + 1,
            size: this.state.size,
            employeesId: this.state.data.employees.id,
        }
        dayOffProvider.search(param, (s, e) => {
            if (s && s.data) {
                let stt = 1 + (param.page - 1) * param.size;
                this.setState({
                    dataDayOff: s.data.data,
                    stt,
                    total: s.data.total,
                })
            } else {
            }
            this.setState({ progress: false })
        })
    }

    componentWillMount() {
        let local = JSON.parse(localStorage.getItem('isofh'))
        if (local) {
            this.setState({
                data: JSON.parse(localStorage.getItem('isofh'))
            }, () => {
                this.getDayOff();
            })
        }

    }

    validateDataSend() {
        const { dateValue, reason } = this.state;
        let msg = ''
        if (!reason) {
            msg = msg + "Nhập lý do! \n"
        }
        if (!dateValue) {
            msg = msg + "Chọn thời gian nghỉ phép! \n"
        }
        return msg
    }

    offerLeave() {
        const { breakTime, holidayForm, dateValue, reason } = this.state;
        let startDayOffDate = moment(dateValue.start).format("YYYY-MM-DD");
        let endDayOffDate = moment(dateValue.end).format("YYYY-MM-DD");
        let param = {
            "dayOff": {
                breakTime,
                holidayForm,
                reason
            },
            "employeesId": this.state.data.employees.id,
            startDayOffDate,
            endDayOffDate
        }
        if (this.validateDataSend() === '') {
            dayOffProvider.create(param, (s, e) => {
                if (s && s.data) {
                    this.handleCancelData();
                    this.getDayOff();
                    toast.success("Offer leave success !", {
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
            reason: '',
            dateValue: moment.range(today.clone(), today.clone()),
            breakTime: 0,
            holidayForm: 0,
        })
    }

    handleChangePage = (event, action) => {
        this.setState({
            page: action,
            selected: []
        }, () => {
            this.getDayOff()
        });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ size: event.target.value }, () => {
            this.getDayOff()
        });
    };

    onSelect = (value, states) => {
        this.setState({ dateValue: value });
    };

    showModalDelete(item) {
        this.setState({ confirmDialog: true, tempDelete: item })
    }

    delete(type) {
        this.setState({ confirmDialog: false })
        if (type == 1) {
            let param = {};
            debugger
            dayOffProvider.delete(this.state.tempDelete.id, param, (s, e) => {
                if (s && s.data) {
                    toast.success("Hủy lịch nghỉ phép thành công!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.setState({ page: 0 })
                    this.getDayOff();
                    this.setState({ tempDelete: {} });
                } else {
                    toast.error("Hủy lịch nghỉ phép không thành công!", {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        }
    }

    render() {
        const { classes } = this.props;
        const { dataDayOff, breakTime, holidayForm, dateValue, reason, stt, page, size, total, progress, confirmDialog } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer autoClose={3000} />
                <Row>
                    <Col xs="12" sm="8" md="8">
                        <Card>
                            <CardHeader>
                                <p>Danh sách đề xuất nghỉ phép</p>
                            </CardHeader>
                            <CardBody>
                                {progress ? <LinearProgress /> : null}
                                <Table className={classes.table} aria-labelledby="tableTitle">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Ngày nghỉ</TableCell>
                                            <TableCell>Tổng số ngày nghỉ</TableCell>
                                            <TableCell>Lý do</TableCell>
                                            <TableCell>Trạng thái</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            dataDayOff && dataDayOff.length ? dataDayOff.map((item, index) => {
                                                return (
                                                    <TableRow
                                                        hover
                                                        key={index}
                                                        tabIndex={-1}>
                                                        <TableCell>{index + stt}</TableCell>
                                                        <TableCell>{moment(item.dayOffs.dayOffDate).format("DD-MM-YYYY")}</TableCell>
                                                        <TableCell>{item.dayOffs.totalDayOff}</TableCell>
                                                        <TableCell>{item.dayOffs.reason}</TableCell>
                                                        <TableCell>
                                                            {
                                                                item.dayOffs.status == 1 ?
                                                                    <IconButton color="primary" className={classes.button} aria-label="CheckIcon">
                                                                        <CheckIcon />
                                                                    </IconButton> :
                                                                    <IconButton onClick={this.showModalDelete.bind(this, item.dayOffs)} color="secondary" className={classes.button} aria-label="CloseIcon">
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
                                {confirmDialog && <ConfirmDialog title="Xác nhận" content="Bạn có chắc chắn muốn hủy lịch nghỉ phép này không?" btnOk="Xác nhận" btnCancel="Hủy" cbFn={this.delete.bind(this)} />}
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="4" md="4">
                        <Card>
                            <CardHeader>
                                <button onClick={() => { this.offerLeave() }}>Thêm đề xuất nghỉ phép</button>
                            </CardHeader>
                            <CardBody>
                                <Row>
                                    <Col xs="12" sm="12" md="12" style={{ textAlign: 'center' }}>
                                        <DateRangePicker
                                            value={dateValue}
                                            onSelect={this.onSelect}
                                            singleDateRange={true}
                                            minimumDate={new Date()}
                                        />
                                    </Col>
                                </Row>
                                <div style={{ textAlign: 'center' }}>
                                    <Radio
                                        checked={breakTime == 0}
                                        onChange={(event) => this.setState({ breakTime: event.target.value })}
                                        value="0"
                                        name="radio-button-break-time"
                                        aria-label="0"
                                    /> Cả ngày
                                    <Radio
                                        checked={breakTime == 1}
                                        onChange={(event) => this.setState({ breakTime: event.target.value })}
                                        value="1"
                                        name="radio-button-break-time"
                                        aria-label="1"
                                    /> Sáng
                                    <Radio
                                        checked={breakTime == 2}
                                        onChange={(event) => this.setState({ breakTime: event.target.value })}
                                        value="2"
                                        name="radio-button-break-time"
                                        aria-label="2"
                                    /> Chiều
                                </div>
                                <div style={{ textAlign: 'center' }}>
                                    <Radio
                                        checked={holidayForm == 0}
                                        onChange={(event) => this.setState({ holidayForm: event.target.value })}
                                        value="0"
                                        name="radio-button-holiday-form"
                                        aria-label="0"
                                    /> Nghỉ phép
                                    <Radio
                                        checked={holidayForm == 1}
                                        onChange={(event) => this.setState({ holidayForm: event.target.value })}
                                        value="1"
                                        name="radio-button-holiday-form"
                                        aria-label="1"
                                    /> Nghỉ không phép
                                </div>
                                <div>
                                    <textarea onChange={(event) => this.setState({ reason: event.target.value })}
                                        style={{ width: '100%', borderTop: 'none', borderRight: 'none', borderLeft: 'none', lineHeight: 1 }}
                                        value={reason} placeholder='Lý do nghỉ(*)' rows='4'></textarea>
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

export default withStyles(styles)(OfferLeave);