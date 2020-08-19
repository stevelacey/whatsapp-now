import React from 'react'

import { Key } from './Key'

export class KeyPad extends React.Component {
    handleInput(key) {
        this.props.onChange && this.props.onChange(key)
    }

    handleDelete() {
        this.props.onDelete && this.props.onDelete()
    }

    render() {
        return (
            <div className={`grid grid-flow-row grid-cols-3 grid-rows-3 gap-4 ${this.props.className}`}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(key => (
                    <Key
                        className="bg-white shadow"
                        key={key}
                        value={key}
                        onClick={() => this.handleInput(key)}
                    />
                ))}

                {this.props.showPlus ? <Key value="+" onClick={() => this.handleInput('+')}/> : <div/>}

                <Key
                    className="bg-white shadow"
                    value="0"
                    onClick={() => this.handleInput(0)}
                />

                <Key
                    value="⌫"
                    onClick={() => this.handleDelete()}
                    onHold={() => this.handleDelete()}
                />
            </div>
        )
    }
}
