import { useState, useEffect } from "react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { createFreezeAccountInstruction } from "@solana/spl-token";
import { getMint, getAccount } from "@solana/spl-token";
import {
  getAssociatedTokenAddress,
  // getMint,
} from "@solana/spl-token";
import logo from "../src/assets/golem.png"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"; // Correct import

import { useWallet, useConnection } from "@solana/wallet-adapter-react";
// import { PhantomWalletAdapter, SolletWalletAdapter } from "@solana/wallet-adapter-wallets";

// Buffer polyfill (if needed)
import { Buffer } from "buffer";
if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

// const network = WalletAdapterNetwork.Devnet;

export default function App() {
  const { connection } = useConnection();
  const { publicKey, disconnect, connected, sendTransaction } =
    useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddresss, setWalletAddresss] = useState("");
  const [mintAddress, setMintAddress] = useState(
    "29WHkYWRa2mHN8ydAKJ83fW7CVT95EPVmwRg9S54L1Sn"
  );
  const [message, setMessage] = useState("");

  // Initialize wallet connection

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  const handleFreeze = async () => {
    if (!publicKey || !sendTransaction) {
      setMessage("❌ Please connect your wallet first.");
      return;
    }

    try {
      // const connection = new Connection("https://api.devnet.solana.com");
      // const userWallet = publicKey;
      const mint = new PublicKey(mintAddress);
      const userWalletAddress = new PublicKey(walletAddresss);

      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        userWalletAddress
      );

      // Check mint info and freeze authority
      const mintInfo = await getMint(connection, mint);
      if (!mintInfo.freezeAuthority) {
        console.error("Mint has no freeze authority");
        return;
      }
      if (mintInfo.freezeAuthority.toString() !== publicKey.toString()) {
        console.error("Connected wallet is not the freeze authority");
        return;
      }

      // Check token account info
      const tokenAccountInfo = await getAccount(connection, userTokenAccount);
      if (tokenAccountInfo.mint.toString() !== mint.toString()) {
        console.error(
          "Token account does not hold tokens from the specified mint"
        );
        return;
      }
      if (tokenAccountInfo.isFrozen) {
        console.error("Token account is already frozen");
        return;
      }

      const instruction = createFreezeAccountInstruction(
        userTokenAccount,
        mint,
        publicKey
        // TOKEN_PROGRAM_ID
      );

      // const instruction = freezeAccount(
      //   connection,
      //   keypairs,
      //   userTokenAccount,
      //   mint,
      //   keypairs.publicKey
      // );

      // Build the transaction
      const transaction = new Transaction().add(instruction);

      // Sign the transaction using the wallet
      // const signedTransaction = await signTransaction(transaction);

      //  const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("🚀 ~ handleFreeze ~ signature:", signature);

      // Confirm the transaction

      setMessage("✅ Token account frozen successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to freeze account: " + err);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-tr from-[#1d0934] via-[#0b0417] to-[#441273] py-4 px-10 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="flex space-x-2  items-center">
            <img src={logo} className="w-[40px] h-[40px]" alt="" />
          <h1 className="font-bold text-2xl">Golem</h1>
          </div>
          <ul className="flex space-x-6">
            <div>
              {/* Connect Button */}
              {!connected ? (
                <WalletMultiButton />
              ) : (
                <div className="flex space-x-2">
                  <p className="text-center text-xs text-white mb-">
                    Connected to <br />
                    {walletAddress
                      ? `${walletAddress.slice(0, 6)}.....${walletAddress.slice(
                          -4
                        )}`
                      : "Not connected"}
                  </p>

                  <button
                    onClick={() => disconnect()}
                    className=" bg-red-600 text-white py-2 px-3 rounded-xl font-semibold hover:bg-red-700 transition"
                  >
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          </ul>
        </div>
      </nav>

      <div className="min-h-screen flex items-center bg-gradient-to-tr from-[#1d0934] via-[#0b0417] to-[#2c0b47]">
        {/* Content */}
        <div className="flex flex-col items-center justify-center w-full h-full p-4">
          <div className="bg-gradient-to-tr from-[#1d0934] to-[#441273] shadow-xl rounded-2xl p-8 max-w-md w-full border border-slate-500">
            <h1 className="text-2xl font-bold text-center mb-6 text-white">
              Freeze Token Account
            </h1>
            <div className="spacey-4">
              {/* Token Freeze Form */}j
              <label
                htmlFor=""
                className="text-white font-semibold mb-3 text-xl"
              >
                {" "}
                Wallet Address
              </label>
              <input
                type="text"
                placeholder="User Wallet Address"
                value={walletAddresss}
                onChange={(e) => setWalletAddresss(e.target.value)}
                className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                // disabled={true}
              />
            </div>

            <div className="space-y-3">
              <label
                htmlFor=""
                className="text-white font-semibold mb-3 text-xl"
              >
                {" "}
                Token Address
              </label>

              <input
                type="text"
                placeholder="Token Mint Address"
                value={mintAddress}
                disabled={true}
                onChange={(e) => setMintAddress(e.target.value)}
                className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 text-white focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleFreeze}
              className="w-full bg-blue-600 text-white py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Freeze Account
            </button>

            {message && (
              <p className="mt-4 text-center text-sm text-gray-700">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
