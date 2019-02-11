import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { ToastContainer, toast } from 'react-toastify';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';

import ActionsComponent from '../../components/actions/actions_cmp';

class Insurance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    addNew() {
        console.log("add new")
    }

    callbackDelete(text) {

        toast("Custom Style Notification with css class!", {
            position: toast.POSITION.BOTTOM_RIGHT,
            className: 'foo-bar'
        });
    }

    render() {
        const { classes } = this.props;
        const DELETEDATA = {
            url: "dấdsadsadas",
            param: { test: 1, valie: "asdada", tesst: 0 },
            callback: this.callbackDelete.bind(this)
        }
        return(
            <div>
                <ToastContainer autoClose={3000} />
                <ActionsComponent
                    children={
                        <Button variant="contained" color="primary" className={classes.button} onClick={this.addNew.bind(this)}>
                            Thêm <Icon className={classNames(classes.icon, 'fa fa-plus-circle')} />
                        </Button>
                    }
                    DELETE={DELETEDATA}
                />
                <Paper className={classes.root}>
                Chức năng đang phát triển 
                </Paper>
            </div>
        )
    }
}

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
    },
    table: {
        minWidth: 1020,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
});

Insurance.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Insurance);