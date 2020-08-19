import React from 'react'
import Repeatable from 'react-repeatable';

export class Key extends React.Component {
    render() {
        return (
            <Repeatable
                className={`key ${this.props.className}`}
                tag="button"
                type="button"
                repeatDelay={500}
                repeatInterval={32}
                onClick={e => this.props.onClick && this.props.onClick(e)}
                onHold={e => this.props.onHold && this.props.onHold(e)}
            >
                {this.props.value || this.props.children}
            </Repeatable>
        )
    }
}
