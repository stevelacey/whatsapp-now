import React from 'react'
import PhoneNumber from 'awesome-phonenumber'

import { Flag } from './Flag'
import { KeyPad } from './KeyPad'

export class App extends React.Component {
    constructor(props) {
        super(props)

        this.action = 'https://api.whatsapp.com/send'

        this.state = {
            countryCode: null,
            localCountryCode: 'US',
            localDialingCode: 1,
            value: '',
        }

        fetch('https://ipinfo.io/country')
            .then(response => response.text())
            .then(text => {
                const countryCode = text.trim()

                this.setState({
                    countryCode,
                    localCountryCode: countryCode,
                    localDialingCode: new PhoneNumber('', countryCode).getCountryCode(),
                })
            })
    }

    handleInput(value) {
        const phoneNumber = new PhoneNumber(value, this.state.localCountryCode)
        const countryCode = phoneNumber.getRegionCode()

        if (countryCode) {
            this.setState({ countryCode })
        }

        this.setState({ value })
    }

    handlePaste() {
        navigator.clipboard.readText().then(value => this.handleInput(value))
    }

    handleSubmit(e) {
        e.preventDefault()

        let value = this.state.value

        if (!value.length) {
            return
        }

        if (value[0] !== '+') {
            value = this.state.localDialingCode + value.replace(/^0/, '')
        }

        window.location = this.action + '?phone=' + value.replace(/[^0-9]/g, '')
    }

    render() {
        return (
            <form
                action={this.action}
                className="w-full max-w-xs px-5 pb-5 mx-auto text-center"
                onSubmit={e => this.handleSubmit(e)}
            >
                <img
                    src="/logo.png"
                    className='w-20 h-20 mx-auto mb-6'
                    alt="WhatsApp Now"
                    onDoubleClick={() => window.location.reload()}
                />

                <label className="sr-only" htmlFor="phone">
                    Phone Number
                </label>

                <div className="relative mb-6">
                    <Flag
                        className="phone-input-addon left-0 text-2xl pointer-events-none"
                        countryCode={this.state.countryCode}
                    />

                    <input
                        className="phone-input"
                        id="phone"
                        name="phone"
                        inputMode="tel"
                        pattern="\+?[0-9\(\)\-\s]+"
                        type="tel"
                        placeholder="+# (###) ###-####"
                        value={this.state.value}
                        onChange={e => this.handleInput(e.target.value)}
                    />

                    <button
                        className="phone-input-addon right-0 text-sm"
                        type="button"
                        onClick={() => this.state.value.length ? this.handleInput('') : this.handlePaste()}
                    >
                        {this.state.value.length ? '❌' : '📋'}
                    </button>
                </div>

                <KeyPad
                    className="mb-6"
                    showPlus={!this.state.value.length}
                    onChange={value => this.handleInput(this.state.value + value)}
                    onDelete={() => this.handleInput(this.state.value.slice(0, -1))}
                />

                <button
                    className="send-btn"
                    type="submit"
                >
                    Send Message
                </button>
            </form>
        )
    }
}
