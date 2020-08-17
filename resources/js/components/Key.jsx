import React from 'react'

export class Key extends React.Component {
    render() {
        return (
            <button
                className={`key ${this.props.className}`}
                onClick={e => this.props.onClick(e)}
                type="button"
            >
                {this.props.value}
           </button>
        )
    }
}
