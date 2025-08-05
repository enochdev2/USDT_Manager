import { useState, useEffect } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createFreezeAccountInstruction,
  createTransferInstruction,
  // TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getMint, getAccount } from "@solana/spl-token";
import {
  getAssociatedTokenAddress,
  // getMint,
} from "@solana/spl-token";
import logo from "../src/assets/golem.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"; // Correct import
import { ToastContainer, toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

import { useWallet } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

// const network = WalletAdapterNetwork.Devnet;

export default function App() {
  // const { connection } = useConnection();
  const { publicKey, disconnect, connected, sendTransaction } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddresss, setWalletAddresss] = useState("");
  const [tokenAmount, setTokenAmount] = useState<number | undefined>(undefined);
  const [mintAddress] = useState(
    "29WHkYWRa2mHN8ydAKJ83fW7CVT95EPVmwRg9S54L1Sn"
  );
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize wallet connection

  useEffect(() => {
    if (publicKey) {
      setWalletAddress(publicKey.toBase58());
    }
  }, [publicKey]);

  const handleFreeze = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("❌ Please connect your wallet first.");
      console.error("❌ Please connect your wallet first.");
      return;
    }

    setLoading(true);

    try {
      // const connection = new Connection("https://api.devnet.solana.com");
      // const userWallet = publicKey;
      const mint = new PublicKey(mintAddress);
      console.log("🚀 ~ handleFreeze ~ mint:", mint.toString());
      const userWalletAddress = new PublicKey(walletAddresss);

      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        userWalletAddress
      );
      console.log("🚀 ~ handleFreeze ~ userTokenAccount:", userTokenAccount);

      console.log("🚀 ~ handleFreeze ~ mintAddress:", mintAddress);
      // const version = await connection.getVersion();
      // console.log("🚀 ~ handleFreeze ~ Solana Version:", version);

      const connection = new Connection(
        "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      ); // For Mainnet

      // Check mint info and freeze authority
      const mintInfo = await getMint(connection, new PublicKey(mintAddress));
      console.log("🚀 ~ handleFreeze ~ mintInfo:", mintInfo);
      if (!mintInfo.freezeAuthority) {
        console.error("Mint has no freeze authority");
        toast.error("❌ Mint has no freeze authority.");
        setLoading(false);
        return;
      }
      if (mintInfo.freezeAuthority.toString() !== publicKey.toString()) {
        console.error("Connected wallet is not the freeze authority");
        toast.error("❌ Connected wallet is not the freeze authority.");
        setLoading(false);
        return;
      }

      // Check token account info
      const tokenAccountInfo = await getAccount(connection, userTokenAccount);
      console.log("🚀 ~ handleFreeze ~ tokenAccountInfo:", tokenAccountInfo);
      if (tokenAccountInfo.mint.toString() !== mint.toString()) {
        console.error(
          "Token account does not hold tokens from the specified mint"
        );
        toast.error(
          "❌ Token account does not hold tokens from the specified mint."
        );
        setLoading(false);
        return;
      }
      if (tokenAccountInfo.isFrozen) {
        console.error("Token account is already frozen");
        toast.error("❌ Token account is already frozen.");
        setLoading(false);
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

      toast.success("✅ Token account frozen successfully!");

      setMessage("✅ Token account frozen successfully!");
    } catch (err) {
       const error = err as Error;
      console.error(err);
      setMessage("❌ Failed to freeze account: " + err);
      toast.error(`${error.message}`);
    } finally {
      setLoading(false); // Hide spinner when done
    }
  };

  const transfertoken = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("❌ Please connect your wallet first.");
      console.error("❌ Please connect your wallet first.");
      return;
    }

    setLoading(true);

    try {
      // const connection = new Connection("https://api.devnet.solana.com");
      // const userWallet = publicKey;
      const mint = new PublicKey(mintAddress);
      console.log("🚀 ~ handleFreeze ~ mint:", mint.toString());
      const userWalletAddress = new PublicKey(walletAddresss);
      const ownerWalletAddress = new PublicKey(
        "G6CsCYem33oCCAUzNs6MQr2HTjo9V1q56K5N1jjJ9Cxq"
      );

      const ownerTokenAccount = await getAssociatedTokenAddress(
        mint,
        ownerWalletAddress
      );
      console.log("🚀 ~ transfertoken ~ ownerTokenAccount:", ownerTokenAccount);
      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        userWalletAddress
      );
      console.log("🚀 ~ handleFreeze ~ userTokenAccount:", userTokenAccount);

      console.log("🚀 ~ handleFreeze ~ mintAddress:", mintAddress);

      const connection = new Connection(
        "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      ); // For Mainnet

      // Check mint info and freeze authority
      const mintInfo = await getMint(connection, new PublicKey(mintAddress));
      console.log("🚀 ~ handleFreeze ~ mintInfo:", mintInfo);
      if (!mintInfo.freezeAuthority) {
        console.error("Mint has no freeze authority");
        toast.error("❌ Mint has no freeze authority.");
        setLoading(false);
        return;
      }
     
      let userTokenAccountChecked
      // Check if the user token account exists
      try {
        userTokenAccountChecked = await getAccount(connection, userTokenAccount); // Try fetching the user's token account info
        console.log("🚀 ~ transfertoken ~ userTokenAccountChecked:", userTokenAccountChecked);
      } catch (error) {
        console.log("🚀 ~ transfertoken ~ error:", error)
        // If the account doesn't exist, create it
        console.log("❌ User token account doesn't exist. Creating one...");
        userTokenAccountChecked  = await createAssociatedTokenAccountInstruction(
            publicKey,
            userWalletAddress,
            publicKey,
            mint
          );
        const transaction = new Transaction().add(userTokenAccountChecked);
        await sendTransaction(transaction, connection); // Send transaction to create the token account

        console.log("Created associated token account for user.");
      }
      userTokenAccountChecked = await getAccount(connection, userTokenAccount);
      console.log("🚀 ~ transfertoken ~ userTokenAccountChecked:", userTokenAccountChecked)

      const decimals = mintInfo.decimals;
      const tokenAmounts = BigInt((tokenAmount ?? 0) * Math.pow(10, decimals));
      // const tokenAmounts = BigInt(tokenAmount * Math.pow(10, decimals));

        console.log("🚀 ~ transfertoken ~ userTokenAccount:", userTokenAccount)
      const transferInstruction = createTransferInstruction(
        ownerTokenAccount,
        new PublicKey(userTokenAccountChecked),
        publicKey,
        tokenAmounts // Specify the amount to transfer
        // TOKEN_PROGRAM_ID
      );
      console.log("🚀 ~ transfertoken ~ publicKey:", publicKey);
      console.log(
        "🚀 ~ transfertoken ~ transferInstruction:",
        transferInstruction
      );

      // const instruction = freezeAccount(
      //   connection,
      //   keypairs,
      //   userTokenAccount,
      //   mint,
      //   keypairs.publicKey
      // );

      // Build the transaction
      const transaction = new Transaction().add(transferInstruction);

      //  const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("🚀 ~ transfertoken ~ signature:", signature);

      // Confirm the transaction

      toast.success("✅ Token transferred successfully!");
    } catch (err) {
      const error = err as Error;
      console.error(err);
      setMessage("❌ Failed to freeze account: " + err);
      toast.error(` ${error.message}`);
    } finally {
      setLoading(false); // Hide spinner when done
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="bg-gradient-to-tr from-[#1d0934] via-[#0b0417] to-[#441273] py-5 px-10 shadow-lg border-b border-slate-600">
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

      <div className="min-h-screen flex items-center bg-gradient-to-tr from-[#100024] via-[#0b0417] to-[#100024]">
        {/* Content */}
        <div className="flex flex-col items-center justify-center w-full h-full p-4 shadow-2xl">
          <div className="bg-gradient-to-tr from-[#1d0934] to-[#441273] shadow-xl rounded-2xl p-10 max-w-md w-full border border-slate-700">
            <h1 className="text-2xl font-semibold text-center mb-6 text-white">
              Freeze Token Account
            </h1>
            <div className="space-y-3 flex flex-col">
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
                className="w-full mb-10 px-4 py-2 border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                // disabled={true}
              />
            </div>

            <button
              onClick={handleFreeze}
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
              disabled={loading}
            >
              Freeze Account
            </button>

            {loading && (
              <div className="flex justify-center mt-4">
                <ClipLoader size={50} color="#ffffff" loading={loading} />
              </div>
            )}

            {message && (
              <p className="mt-4 text-center text-sm text-gray-700">
                {message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-full h-full p-4 shadow-2xl">
          <div className="bg-gradient-to-tr from-[#1d0934] to-[#441273] shadow-xl rounded-2xl p-10 max-w-md w-full border border-slate-700">
            <h1 className="text-2xl font-semibold text-center mb-6 text-white">
              Transfer Token
            </h1>
            <div className="space-y-3 flex flex-col">
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
                className="w-full mb-10 px-4 py-2 border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                // disabled={true}
              />
            </div>

            <div className="space-y-3 flex flex-col">
              <label
                htmlFor=""
                className="text-white font-semibold mb-3 text-xl"
              >
                {" "}
                Amount
              </label>

              <input
                type="number"
                placeholder="Enter Amount"
                value={tokenAmount}
                disabled={loading}
                // onChange={(e) => setTokenAmount(e.target.value)}
                onChange={(e) => setTokenAmount(Number(e.target.value))}
                className="w-full mb-6 px-4 py-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-2 text-gray-400 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={transfertoken}
              className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
              disabled={loading}
            >
              Transfer Token
            </button>

            {loading && (
              <div className="flex justify-center mt-4">
                <ClipLoader size={50} color="#ffffff" loading={loading} />
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
