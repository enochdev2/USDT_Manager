// import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

// export function Account() {
//   const { address } = useAccount()
//   const { disconnect } = useDisconnect()
//   const { data: ensName } = useEnsName({ address })
//   const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

//   return (
//     <div>
//       {ensAvatar && <img alt="ENS Avatar" src={ensAvatar} />}
//       {address && <div>{ensName ? `${ensName} (${address})` : address}</div>}
//       <button onClick={() => disconnect()}>Disconnect</button>
//     </div>
//   )
// }

import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

export function Account() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName! })

  if (!isConnected) return null

  return (
    <div className="flex items-center gap-4 px-4 py-1 max-w-sm border border-green-950/10 rounded-lg  shadow-sm">
      {ensAvatar && (
        <img
          src={ensAvatar}
          alt="ENS Avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="flex-1 text-sm">
        <span className="text-green-600 font-semibold">Connected:</span>{' '} <br/>
        <span className="font-medium text-gray-100">
          {ensName
            ? `${ensName} (${truncateAddress(address)})`
            : truncateAddress(address)}
        </span>
      </div>
      <button
        onClick={() => disconnect()}
        className="px-3 py-2 font-bold text-sm text-white bg-red-500 hover:bg-red-600 rounded"
      >
        Disconnect
      </button>
    </div>
  )
}

function truncateAddress(address?: string) {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

