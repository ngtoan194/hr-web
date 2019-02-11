import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
class ActionsComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount = () => {

    }

    handelclick = () => {
        if (this.props.ADD) {
            console.log(this.props.url)
            console.log(this.props.params)
        } else {
            console.log("Khong vao day")
        }
    }

    deleteClick = () => {
        this.props.DELETE.callback("success")
    }

    render = () => {
        const { classes } = this.props;
        return (
            <div className={classes.myactions}>
                {/* <Paper className={classes.root}> */}
                    { this.props.children ? this.props.children : <div></div> }
                    {
                        this.props.DELETE ?
                            <Button onClick={this.deleteClick} variant="contained" color="secondary" className={classes.button}>
                                Xóa <DeleteIcon className={classes.rightIcon} />
                            </Button> 
                        : <div></div>
                    }
                {/* </Paper> */}
            </div>
        )
    }
}

const styles = theme => ({
    myactions: {
        textAlign: 'right'
    },
    root: {
        width: '100%',
    },
});

ActionsComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ActionsComponent);