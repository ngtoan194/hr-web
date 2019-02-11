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
import workScheduleProvider from '../../../data-access/workSchedule';
import moment from 'moment';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class ConfirmWorkSchedule extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataResult: this.props.data,
            dataDepartment: this.props.dataDepartment,
            dataSpecialize: this.props.dataSpecialize,
            specialize: this.props.data && this.props.data.specialize ? this.props.data.specialize.id : -1,
            department: -1,
            emailIsofh: '',
        };
        console.log(this.props.dataResult)
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    validateDataSend() {
        const { emailIsofh } = this.state;
        let msg = ''
        if (!emailIsofh) {
            msg = msg + "Nhập mail isofh nhân viên \n"
        } else {
            if (!emailIsofh.isEmail()) {
                msg = msg + "Vui lòng nhập đúng định dạng emai \n"
            }
        }
        return msg
    }

    result = () => {
        const { dataResult, emailIsofh, department, specialize } = this.state;
        let param = {
            "emailIsofh": emailIsofh,
            "departmentId": department,
            "specializeId": specialize,
        }
        if (this.validateDataSend() === '') {
            workScheduleProvider.result(param, dataResult.workSchedule.id, (s, e) => {
                if (s && s.data) {
                    this.handleClose();
                    toast.success("Result work schedule success !", {
                        position: toast.POSITION.TOP_CENTER
                    });
                } else {
                    toast.error(s.message, {
                        position: toast.POSITION.TOP_CENTER
                    });
                }
            })
        } else{
            alert(this.validateDataSend())
        }
    }

    render() {
        const { classes } = this.props;
        const { dataResult, emailIsofh, specialize, department, dataDepartment, dataSpecialize } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title"> {'XÁC NHẬN ĐI LÀM'} </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    value={emailIsofh}
                                    id="filled-emailIsofh"
                                    label="Email iSofh*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ emailIsofh: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <div style={{ marginBottom: '25px' }}></div>
                                <Select
                                    value={department}
                                    onChange={(event) => this.setState({ department: event.target.value })}
                                    inputProps={{ name: 'selectDepartment', id: 'selectDepartment' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        dataDepartment.map((option, index) =>
                                            <MenuItem key={index} value={option.department.id}>{option.department.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={12}>
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
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.result} variant="contained" color="primary">Lưu</Button>
                        <Button onClick={this.handleClose} variant="contained" color="secondary">Hủy</Button>
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
export default withStyles(styles)(ConfirmWorkSchedule);