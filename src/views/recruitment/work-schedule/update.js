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
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class update extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataUpdate: this.props.data,
            dateStartWork: this.props.data && this.props.data.workSchedule ? this.props.data.workSchedule.dateStartWork : new Date(),
            salaryProposed: this.props.data && this.props.data.workSchedule && this.props.data.workSchedule.salaryProposed ? this.props.data.workSchedule.salaryProposed : 0,
        };
        console.log(this.props.data.dataSpecialize)
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    save = () => {
        const { dataUpdate, dateStartWork, salaryProposed } = this.state;
        let param = {
            "id": dataUpdate && dataUpdate.workSchedule ? dataUpdate.workSchedule.id : '',
            "workSchedule": {
                "dateStartWork": moment(dateStartWork).format('YYYY-MM-DD'),
                "salaryProposed": salaryProposed,
            },
        }
        workScheduleProvider.update(param, (s, e) => {
            if (s && s.data) {
                this.handleClose();
                toast.success("Update work schedule success !", {
                    position: toast.POSITION.TOP_CENTER
                });
            } else {
                toast.error(s.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        })
    }

    render() {
        const { classes } = this.props;
        const { dataUpdate, dateStartWork, salaryProposed } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title"> {'CẬP NHẬT LỊCH ĐI LÀM'} </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={12}>
                                <div style={{ marginBottom: '16px' }}></div>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                        label="Ngày đi làm"
                                        format="DD-MM-YYYY"
                                        value={dateStartWork}
                                        onChange={(date) => this.setState({ dateStartWork: date })}
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        style={{ width: '100%' }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    value={salaryProposed}
                                    id="filled-salaryProposed"
                                    label="Lương"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ salaryProposed: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.save} variant="contained" color="primary">Lưu</Button>
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
export default withStyles(styles)(update);