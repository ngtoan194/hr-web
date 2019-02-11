import React from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import userProvider from '../../data-access/user';
import fileProvider from '../../data-access/file';
import workingTimeProvider from '../../data-access/workingTime';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import stringUtils from '../../utils/string-utils'

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddNhanSu extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            user: this.props.dataselect.user,
            name: this.props.dataselect.user ? this.props.dataselect.user.employees.name : '',
            phone: this.props.dataselect.user && this.props.dataselect.user.employees.phoneNumber ? this.props.dataselect.user.employees.phoneNumber : '',
            mail: this.props.dataselect.user ? this.props.dataselect.user.employees.mail : '',
            isofhMail: this.props.dataselect.user ? this.props.dataselect.user.employees.isofhMail : '',
            dob: this.props.dataselect.user && this.props.dataselect.user.employees.birthDay ? new Date(this.props.dataselect.user.employees.birthDay) : new Date(),
            cv: this.props.dataselect.user ? this.props.dataselect.user.employees.cv : '',
            salaryProposed: this.props.dataselect.user ? this.props.dataselect.user.employees.salaryProposed : 0,
            departmentSelected: this.props.dataselect.user && this.props.dataselect.user.department && this.props.dataselect.user.department.id ? this.props.dataselect.user.department.id : this.props.dataselect.department[0].department.id,
            positionSelected: this.props.dataselect.user && this.props.dataselect.user.specialize ? this.props.dataselect.user.specialize.id : this.props.dataselect.position[0].specialize.id,
            startDate: this.props.dataselect.user ? new Date(this.props.dataselect.user.workingTime.startDate) : new Date(),
            recruitmentSelected: this.props.dataselect.user && this.props.dataselect.user.recruitmentSources ? this.props.dataselect.user.recruitmentSources.id : this.props.dataselect.recruitment[0].recruitmentSources.id,
            image : this.props.dataselect.user ? this.props.dataselect.user.employees.image : '',
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    validateDataSend() {
        const { name, phone, mail, isofhMail, departmentSelected, positionSelected } = this.state;
        let msg = ''
        if (!name) {
            msg = msg + "Nhập tên nhân viên \n"
        }
        if (!mail) {
            msg = msg + "Nhập mail nhân viên \n"
        } else {
            if (!mail.isEmail()) {
                msg = msg + "Vui lòng nhập đúng định dạng emai \n"
            }
        }
        if (!isofhMail) {
            msg = msg + "Nhập mail isofh nhân viên \n"
        } else {
            if (!isofhMail.isEmail()) {
                msg = msg + "Vui lòng nhập đúng định dạng emai \n"
            }
        }
        if (phone) {
            if (!phone.isPhoneNumber()) {
                msg = msg + "Vui lòng nhập đúng định dạng số điện thoại \n"
            }
        }
        if (departmentSelected === -1) {
            msg = msg + "Chưa chọn phòng ban cho nhân viên \n"
        }
        if (positionSelected === 'Chuyên môn') {
            msg = msg + "Chưa chọn chuyên môn cho nhân viên \n"
        }
        return msg 
    }

    save = () => {
        const {
            name, phone, mail, isofhMail, dob, image,
            salaryProposed, startDate, departmentSelected,
            positionSelected, recruitmentSelected, cv, user
        } = this.state;
        let param = {
            "id": user ? user.employees.id : '',
            "employees": {
                "name": name,
                "mail": mail,
                "phoneNumber": phone,
                "isofhMail": isofhMail,
                "birthDay": moment(dob).format('YYYY-MM-DD'),
                "specialize": positionSelected,
                "cv": cv,
                "evaluate": '',
                "image": image,
                "salaryProposed": salaryProposed
            },
            "departmentId": departmentSelected,
            "recruitmentSourcesId": recruitmentSelected,
        }
        if (user) {
            if (this.validateDataSend() === '') {
                userProvider.update(param, (s, e) => {
                    if (s && s.data) {
                        this.updateUserAfterCreate(s.data.employees, startDate, positionSelected)
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
                userProvider.create(param, (s, e) => {
                    if (s && s.data) {

                        this.updateUserAfterCreate(s.data.employees, startDate, positionSelected)
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

    uploadAvatar() {
        console.log("Upload avatar")
    }

    updateUserAfterCreate(user, date, position) {
        let param = {
            "workingTime": {
                "startDate": moment(date).format('YYYY-MM-DD'),
            },
            "employeesId": user.id,
            "specializeId": position
        }
        workingTimeProvider.create(param, (s, e) => {

            if (s.code != 0) {
                toast.error(s.message, {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.success("Create user success !", {
                    position: toast.POSITION.TOP_CENTER
                });
                this.handleClose()
            }
        })
    }

    handleDateChange = date => {
        this.setState({ startDate: date });
    };

    validateFile = (event) => {
        fileProvider.uploadFile(event.target.files[0], (res) => {
            if (res && res.data && res.data.code == 0) {
                this.setState({
                    cv: res.data.data.File.fileName
                })
            } else {
                toast.error("Vui lòng thử lại !", {
                    position: toast.POSITION.TOP_LEFT
                });
            }
        })
    }

    render() {
        const { classes, dataselect } = this.props;
        const { startDate, dob, departmentSelected, positionSelected, recruitmentSelected, user, name, phone, mail, image,
            isofhMail, cv, salaryProposed } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title"> {user ? 'Cập nhật nhân viên ' + this.state.name : 'Thêm mới'} </DialogTitle>
                    <DialogContent>
                        <div style={{ textAlign: 'center' }}>

                            <input
                                accept="image/png"
                                className={classes.input}
                                style={{ display: 'none' }}
                                id="upload_avatar"
                                onChange={this.uploadAvatar}
                                type="file"
                            />
                            <label htmlFor="upload_avatar">
                                <Button component="span" style={{ width: 100, height: 100, padding: 0, borderRadius: 100 }}>
                                    <Avatar
                                        style={{ width: 100, height: 100, margin: 'auto' }} alt="Remy Sharp"
                                        src={image ? image.absoluteUrl() : "/assets/avatars/1.jpg"}
                                        className={classNames(classes.avatar, classes.bigAvatar)} />
                                </Button>
                            </label>
                        </div>
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
                                    value={phone}
                                    id="filled-name"
                                    label="Số điện thoại"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ phone: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={mail}
                                    id="filled-name"
                                    label="mail*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ mail: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={isofhMail}
                                    id="filled-name"
                                    label="isofhMail*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ isofhMail: event.target.value })}
                                    margin="normal"
                                    disabled={user ? true : false}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={salaryProposed}
                                    type="number"
                                    id="filled-name"
                                    label="Mức Lương"
                                    className={classes.textField}
                                    onChange={(event) => { this.setState({ salaryProposed: event.target.value }) }}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputLabel htmlFor="age-helper">Phòng ban*</InputLabel>
                                <Select
                                    value={departmentSelected}
                                    onChange={(event) => this.setState({ departmentSelected: event.target.value })}
                                    inputProps={{ name: 'selectDepartment', id: 'selectDepartment' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        dataselect.department.map((option, index) =>
                                            <MenuItem key={index} value={option.department.id}>{option.department.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputLabel htmlFor="age-helper">Chuyên môn*</InputLabel>
                                <Select
                                    value={positionSelected}
                                    onChange={(event) => this.setState({ positionSelected: event.target.value })}
                                    inputProps={{ name: 'selectDepartment', id: 'selectDepartment' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        dataselect.position.map((option, index) =>
                                            <MenuItem key={index} value={option.specialize.id}>{option.specialize.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <InputLabel htmlFor="age-helper">Nguồn tuyển dụng</InputLabel>
                                <Select
                                    value={recruitmentSelected}
                                    onChange={(event) => this.setState({ recruitmentSelected: event.target.value })}
                                    inputProps={{ name: 'selectDepartment', id: 'selectDepartment' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        dataselect.recruitment.map((option, index) =>
                                            <MenuItem key={index} value={option.recruitmentSources.id}>{option.recruitmentSources.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div>Ngày sinh</div>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                        value={dob}
                                        onChange={(date) => this.setState({ dob: date })}
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                        style={{ width: '100%' }}
                                        maxDate={new Date()}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div>Ngày bắt đầu làm việc</div>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                        value={startDate}
                                        onChange={this.handleDateChange}
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        // minDate={user ? startDate : ''}
                                        labelFunc={date => (date ? moment(date).format('DD-MM-YYYY') : '')}
                                        style={{ width: '100%' }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <input
                                    accept=".doc,.docx,.ppt,.pptx"
                                    className={classes.input}
                                    style={{ display: 'none' }}
                                    id="raised-button-file"
                                    onChange={this.validateFile}
                                    type="file"
                                />
                                <label htmlFor="raised-button-file">
                                    <Button variant="contained" component="span" className={classes.button}>
                                        Chọn CV
                                    </Button>
                                </label>
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
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        width: 60,
        height: 60,
    },
    textField: {
        width: '100%'
    }
});
export default withStyles(styles)(AddNhanSu);