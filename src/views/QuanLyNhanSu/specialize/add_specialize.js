import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ToastContainer, toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import specialize from '../../../data-access/specialize';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class addSpecialize extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            name: this.props.dataEdit ? this.props.dataEdit.name : '',
            note: this.props.dataEdit ? this.props.dataEdit.note : '',
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    create = () => {
        const { name, note } = this.state
        if (!name) {
            toast.warn("Vui lòng nhập tên chuyên môn!", {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }
        let param = {
            "specialize": {
                "name": name,
                "note": note,
            }
        }
        specialize.create(param, (s, e) => {
            if (s && s.data) {
                toast.success("Thêm chuyên môn thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            } else if (s.code === 2) {
                toast.success("Tên chuyên môn đã được sử dụng, vui lòng dùng tên khác!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Thêm chuyên môn không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })
    }

    update = () => {
        const { name, note } = this.state
        if (!name) {
            toast.warn("Vui lòng nhập tên chuyên môn!", {
                position: toast.POSITION.TOP_RIGHT
            });
            return
        }
        let param = {
            "specialize": {
                "name": name,
                "note": note,
            }
        }
        let id = this.props.dataEdit.id
        specialize.update(param, id, (s, e) => {
            if (s && s.data) {
                toast.success("Cập nhật chuyên môn thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
                this.handleClose();
            } else if (s.code === 2) {
                toast.success("Tên chuyên môn đã được sử dụng, vui lòng dùng tên khác!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            } else {
                toast.error("Cập nhật chuyên môn không thành công!", {
                    position: toast.POSITION.TOP_RIGHT
                });
            }
        })
    }

    render() {
        const { classes } = this.props;
                
        return (
            <div style={{ backgroundColor: 'red' }}>
                <ToastContainer autoClose={3000} />
                <Dialog
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                // contentStyle={{ maxWidth: 1000 }}
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        {this.props.dataEdit.id ? "Cập nhật" : "Thêm mới"}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            id="filled-name"
                            value={this.state.name}
                            label="Tên chuyên môn..."
                            className={classes.textField}
                            onChange={(event) => this.setState({ name: event.target.value })}
                            margin="normal"
                            style={{ width: '100%' }}
                        />
                        <TextField
                            id="filled-name"
                            value={this.state.note ? this.state.note : ''}
                            label="Ghi chú..."
                            className={classes.textField}
                            onChange={(event) => this.setState({ note: event.target.value })}
                            margin="normal"
                            style={{ width: '100%' }}
                        />
                    </DialogContent>
                    <DialogActions>
                        {this.props.dataEdit.id ?
                            <Button onClick={this.update} variant="contained" color="primary">
                                Cập nhật
                            </Button> :
                            <Button onClick={this.create} variant="contained" color="primary">
                                Thêm mới
                            </Button>
                        }
                        <Button onClick={this.handleClose} variant="contained" color="secondary">
                            Hủy
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}
const styles = {
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
};
export default withStyles(styles)(addSpecialize);