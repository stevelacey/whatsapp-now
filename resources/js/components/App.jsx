import React from 'react'
import PhoneNumber from 'awesome-phonenumber'

import { KeyPad } from './KeyPad'

const actionUrl = 'https://api.whatsapp.com/send'
const regionCodes = PhoneNumber.getSupportedRegionCodes()

export class App extends React.Component {
    constructor(props) {
        super(props)

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

    formatNumber(text) {
        const value = text
            .replace(/https:\/\/wa\.me\/[+0]*/g, '+')
            .replace(/[^0-9+]/g, '')
            .replace(/^00/g, '+')

        return value.slice(0, 1) + value.slice(1).replace(/[^0-9]/g, '')
    }

    handleChange(text) {
        const value = this.formatNumber(text)
        const phoneNumber = new PhoneNumber(value, this.state.localCountryCode)
        const regionCode = phoneNumber.getRegionCode()
        const countryCode = regionCodes.includes(regionCode) ? regionCode : null

        if (countryCode || value[0] === '+') {
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

        window.location = actionUrl + '?phone=' + value.replace(/[^0-9]/g, '')
    }

    render() {
        const { countryCode, value } = this.state

        return (
            <form
                action={actionUrl}
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
                    value={value}
                    onChange={e => this.handleChange(e.target.value)}
                    onClick={() => this.handlePaste()}
                />

                <KeyPad
                    className="w-64 mx-auto"
                    countryCode={countryCode}
                    showDelete={value.length >= 1}
                    showFlag={value.length === 1 && value !== '+' || value.length >= 2}
                    showPlus={value.length === 0}
                    onInput={e => this.handleChange(value + e.detail)}
                    onDelete={() => this.handleChange(value.slice(0, -1))}
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
