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
import { MuiPickersUtilsProvider, DatePicker } from 'material-ui-pickers';
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

class ResultInterview extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dataResult: this.props.data,
            listResult: [
                {
                    name: '--- Chọn ---',
                    value: -1,
                },
                {
                    name: 'Chờ phỏng vấn',
                    value: 0,
                },
                {
                    name: 'Pass',
                    value: 1,
                },
                {
                    name: 'Faild',
                    value: 2,
                }
            ],
            name: this.props.data && this.props.data.interview ? this.props.data.interview.name : '',
            result: this.props.data && this.props.data.interview ? this.props.data.interview.result : -1,
            dateStartWork: new Date(),
            salaryProposed: 0,
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    validateDataSend() {
        const { name, email, specialize } = this.state;
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
        return msg
    }

    result = () => {
        const { dataResult, result, dateStartWork, salaryProposed } = this.state;
        let param = {
            "result": result,
            "dateStartWork": moment(dateStartWork).format('YYYY-MM-DD'),
            "salaryProposed": salaryProposed,
        }
        interviewProvider.resultInterview(param, dataResult.interview.id, (s, e) => {
            if (s && s.data) {
                this.handleClose();
                toast.success("Result interview success !", {
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
        const { dataResult, name, dateStartWork, salaryProposed, listResult, result } = this.state;
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title"> {'Kết quả phỏng vấn ' + dataResult.interview.name} </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '25px' }}></div>
                                <Select
                                    value={result}
                                    onChange={(event) => this.setState({ result: event.target.value })}
                                    inputProps={{ name: 'selectRecruitment', id: 'selectRecruitment' }}
                                    style={{ width: '100%', marginTop: 8 }}>
                                    {
                                        listResult.map((option, index) =>
                                            <MenuItem key={index} value={option.value}>{option.name}</MenuItem>
                                        )
                                    }
                                </Select>
                            </Grid>
                            <Grid item xs={12} md={6}></Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={salaryProposed}
                                    id="filled-salaryProposed"
                                    label="Lương"
                                    type="number"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ salaryProposed: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <div style={{ marginBottom: '16px' }}></div>
                                <MuiPickersUtilsProvider utils={MomentUtils}>
                                    <DatePicker
                                        ampm={false}
                                        label="Ngày đi làm"
                                        format="DD-MM-YYYY"
                                        value={dateStartWork}
                                        onChange={(date) => this.setState({ dateStartWork: date })}
                                        disablePast
                                        leftArrowIcon={<KeyboardArrowLeft />}
                                        rightArrowIcon={<KeyboardArrowRight />}
                                        style={{ width: '100%' }}
                                    />
                                </MuiPickersUtilsProvider>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="contained" color="secondary">Hủy</Button>
                        <Button onClick={this.result} variant="contained" color="primary">Lưu</Button>
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
export default withStyles(styles)(ResultInterview);