import { TextField } from '@mui/material';
import React from 'react';

function hasLeadingZeroes(value) {
    return (typeof value != 'string' ? false : value.substring(0, 2) === '00' || value.substring(0, 3) === '-00');
}

// check if text is valid float
function isValidFloat(value) {
    return (typeof value != 'string' ? false : !isNaN(value) && !isNaN(parseFloat(value)) && !hasLeadingZeroes(value));
}

export default class IntegerInput extends React.Component {
    constructor(props) {
        super(props);
        // prevent undefined
        this.handleChange = (typeof props.handleChange === 'undefined' ? (() => { }) : props.handleChange.bind(this));
        this.maxValue = (typeof props.maxValue === 'undefined' ? Infinity : props.maxValue);
        this.minValue = (typeof props.minValue === 'undefined' ? -Infinity : props.minValue);
        this.placeholder = (typeof props.placeholder === 'undefined' ? '' : props.placeholder);
        this.value = (typeof props.value === 'undefined' ? '' : props.value);

        // set default states
        this.state = {
            error: false,
            value: this.value
        }
    }

    onChange = (event) => {
        let textInput = event.target.value;
        if (isValidFloat(textInput) && this.minValue <= Number(textInput) && Number(textInput) <= this.maxValue) {
            this.handleChange(event);
            this.setState({
                error: false,
                value: textInput
            });
        }
        else {
            this.setState({
                error: (textInput !== ''), // if input is not empty and incorrect, then set error
                value: textInput
            });
        }
    }

    render() {
        return (
            <div>
                <TextField
                    error={this.state.error}
                    onChange={this.handleChange}
                    placeholder={this.placeholder}
                    type='text'
                    value={this.state.value}
                />
            </div>
        )
    }
}
