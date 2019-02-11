import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { ToastContainer } from 'react-toastify';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import roleProvider from '../../../data-access/roles';
import specializeProvider from '../../../data-access/specialize'
function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class GrantRoels extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            dense: false,
            roles: this.props.roles,
            roleOfSpecial: []
        };
        this.update = this.update.bind(this)
    }

    handleClose = () => {
        this.props.cbOffModal()
    };

    checkExistRole(myRole) {
        for (let i = 0; i < this.state.roles.length; i++) {
            for (let j = 0; j < myRole.length; j++) {
                if (this.state.roles[i].role.id === myRole[j].role.id) {
                    this.state.roles.splice(i, 1);
                }
            }
        }
        this.setState({
            roles: this.state.roles
        })
    }

    addExistRole(role) {
        this.state.roles.unshift(role);
        this.setState({
            roles: this.state.roles
        })
    }

    componentWillMount() {
        const { data } = this.props;
        let param = {
            value: data.specialize ? data.specialize.valueRole : ''
        }
        roleProvider.search(param, (s, e) => {
            if (s && s.data) {
                this.setState({
                    roleOfSpecial: s.data.data
                }, () => {
                    this.checkExistRole(s.data.data);
                })

            }
        })
    }

    addRole(type, role) {
        let dataTpm = this.state.roleOfSpecial;
        if (type === 1) {
            dataTpm.push(role);
            this.checkExistRole(dataTpm);
        } else {
            dataTpm.splice(dataTpm.indexOf(role), 1);
            this.addExistRole(role);
        }
        this.setState({ roleOfSpecial: dataTpm })
    }

    update() {
        let ids = []
        let dataTpm = this.state.roleOfSpecial;
        for (var i = 0; i < dataTpm.length; i++) {
            ids.push(dataTpm[i].role.id)
        }
        let param = {
            "roleIds": ids
        }
        specializeProvider.addRole(param, this.props.data.specialize.id, (s, e) => {
            if (s) {
                this.handleClose();
            } else {
                this.handleClose();
            }
        })

    }

    render() {
        const { classes, data } = this.props;
        const { dense, roleOfSpecial, roles } = this.state;

        return (
            <div style={{ backgroundColor: 'red' }}>
                <ToastContainer autoClose={3000} />
                <Dialog
                    fullWidth={true}
                    maxWidth={'md'}
                    open={this.state.open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">
                        Thêm quyền
                    </DialogTitle>
                    <DialogContent>
                        <Grid container spacing={16}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}> Quyền </Typography>
                                <div className={classes.demo} >
                                    <List dense={dense} style={{ border: '1px solid' }}>
                                        {roles.map((item, index) => {
                                            return (
                                                <ListItem key={index} button className={classes.nested} onClick={() => this.addRole(1, item)}>
                                                    <ListItemText style={{ paddingLeft: 0 }} inset primary={item.role ? item.role.name : ''} />
                                                    <ListItemIcon><ChevronRight /></ListItemIcon>
                                                </ListItem>
                                            )
                                        })}
                                    </List>
                                </div>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" className={classes.title}>Quyền của {data.specialize ? data.specialize.name : ''}</Typography>
                                <div className={classes.demo}>
                                    <List dense={dense} style={{ border: '1px solid' }}>
                                        {
                                            roleOfSpecial && roleOfSpecial.map((item, index) => {
                                                return (
                                                    <ListItem key={index} button onClick={() => this.addRole(0, item)}>
                                                        <ListItemIcon><ChevronLeft /></ListItemIcon>
                                                        <ListItemText primary={item.role ? item.role.name : ''} />
                                                    </ListItem>
                                                )
                                            })
                                        }
                                    </List>
                                </div>
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.update} variant="contained" color="primary">
                            Xong
                        </Button>
                        <Button onClick={this.handleClose} variant="contained" color="secondary">
                            Hủy
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}
const styles = {

};
export default withStyles(styles)(GrantRoels);