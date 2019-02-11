import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { toast } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import departMentProvider from '../../../data-access/department';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AddDepartment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            selectedDate: new Date(),
            department: this.props.department,
            leader: this.props.department && this.props.department.leader ? this.props.department.leader.id : -1,
            name: this.props.department ? this.props.department.department.name : '',
            description: this.props.department && this.props.department.department.describeDepartment ? this.props.department.department.describeDepartment : ''
        };
        console.log(this.props.department)
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    create = () => {
        const { name, leader, description, department } = this.state
        let param = {
            "id": department ? department.department.id : '',
            "department": {
                "name": name,
                "describeDepartment": description
            },
            "leaderId": leader,
        }
        if (name === '' || leader === -1) {
            alert("Tên phòng ban hoặc Người phụ trách không được để trống")
        } else {
            if (department) {
                departMentProvider.update(param, (s, e) => {
                    console.log(s)
                    if (s && s.data) {
                        toast.success("Cập nhật Phòng Ban Thành Công !", {
                            position: toast.POSITION.TOP_CENTER
                        });
                        this.handleClose();
                    } else {
                        console.log(s)
                        toast.error("Cập nhật Phòng Ban Không Thành Công \n(" + s.message + ')', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                })
            } else {
                departMentProvider.create(param, (s, e) => {
                    if (s && s.data) {
                        toast.success("Thêm Phòng Ban Thành Công !", {
                            position: toast.POSITION.TOP_CENTER
                        });
                        this.handleClose();
                    } else {
                        toast.error("Thêm Phòng Ban Không Thành Công \n(" + s.message + ')', {
                            position: toast.POSITION.TOP_CENTER
                        });
                    }
                })
            }
        }
    }

    render() {
        const { classes, dataselect } = this.props;
        const { leader, department, name, description } = this.state;
        console.log(department)
        console.log(dataselect)
        return (
            <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle style={{ textAlign: 'center' }} id="alert-dialog-slide-title">{department ? 'Cập nhật' : 'Thêm mới'}</DialogTitle>
                <DialogContent>
                    <TextField
                        value={name}
                        id="filled-name"
                        label="Tên phòng ban*"
                        className={classes.textField}
                        onChange={(event) => this.setState({ name: event.target.value })}
                        margin="normal"
                        style={{ width: '100%' }}
                    />
                    <TextField
                        value={description}
                        id="filled-name"
                        label="Mô tả"
                        className={classes.textField}
                        onChange={(event) => this.setState({ description: event.target.value })}
                        margin="normal"
                        style={{ width: '100%' }}
                    />
                    <Select
                        value={leader}
                        onChange={(event) => this.setState({ leader: event.target.value })}
                        inputProps={{ name: 'selectDepartment', id: 'selectDepartment' }}
                        style={{ width: '100%', marginTop: 30 }}>
                        <MenuItem value={-1}>Chọn người phụ trách*</MenuItem>
                        {
                            dataselect.map((user, index) =>
                                <MenuItem key={index} value={user.employees.id}>{user.employees.name}</MenuItem>
                            )
                        }
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} variant="contained" color="secondary">
                        Hủy
                        </Button>
                    <Button onClick={this.create} variant="contained" color="primary">
                        Lưu
                        </Button>
                </DialogActions>
            </Dialog>
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
export default withStyles(styles)(AddDepartment);