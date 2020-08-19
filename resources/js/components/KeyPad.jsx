import React from 'react'

import { Flag } from './Flag'
import { Key } from './Key'

export class KeyPad extends React.Component {
    handleClick(key) {
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
                        className="bg-white bg-opacity-25 shadow focus:shadow-outline"
                        key={key}
                        value={key}
                        onClick={() => this.handleClick(key)}
                    />
                ))}

                {
                    this.props.showPlus
                        ? <Key value="+" onClick={() => this.handleClick('+')}/>
                        : <Key className="pointer-events-none">
                            {this.props.showFlag ? <Flag countryCode={this.props.countryCode}/> : ''}
                          </Key>
                }

                <Key
                    className="bg-white bg-opacity-25 shadow focus:shadow-outline"
                    value="0"
                    onClick={() => this.handleClick(0)}
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
