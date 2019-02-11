import React from 'react';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import interviewProvider from '../../../data-access/interview';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddInterview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataUpdate: this.props.data,
            dataSpecialize: this.props.dataSpecialize,
            dataRecruitment: this.props.dataRecruitment,
            name: this.props.data && this.props.data.interview ? this.props.data.interview.name : '',
            email: this.props.data && this.props.data.interview ? this.props.data.interview.email : '',
            phoneNumber: this.props.data && this.props.data.interview && this.props.data.interview.phoneNumber? this.props.data.interview.phoneNumber : '',
            dateInterview: this.props.data && this.props.data.interview ? new Date(this.props.data.interview.dateInterview) : new Date(),
            specialize: this.props.data && this.props.data.specialize ? this.props.data.specialize.id : this.props.dataSpecialize[0].specialize.id,
            recruitmentSources: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.id : this.props.dataRecruitment[0].recruitmentSources.id,
            university: this.props.data && this.props.data.interview ? this.props.data.interview.university : '',
            majors: this.props.data && this.props.data.interview ? this.props.data.interview.majors : '',
            confirm: this.props.data && this.props.data.interview && this.props.data.interview.confirm ? true : false,
            attendInterview: this.props.data && this.props.data.interview && this.props.data.interview.attendInterview ? true : false,
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    validateDataSend() {
        const { name, email, specialize, phoneNumber } = this.state;
        let msg = ''
        if (!name) {
            msg = msg + "Nhập họ và tên! \n"
        }
        if (!email) {
            msg = msg + "Nhập mail! \n"
        } else {
            if (!email.isEmail()) {
                msg = msg + "Vui lòng nhập đúng định dạng emai! \n"
            }
        }
        if (specialize == -1) {
            msg = msg + "Chưa chọn vị trí! \n"
        }
        if(phoneNumber == '') {
            msg = msg + "Nhập số điện thoại! \n"
        }
        return msg
    }

    save = () => {
        const { dataUpdate, name, email, phoneNumber, dateInterview, specialize, recruitmentSources, university, majors, confirm, attendInterview } = this.state;
        let param = {
            "id": dataUpdate && dataUpdate.interview ? dataUpdate.interview.id : '',
            "interview": {
                "name": name,
                "email": email,
                "phoneNumber": phoneNumber,
                "dateInterview": moment(dateInterview).format('YYYY-MM-DD HH:mm:00'),
                "university": university,
                "majors": majors,
                "confirm": confirm ? 1 : 0,
                "attendInterview": attendInterview ? 1 : 0,
            },
            "specializeId": specialize && specialize != -1 ? specialize : '',
            "recruitmentSourcesId": recruitmentSources && recruitmentSources != -1 ? recruitmentSources : '',
        }
        if (dataUpdate && dataUpdate.interview && dataUpdate.interview.id) {
            if (this.validateDataSend() === '') {
                interviewProvider.update(param, (s, e) => {
                    if (s && s.data) {
                        this.handleClose();
                        toast.success("Update interview success !", {
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
        } else {
            if (this.validateDataSend() === '') {
                interviewProvider.create(param, (s, e) => {
                    if (s && s.data) {
                        this.handleClose();
                        toast.success("Create interview success !", {
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
    }

    render() {
        const { classes } = this.props;
        const { dataUpdate, name, email, phoneNumber, dateInterview, specialize, recruitmentSources, university, majors, confirm, attendInterview, dataSpecialize, dataRecruitment } = this.state;
        console.log(dateInterview)
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title"> {dataUpdate.interview ? 'Cập nhật ' + dataUpdate.interview.name : 'Thêm mới'} </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={name}
                                    id="filled-name"
                                    label="Họ và tên*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ name: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={email}
                                    id="filled-email"
                                    label="Email*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ email: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={phoneNumber}
                                    id="filled-phoneNumber"
                                    label="Số điện thoại*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ phoneNumber: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '16px' }}></div>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DateTimePicker
                                        ampm={false}
                                        label="Thời gian phỏng vấn"
                                        format="DD-MM-YYYY HH:mm"
                                        value={dateInterview}
                                        onChange={(date) => this.setState({ dateInterview: date })}
                                        // disablePast
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        style={{ width: '100%' }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '25px' }}></div>
                                <Select
                                    value={specialize}
                                    onChange={(event) => this.setState({ specialize: event.target.value })}
                                    inputProps={{ name: 'selectSpecialize', id: 'selectSpecialize' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        dataSpecialize.map((option, index) =>
                                            <MenuItem key={index} value={option.specialize.id}>{option.specialize.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '25px' }}></div>
                                <Select
                                    value={recruitmentSources}
                                    onChange={(event) => this.setState({ recruitmentSources: event.target.value })}
                                    inputProps={{ name: 'selectRecruitment', id: 'selectRecruitment' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        dataRecruitment.map((option, index) =>
                                            <MenuItem key={index} value={option.recruitmentSources.id}>{option.recruitmentSources.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={university}
                                    id="filled-university"
                                    label="Trường"
                                    className={classes.textField}
                                    onChange={(event) => { this.setState({ university: event.target.value }) }}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={majors}
                                    id="filled-majors"
                                    label="Chuyên ngành"
                                    className={classes.textField}
                                    onChange={(event) => { this.setState({ majors: event.target.value }) }}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginTop: '15px', float: 'left' }}>Confirm</div>
                                <Checkbox
                                    style={{ float: 'left' }}
                                    checked={confirm}
                                    id="filled-confirm"
                                    className={classes.Checkbox}
                                    onChange={(event) => { this.setState({ confirm: event.target.checked }) }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginTop: '15px', float: 'left' }}>Tham dự phỏng vấn</div>
                                <Checkbox
                                    style={{ float: 'left' }}
                                    checked={attendInterview}
                                    id="filled-attendInterview"
                                    className={classes.Checkbox}
                                    onChange={(event) => { this.setState({ attendInterview: event.target.checked }) }}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="secondary">Hủy</Button>
                        <Button onClick={this.save} variant="contained" color="primary">Lưu</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
const styles = theme => ({
    row: {
        display: 'flex',
        justifyContent: 'center',
    },
    textField: {
        width: '100%'
    }
});
export default withStyles(styles)(AddInterview);