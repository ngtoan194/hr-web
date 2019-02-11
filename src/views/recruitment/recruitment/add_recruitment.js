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
import recruitmentProvider from '../../../data-access/recruitment';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddRecruitment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            recruitment: this.props.data,
            name: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.name : '',
            phoneNumber: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.phoneNumber : '',
            address: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.address : '',
            webSite: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.webSite : '',
            contact: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.contact : '',
            price: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.price : '',
            numberEmployee: this.props.data && this.props.data.recruitmentSources ? this.props.data.recruitmentSources.numberEmployee : '',
        };

    }

    handleClose = () => {
        this.props.callbackOff()
    };

    validateDataSend() {
        const { name, phoneNumber } = this.state;
        let msg = ''
        if (!name) {
            msg = msg + "Nhập họ và tên! \n"
        }
        if (!phoneNumber) {
            msg = msg + "Nhập số điện thoại! \n"
        }
        return msg
    }

    save = () => {
        const { recruitment, name, phoneNumber, address, webSite, contact, price, numberEmployee } = this.state;
        let param = {
            "id": recruitment && recruitment.recruitmentSources ? recruitment.recruitmentSources.id : '',
            "recruitmentSources": {
                "name": name,
                "phoneNumber": phoneNumber,
                "address": address,
                "webSite": webSite,
                "contact": contact,
                "price": price,
                "numberEmployee": numberEmployee,
            },
        }
        if (recruitment && recruitment.recruitmentSources && recruitment.recruitmentSources.id) {
            if (this.validateDataSend() === '') {
                recruitmentProvider.update(param, (s, e) => {
                    if (s && s.data) {
                        this.handleClose();
                        toast.success("Update recruitment success !", {
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
                recruitmentProvider.create(param, (s, e) => {
                    if (s && s.data) {
                        this.handleClose();
                        toast.success("Create recruitment success !", {
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
        const { recruitment, name, phoneNumber, address, webSite, contact, price, numberEmployee } = this.state;
        console.log(recruitment)
        return (
            <div style={{ backgroundColor: 'red' }}>
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description">
                    <DialogTitle id="alert-dialog-slide-title"> {recruitment.recruitmentSources ? 'Cập nhật ' + recruitment.recruitmentSources.name : 'Thêm mới'} </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    value={name}
                                    id="filled-name"
                                    label="Tên nguồn tuyển dụng*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ name: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={phoneNumber}
                                    id="filled-name"
                                    label="Số điện thoại*"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ phoneNumber: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={address}
                                    id="filled-name"
                                    label="Địa chỉ"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ address: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={webSite}
                                    id="filled-name"
                                    label="Website"
                                    className={classes.textField}
                                    onChange={(event) => this.setState({ webSite: event.target.value })}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={contact}
                                    id="filled-name"
                                    label="Người liên hệ"
                                    className={classes.textField}
                                    onChange={(event) => { this.setState({ contact: event.target.value }) }}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={price}
                                    type="number"
                                    id="filled-name"
                                    label="Giá"
                                    className={classes.textField}
                                    onChange={(event) => { this.setState({ price: event.target.value }) }}
                                    margin="normal"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    value={numberEmployee}
                                    type="number"
                                    id="filled-name"
                                    label="Số lượng nhân viên"
                                    className={classes.textField}
                                    onChange={(event) => { this.setState({ numberEmployee: event.target.value }) }}
                                    margin="normal"
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
export default withStyles(styles)(AddRecruitment);