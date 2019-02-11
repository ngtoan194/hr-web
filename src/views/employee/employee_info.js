import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { Card, CardBody,  CardHeader, Col, Row } from 'reactstrap';
import QRCode from 'qrcode.react';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { BasePicker, MuiPickersUtilsProvider, Calendar } from 'material-ui-pickers';
import timeKeepingProvider from '../../data-access/timeKeeping';
import userProvider from '../../data-access/user';

class EmployeeInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: true,
            data: {},
            dataTimeKeeping: [],
            dataDayOff: [],
            selectedDate: new Date(),
        }
    }

    getTimeKeeping() {
        var date = moment(new Date()).format('YYYY-MM-DD')
        let param = {
            employeesId: this.state.data.employees.id,
            fromStartTime: date + ' 00:00:00',
            toStartTime: date + ' 23:59:00',
        }
        timeKeepingProvider.search(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    dataTimeKeeping: s.data.data
                })
            } else {
            }
        })
    }

    getDetailByMonth() {
        let param = {
            id: this.state.data.employees.id,
        }
        userProvider.getDetailByMonth(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    dataDayOff: s.data
                })
            } else {
            }
        })
    }

    componentWillMount() {
        let local = JSON.parse(localStorage.getItem('isofh'))
        if (local) {
            this.setState({
                data: JSON.parse(localStorage.getItem('isofh'))
            }, () => {
                this.getTimeKeeping();
                this.getDetailByMonth();
            })
        }

    }

    handleDateChange = date => {
        this.setState({ selectedDate: date });
    };


    render() {
        const { classes } = this.props;
        const { data, selectedDate, dataTimeKeeping, dataDayOff } = this.state;
        console.log(dataDayOff)
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CardBody>
                                <div>
                                    <p style={{ fontWeight: 'bold' }}>{data.employees.name}</p>
                                    <p style={{ marginLeft: '20px', fontWeight: 'bold' }}>{data && data.specialize ? data.specialize.name : ''}</p>
                                </div>
                                <div className={classes.checkinCheckout}>
                                    <p>
                                        {dataTimeKeeping && dataTimeKeeping.length > 0 && dataTimeKeeping[0].timekeeping && dataTimeKeeping[0].timekeeping.startTime ? moment(dataTimeKeeping[0].timekeeping.startTime).format('HH:mm:ss') : '00:00:00'} - {dataTimeKeeping && dataTimeKeeping.length > 0 && dataTimeKeeping[0].timekeeping && dataTimeKeeping[0].timekeeping.endTime ? moment(dataTimeKeeping[0].timekeeping.endTime).format('HH:mm:ss') : '00:00:00'}
                                    </p>
                                    <p>
                                        <i className={dataTimeKeeping && dataTimeKeeping.length > 0 && dataTimeKeeping[0].timekeeping && dataTimeKeeping[0].timekeeping.startTime ? 'fa fa-check' : 'fa fa-times'}></i>
                                        {dataTimeKeeping && dataTimeKeeping.length > 0 && dataTimeKeeping[0].timekeeping && dataTimeKeeping[0].timekeeping.startTime ? ' Hôm nay bạn đã checkin' : ' Hôm nay bạn chưa checkin'}
                                    </p>
                                    <p>
                                        <i className={dataTimeKeeping && dataTimeKeeping.length > 0 && dataTimeKeeping[0].timekeeping && dataTimeKeeping[0].timekeeping.endTime ? 'fa fa-check' : 'fa fa-times'}></i>
                                        {dataTimeKeeping && dataTimeKeeping.length > 0 && dataTimeKeeping[0].timekeeping && dataTimeKeeping[0].timekeeping.endTime ? ' Hôm nay bạn đã checkout' : ' Hôm nay bạn chưa checkout'}
                                    </p>
                                </div>
                                <div className={classes.qrcode}>
                                    <QRCode value={data.employees.barCode} />
                                </div>
                                <div className={classes.datePicker}>
                                    <MuiPickersUtilsProvider utils={MomentUtils}>
                                        <BasePicker value={selectedDate} onChange={this.handleDateChange}>
                                            {({
                                                date,
                                                handleAccept,
                                                handleChange,
                                                handleClear,
                                                handleDismiss,
                                                handleSetTodayDate,
                                                handleTextFieldChange,
                                                pick12hOr24hFormat,
                                            }) => (
                                                    <Paper style={{ overflow: 'hidden' }}>
                                                        <Calendar date={date} onChange={handleChange}
                                                            leftArrowIcon={<KeyboardArrowLeft />}
                                                            rightArrowIcon={<KeyboardArrowRight />}
                                                        />
                                                    </Paper>

                                                )}
                                        </BasePicker>
                                    </MuiPickersUtilsProvider>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col xs="12" sm="6" md="6">
                        <Card>
                            <CardHeader>
                                <Row style={{ border: '1px solid', textAlign: 'center' }}>
                                    <Col xs="12" sm="6" md="6" style={{ border: '1px solid' }}>
                                        <p style={{ fontSize: '34px' }}>{dataDayOff && dataDayOff.totalTimekeeping ? dataDayOff.totalTimekeeping : 0}</p>
                                        <p>Số ngày đi làm</p>
                                    </Col>
                                    <Col xs="12" sm="6" md="6" style={{ border: '1px solid' }}>
                                        <p style={{ fontSize: '34px' }}>{dataDayOff.totalWorkKing - dataDayOff.totalTimekeeping}</p>
                                        <p>Số ngày đã nghỉ</p>
                                    </Col>
                                    <Col xs="12" sm="6" md="6" style={{ border: '1px solid' }}>
                                        <p style={{ fontSize: '34px' }}>{dataDayOff && dataDayOff.employees ? dataDayOff.employees.dayRemaining : 0}</p>
                                        <p>Số ngày phép còn</p>
                                    </Col>
                                    <Col xs="12" sm="6" md="6" style={{ border: '1px solid' }}>
                                        <p style={{ fontSize: '34px' }}>{dataDayOff && dataDayOff.totalWorkLate ? dataDayOff.totalWorkLate : 0}</p>
                                        <p>Số lần đi làm muộn</p>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <table style={{ width: '100%' }}>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Mã nhân viên</div>
                                            <div className={classes.divTable}>{data.employees.code}</div>
                                        </td>
                                    </tr>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Email</div>
                                            <div className={classes.divTable}>{data.employees.mail}</div>
                                        </td>
                                    </tr>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Số điện thoại</div>
                                            <div className={classes.divTable}>{data.employees.phoneNumber}</div>
                                        </td>
                                    </tr>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Ngày sinh</div>
                                            <div className={classes.divTable}>{moment(data.employees.birthDay).format("DD-MM-YYYY")}</div>
                                        </td>
                                    </tr>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Phòng ban</div>
                                            <div className={classes.divTable}>{data && data.department && data.department.name}</div>
                                        </td>
                                    </tr>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Vị trí chuyên môn</div>
                                            <div className={classes.divTable}>{data && data.specialize && data.specialize.name}</div>
                                        </td>
                                    </tr>
                                    <tr className={classes.tableEmployee}>
                                        <td>
                                            <div className={classes.divTableTitle}>Ngày bắt đầu làm việc</div>
                                            <div className={classes.divTable}>{moment(data.workingTime.startDate).format("DD-MM-YYYY")}</div>
                                        </td>
                                    </tr>
                                </table>
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
    table: {
        minWidth: 2048,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    checkinCheckout: {
        border: '1px solid',
        textAlign: 'center'
    },
    qrcode: {
        textAlign: 'center',
        marginTop: '10px'
    },
    datePicker: {
        border: '1px solid',
        textAlign: 'center'
    },
    tableEmployee: {
        borderTop: '1px solid #ddd',
    },
    divTableTitle: {
        margin: '4px',
        fontWeight: 'bold'
    },
    divTable: {
        margin: '4px',
        marginLeft: '25px',
        minHeight: '21px'
    }
});

export default withStyles(styles)(EmployeeInfo);