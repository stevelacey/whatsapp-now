import React from 'react'
import PhoneNumber from 'awesome-phonenumber'

import { CountrySelect } from './CountrySelect'
import { Flag } from './Flag'
import { KeyPad } from './KeyPad'

const actionUrl = 'https://api.whatsapp.com/send'
const regionCodes = PhoneNumber.getSupportedRegionCodes()

export class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      countryCode: null,
      detectedCountryCode: null,
      localCountryCode: 'US',
      localDialingCode: 1,
      value: '',
      showCountrySelect: false,
    };

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
      detectedCountryCode: countryCode,
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
    let value = this.formatNumber(text)

    if (value && value[0] !== '+' && value[0] !== '0') {
      const plusValue = '+' + value;
      const pn = new PhoneNumber(plusValue, this.state.localCountryCode);
      if (pn.isValid()) {
        value = plusValue
      }
    }

    const phoneNumber = new PhoneNumber(value, this.state.localCountryCode)
    const regionCode = phoneNumber.getRegionCode()
    const countryCode = regionCodes.includes(regionCode) ? regionCode : null

    if (countryCode || value[0] === '+') {
      this.setState({ countryCode })
    }

    this.setState({ value })
  }

  openCountrySelect() {
    this.setState({ showCountrySelect: true })
  }

  closeCountrySelect() {
    this.setState({ showCountrySelect: false })
  }


  handlePaste() {
    navigator.clipboard.readText().then(text => this.handleChange(text))
  }

  selectCountry(newCode) {
    const pn = new PhoneNumber('', newCode)
    const dialing = pn.getCountryCode()
    const current = this.state.value
    // If there is an existing number, replace its leading dialing code with the new one
    if (current && current.startsWith('+')) {
      // Determine current dialing code based on current country selection (if any)
      const oldCountry = this.state.countryCode
      const oldDialing = oldCountry ? new PhoneNumber('', oldCountry).getCountryCode() : null
      let newValue = current
      if (oldDialing && current.startsWith('+' + oldDialing)) {
        newValue = '+' + dialing + current.slice(('+' + oldDialing).length)
      } else {
        // Fallback: replace the leading '+' and any digits up to first non-digit after the country code
        newValue = '+' + dialing + current.replace(/^\+\d+/, '').replace(/^\+/, '')
        // Ensure we don't duplicate the dialing code
        if (newValue.startsWith('+' + dialing + dialing)) {
          newValue = '+' + dialing + newValue.slice(('+' + dialing).length)
        }
      }
      this.setState({ countryCode: newCode, value: newValue, showCountrySelect: false })
    } else {
      // No existing number, just set to new dialing code
      this.setState({ countryCode: newCode, value: `+${dialing}`, showCountrySelect: false })
    }
  }

  // Helper to get sorted region codes by country name
  getSortedRegionCodes() {
    return regionCodes.slice().sort((a, b) => {
      const nameA = this.getCountryName(a)
      const nameB = this.getCountryName(b)
      return nameA.localeCompare(nameB)
    })
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

  getCountryName(code) {
    if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
      const dn = new Intl.DisplayNames(['en'], { type: 'region' })
      return dn.of(code) || code
    }
    return code
  }

  render() {
    const { countryCode, value = '' } = this.state

    return (
      <form
        action={actionUrl}
        onSubmit={e => this.handleSubmit(e)}
      >
        <img
          src="/logo.png"
          className='size-20 mx-auto mb-3'
          alt="WhatsApp Now"
          onDoubleClick={() => window.location.reload()}
        />

        <label className="sr-only" htmlFor="phone">
          Phone Number
        </label>

        <input
          className="
            bg-transparent appearance-none
            w-full mb-3 px-4 py-3
            text-center text-4xl text-white
          "
          id="phone"
          name="phone"
          inputMode="tel"
          pattern="\+?[0-9]+"
          type="tel"
          value={value}
          onChange={e => this.handleChange(e.target.value)}
        />

        <KeyPad
          className="w-64 mx-auto"
          countryCode={countryCode}
          isIOS={/iPad|iPhone|iPod/.test(navigator.userAgent)}
          showDelete={value.length >= 1}
          showFlag={value.length === 1 && value !== '+' || value.length >= 2}
          showPaste={value.length === 0}
          onDelete={() => this.handleChange(value.slice(0, -1))}
          onInput={e => this.handleChange(value + e.detail)}
          onPaste={() => this.handlePaste()}
          onFlagClick={() => this.openCountrySelect()}
        />
          {this.state.showCountrySelect && (
            <CountrySelect
              onClose={() => this.closeCountrySelect()}
              onSelect={rc => this.selectCountry(rc)}
              countryCode={this.state.countryCode}
              detectedCountryCode={this.state.detectedCountryCode}
              sortedRegionCodes={this.getSortedRegionCodes()}
              getCountryName={rc => this.getCountryName(rc)}
            />
          )}

        <button
          className="bg-white/25 p-4 fixed inset-4 top-auto font-bold text-white rounded-full shadow"
          type="submit"
        >
          Send Message
        </button>
      </form>
    )
  }
}
