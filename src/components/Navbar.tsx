// import {  useState } from "react";
// import { Button } from "@/components/ui/button";
// import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { Account } from "./accounts";
import { WalletOptions } from "./wallet-options";

export default function Navbar() {
  // const [address ] = useState("");

  function ConnectWallet() {
  const { isConnected } = useAccount()
  return isConnected ? <Account /> : <WalletOptions />;
  // return <div className=" text-white ">
  
  //   <WalletOptions />
  // </div>
}

//   const connectWallet = async () => {
//     if (typeof window.ethereum !== "undefined") {
//       const provider = new ethers.BrowserProvider(window.ethereum);
//       await provider.send("eth_requestAccounts", []);
//       const signer = await provider.getSigner();
//       const userAddress = await signer.getAddress();
//       setAddress(userAddress);
//     } else {
//       alert("Please install MetaMask");
//     }
//   };

  // const shorten = (addr: string) =>
  //   addr.slice(0, 6) + "..." + addr.slice(addr.length - 4);

  return (
    <header className="w-full bg-black/80 backdrop-blur-lg shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 text-white">
        <h1 className="text-xl font-bold tracking-wide">🧪 Kusama</h1>

           <div className="space-x-4 flex items-center text-yellow-100">

         <ConnectWallet />
        
      </div>
        {/* <div>
          {address ? (
            <span className="text-sm bg-green-600 text-white px-4 py-1 rounded-md">
              Connected: {shorten(address)}
            </span>
          ) : (
            <Button 
            // onClick={connectWallet}
            >Connect Wallet</Button>
          )}
        </div> */}
      </div>
    </header>
  );
}
