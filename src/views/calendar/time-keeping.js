import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import { Card, CardBody, CardFooter, CardHeader, Col, Row } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';
import { BasePicker, MuiPickersUtilsProvider, Calendar } from 'material-ui-pickers';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import employeeProvider from '../../data-access/user';
import timeKeepingProvider from '../../data-access/timeKeeping';

class TimeKeeping extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            size: 500,
            listEmployee: [],
            dateTimekeeping: new Date(),
            employeesId: -1,
            type: 1,
        }
    }

    getEmployee() {
        let param = {
            page: this.state.page,
            size: this.state.size,
        }
        employeeProvider.search(param, (s, e) => {
            if (s && s.data) {
                let dataTemp = [{
                    employees: {
                        id: -1,
                        name: 'Nhân viên (*)'
                    }
                }]
                for (var i = 0; i < s.data.data.length; i++) {
                    dataTemp.push(s.data.data[i])
                }

                this.setState({
                    listEmployee: dataTemp,
                })
            } else {
            }
        })
    }

    componentWillMount() {
        this.getEmployee()
    }

    validateDataSend() {
        const { employeesId } = this.state;
        let msg = ''
        if (!employeesId || employeesId == -1) {
            msg = msg + "Chọn nhân viên! \n"
        }
        return msg
    }

    create() {
        const { dateTimekeeping, employeesId, type } = this.state;
        let param = {
            dateTimekeeping: moment(dateTimekeeping).format("YYYY-MM-DD"),
            employeesId,
            type
        }
        if (this.validateDataSend() === '') {
            timeKeepingProvider.create(param, (s, e) => {
                if (s && s.data) {
                    toast.success("Chấm công thành công !", {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.handleCancelData();
                } else if (s.code == 2) {
                    toast.error('Ngày này nhân viên đã được chấm công, vui lòng chọn ngày khác!', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.handleCancelData();
                } else {
                    toast.error('Chấm công không thành công!', {
                        position: toast.POSITION.TOP_CENTER
                    });
                    this.handleCancelData();
                }
            })
        } else {
            alert(this.validateDataSend())
        }
    }

    handleCancelData() {
        this.setState({
            dateTimekeeping: new Date(),
            employeesId: -1,
            type: 0,
        })
    };

    render() {
        const { classes } = this.props;
        const { listEmployee, dateTimekeeping, employeesId, type } = this.state;
        return (
            <div className="animated fadeIn">
                <ToastContainer autoClose={3000} />
                <Row>
                    <Col xs="12" sm="4" md="4">
                        <Card>
                            <CardHeader>
                                Chấm công tay
                            </CardHeader>
                            <CardBody>
                                <div style={{ marginBottom: '25px' }}>
                                    <div></div>
                                    <Select
                                        value={employeesId}
                                        onChange={(event) => this.setState({ employeesId: event.target.value })}
                                        inputProps={{ name: 'selectEmployeesId', id: 'selectEmployeesId' }}
                                        style={{ width: '100%', marginTop: 8 }}>
                                        {
                                            listEmployee.map((option, index) =>
                                                <MenuItem key={index} value={option.employees.id}>{option.employees.name} / {option.employees.isofhMail}</MenuItem>
                                            )
                                        }
                                    </Select>
                                </div>
                                <Row>
                                    <Col xs="12" sm="12" md="12" style={{ textAlign: 'center' }}>
                                        <MuiPickersUtilsProvider utils={MomentUtils}>
                                            <BasePicker value={dateTimekeeping} onChange={this.handleDateChange}>
                                                {({ date,
                                                    handleAccept,
                                                    handleChange,
                                                    handleClear,
                                                    handleDismiss,
                                                    handleSetTodayDate,
                                                    handleTextFieldChange,
                                                    pick12hOr24hFormat, }) => (
                                                        <Paper style={{ overflow: 'hidden' }}>
                                                            <Calendar date={date} onChange={handleChange}
                                                                leftArrowIcon={<KeyboardArrowLeft />}
                                                                rightArrowIcon={<KeyboardArrowRight />}
                                                            />
                                                        </Paper>
                                                    )}
                                            </BasePicker>
                                        </MuiPickersUtilsProvider>
                                    </Col>
                                </Row>
                                <div style={{ textAlign: 'center' }}>
                                    <Radio
                                        checked={type == 1}
                                        onChange={(event) => this.setState({ type: event.target.value })}
                                        value="1"
                                        name="radio-button-type"
                                        aria-label="1"
                                    /> Cả ngày
                                    <Radio
                                        checked={type == 2}
                                        onChange={(event) => this.setState({ type: event.target.value })}
                                        value="2"
                                        name="radio-button-type"
                                        aria-label="2"
                                    /> Nửa ngày
                                </div>
                            </CardBody>
                            <CardFooter>
                                <button style={{ float: 'right' }} onClick={() => this.create()} >Chấm công</button>
                            </CardFooter>
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

export default withStyles(styles)(TimeKeeping);