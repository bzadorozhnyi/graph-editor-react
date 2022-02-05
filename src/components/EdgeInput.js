import React, { Component } from 'react';
import { Button, FormControlLabel, Switch, TextField } from '@mui/material';

class EdgeInput extends Component {
    render() {
        return (
            <div className='row edge-input'>
                <TextField
                    label='Source'
                    onChange={(event) =>
                        this.props.onChange(
                            this.props.edge.id,
                            'source',
                            event.target.value
                        )
                    }
                    size='small'
                    value={this.props.edge.source}
                    variant='filled'
                />
                <TextField
                    label='Target'
                    onChange={(event) =>
                        this.props.onChange(
                            this.props.edge.id,
                            'target',
                            event.target.value
                        )
                    }
                    size='small'
                    value={this.props.edge.target}
                    variant='filled'
                />
                <TextField
                    label='Label'
                    onChange={(event) =>
                        this.props.onChange(
                            this.props.edge.id,
                            'label',
                            event.target.value
                        )
                    }
                    size='small'
                    variant='filled'
                />
                <FormControlLabel
                    control={
                        <Switch
                            onChange={(event) =>
                                this.props.onChange(
                                    this.props.edge.id,
                                    'directed',
                                    event.target.value === 'on' ? true : false
                                )
                            }
                            size='small'
                        />
                    }
                    label='Directed'
                    labelPlacement='start'
                />
                <Button
                    color='error'
                    onClick={() => this.props.onDelete(this.props.edge.id)}
                    size='small'
                    variant='outlined'
                >
                    Delete
                </Button>
            </div>
        );
    }
}

export default EdgeInput;
