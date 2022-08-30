import '../styles/EdgeInput.css';
import React, { Component } from 'react';
import { Button, FormControlLabel, Switch, TextField } from '@mui/material';

class EdgeInput extends Component {
    render() {
        return (
            <div className='edge-input'>
                <div>
                    <TextField
                        label='Source'
                        onChange={(event) =>
                            this.props.onChange(
                                this.props.edge.id,
                                'source',
                                event.target.value
                            )
                        }
                        value={this.props.edge.source}
                        variant='outlined'
                    />
                </div>
                <div>
                    <TextField
                        label='Target'
                        onChange={(event) =>
                            this.props.onChange(
                                this.props.edge.id,
                                'target',
                                event.target.value
                            )
                        }
                        value={this.props.edge.target}
                        variant='outlined'
                    />
                </div>
                <div>
                    <TextField
                        label='Label'
                        onChange={(event) =>
                            this.props.onChange(
                                this.props.edge.id,
                                'label',
                                event.target.value
                            )
                        }
                        value={this.props.edge.label}
                        variant='outlined'
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={this.props.edge.directed}
                                onChange={(event) =>
                                    this.props.onChange(
                                        this.props.edge.id,
                                        'directed',
                                        event.target.value === 'on' ? true : false
                                    )
                                }
                            />
                        }
                        label='Directed'
                        labelPlacement='start'
                    />
                </div>
                <div id='delete-button-wrapper'>
                    <Button
                        color='error'
                        onClick={() => this.props.onDelete(this.props.edge.id)}
                        size='large'
                        variant='outlined'
                    >
                        Delete
                    </Button>
                </div>
            </div>
        );
    }
}

export default EdgeInput;
