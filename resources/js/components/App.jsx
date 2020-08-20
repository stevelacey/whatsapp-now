import React from 'react'
import PhoneNumber from 'awesome-phonenumber'

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

        this.getPosition()
            .then(({ coords }) => this.geocodeGeoNames(coords).catch(() => this.geocodeOpenStreetMap(coords)))
            .catch(() => this.fetchIpCountry())
    }

    getPosition() {
        return new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject))
    }

    geocodeGeoNames({ latitude, longitude }) {
        return fetch(`https://secure.geonames.org/countryCode?lat=${latitude}&lng=${longitude}&username=secret`)
            .then(response => response.text())
            .then(text => this.localize(text.trim()))
    }

    geocodeOpenStreetMap({ latitude, longitude }) {
        return fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
            .then(response => response.json())
            .then(({ address }) => this.localize(address.country_code.toUpperCase()))
    }

    fetchIpCountry() {
        return fetch('https://ipinfo.io/country')
            .then(response => response.text())
            .then(text => this.localize(text.trim()))
    }

    localize(countryCode) {
        this.setState({
            countryCode,
            localCountryCode: countryCode,
            localDialingCode: new PhoneNumber('', countryCode).getCountryCode(),
        })
    }

    handleChange(raw) {
        const number = raw.replace(/[^0-9+]/g, '')
        const value = number.slice(0, 1) + number.slice(1).replace(/[^0-9]/g, '')
        const phoneNumber = new PhoneNumber(value, this.state.localCountryCode)
        const countryCode = phoneNumber.getRegionCode()

        if (countryCode) {
            this.setState({ countryCode })
        }

        this.setState({ value })
    }

    handlePaste() {
        navigator.clipboard.readText && navigator.clipboard.readText().then(value => this.handleChange(value))
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
                onSubmit={e => this.handleSubmit(e)}
            >
                <img
                    src="/logo.png"
                    className='w-20 h-20 mx-auto mb-3'
                    alt="WhatsApp Now"
                    onDoubleClick={() => window.location.reload()}
                />

                <label className="sr-only" htmlFor="phone">
                    Phone Number
                </label>

                <input
                    className="phone-input mb-3"
                    id="phone"
                    name="phone"
                    inputMode="tel"
                    pattern="\+?[0-9]+"
                    type="tel"
                    value={this.state.value}
                    onChange={e => this.handleChange(e.target.value)}
                    onClick={() => this.handlePaste()}
                />

                <KeyPad
                    className="w-64 mx-auto"
                    countryCode={this.state.countryCode}
                    showDelete={this.state.value.length > 0}
                    showFlag={this.state.value.length > 2}
                    showPlus={this.state.value.length === 0}
                    onChange={value => this.handleChange(this.state.value + value)}
                    onDelete={() => this.handleChange(this.state.value.slice(0, -1))}
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
