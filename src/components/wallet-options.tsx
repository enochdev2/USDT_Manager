import  { useEffect, useRef, useState } from 'react'
import { useConnect } from 'wagmi'

export function WalletOptions() {
  const { connectors, connect } = useConnect()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSelect = (connector: any) => {
    connect({ connector })
    setShowDropdown(false)
  }

  // ✅ Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative  z-100 inline-block">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="bg-green-olive-gradient2 hover:green-olive-gradient cursor-pointer border-amber-300 border text-white font-semibold px-4 py-2 rounded transition"
      >
        Connect Wallet ▾
      </button>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-44 bg-green-olive-gradient2 te border border-green-800 rounded font-bold shadow-lg text-shadow">
          {connectors.map((connector) => (
            <div
              key={connector.uid}
              onClick={() => handleSelect(connector)}
              className="px-4 py-2 text-white hover:bg-green-olive-gradient border-b border-gray-700 text-shadow cursor-pointer transition"
            >
              {formatConnectorName(connector.name)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function formatConnectorName(name: string): string {
  if (name === 'Injected') return 'Browser Wallet'
  return name
}
