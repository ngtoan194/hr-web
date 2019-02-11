import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import Autosuggest from 'react-autosuggest';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const languages = [
    {
        name: 'C',
        year: 1972
    },
    {
        name: 'Elm',
        year: 2012
    }
];

const getSuggestions = value => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;
    return inputLength === 0 ? [] : languages.filter(lang => lang.name.toLowerCase().slice(0, inputLength) === inputValue);
};
// When suggestion is clicked, Autosuggest needs to populate the input
// based on the clicked suggestion. Teach Autosuggest how to calculate the
// input value for every given suggestion.
const getSuggestionValue = suggestion => suggestion.name

// Use your imagination to render suggestions.
const renderSuggestion = suggestion => (
    <div onClick={() => console.log(suggestion)}>
        {suggestion.name}
    </div>
);

class ModalAddContact extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            open: true,
            value: '',
            suggestions: []
        };
    }

    handleClose = () => {
        this.props.callbackOff()
    };

    save = () => {

    }

    onChange = (event, { newValue }) => {
        this.setState({
            value: newValue
        });

    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
            suggestions: getSuggestions(value)
        });
    };

    // Autosuggest will call this function every time you need to clear suggestions.
    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { dataselect } = this.props;
        const { value, suggestions } = this.state;
        const inputProps = {
            placeholder: 'Type a programming language',
            value,
            onChange: this.onChange
        };
        return (
            <Dialog
                open={this.state.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description">
                <DialogTitle style={{ textAlign: 'center' }} id="alert-dialog-slide-title">{dataselect ? 'Cập nhật' : 'Thêm mới'}</DialogTitle>
                <DialogContent>
                    {/* <Test users={users}/> */}
                    <Autosuggest
                        suggestions={suggestions}
                        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                        getSuggestionValue={getSuggestionValue}
                        renderSuggestion={renderSuggestion}
                        inputProps={inputProps}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} variant="contained" color="secondary">Hủy</Button>
                    <Button onClick={this.save} variant="contained" color="primary">Lưu</Button>
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
export default withStyles(styles)(ModalAddContact);