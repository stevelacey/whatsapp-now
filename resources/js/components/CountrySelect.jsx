import React, { useEffect, useRef } from 'react'
import PhoneNumber from 'awesome-phonenumber'
import { Flag } from './Flag'

export function CountrySelect({
  onClose,
  onSelect,
  countryCode,
  detectedCountryCode,
  sortedRegionCodes,
  getCountryName,
}) {
  const modalRef = useRef(null)
  const listRef = useRef(null)

  // Scroll selected country into view on mount
  useEffect(() => {
    const rc = countryCode
    if (rc && listRef.current) {
      const el = listRef.current.querySelector(`[data-rc="${rc}"]`)
      if (el) {
        el.scrollIntoView({ block: 'center' })
      }
    }
  }, [])

  // Focus trap + Escape key
  useEffect(() => {
    const previouslyFocused = document.activeElement

    // Focus close button on mount
    const closeBtn = modalRef.current?.querySelector('[data-close]')
    if (closeBtn) closeBtn.focus()

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const focusable = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusable || focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // Lock body scroll
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = originalOverflow
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [onClose])

  return (
    <div
      ref={modalRef}
      aria-label="Select country"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-white flex flex-col"
      role="dialog"
    >
      <button
        aria-label="Close country selector"
        className="fixed top-4 right-4 z-[60] w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xl hover:bg-gray-200 transition-colors"
        data-close
        type="button"
        onClick={onClose}
      >
        ✕
      </button>

      <ul
        ref={listRef}
        className="flex-1 overflow-y-auto overscroll-contain px-4 pt-4 pb-20"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {sortedRegionCodes.map(rc => {
          const dialing = new PhoneNumber('', rc).getCountryCode()
          return (
            <li key={rc} data-rc={rc}>
              <button
                type="button"
                onClick={() => onSelect(rc)}
                className={`flex items-center space-x-3 w-full text-left py-3 px-3 rounded-lg text-gray-800 transition-colors ${
                  rc === countryCode
                    ? 'bg-green-100'
                    : rc === detectedCountryCode
                    ? 'bg-slate-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <Flag countryCode={rc} />
                <span>
                  {getCountryName(rc)}{' '}
                  <span className="text-gray-400">+{dialing}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
