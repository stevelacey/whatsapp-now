import React from 'react'

import { Flag } from './Flag'
import { Key } from './Key'

export class KeyPad extends React.Component {
  handleClick(key) {
    this.props.onInput && this.props.onInput(new CustomEvent('input', { detail: key }))
  }

  handleDelete() {
    this.props.onDelete && this.props.onDelete(new CustomEvent('delete'))
  }

  render() {
    return (
      <div className={`grid grid-flow-row grid-cols-3 grid-rows-3 gap-4 ${this.props.className}`}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(key => (
          <Key
            className="bg-white/25 shadow focus:shadow-outline"
            key={key}
            value={key}
            onClick={() => this.handleClick(key)}
          />
        ))}

        {
          this.props.showPlus
            ? (
              <Key value="+" onClick={() => this.handleClick('+')}/>
            )
            : (
              <Key className="pointer-events-none">
                {this.props.showFlag && <Flag countryCode={this.props.countryCode}/>}
              </Key>
            )
        }

        <Key
          className="bg-white/25 shadow focus:shadow-outline"
          value="0"
          onClick={() => this.handleClick(0)}
        />

        {this.props.showDelete && (
          <Key
            value="⌫"
            onClick={() => this.handleDelete()}
            onHold={() => this.handleDelete()}
          />
        )}
      </div>
    )
  }
}
