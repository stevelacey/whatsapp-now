import React from 'react'

const FLAG_LETTER_EMOJI_FIRST_OFFSET = 55356
const FLAG_LETTER_EMOJI_SECOND_OFFSET = 56741

export class Flag extends React.Component {
    flag(countryCode) {
        return countryCode && String.fromCharCode(
            FLAG_LETTER_EMOJI_FIRST_OFFSET,
            FLAG_LETTER_EMOJI_SECOND_OFFSET + countryCode.charCodeAt(0),
            FLAG_LETTER_EMOJI_FIRST_OFFSET,
            FLAG_LETTER_EMOJI_SECOND_OFFSET + countryCode.charCodeAt(1),
        )
    }

    render() {
        return (
            <span className={this.props.className}>
                {this.flag(this.props.countryCode)}
            </span>
        )
    }
}
