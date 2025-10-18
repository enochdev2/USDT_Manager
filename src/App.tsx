import { useState, useEffect } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import {
  createAssociatedTokenAccountInstruction,
  createFreezeAccountInstruction,
  createThawAccountInstruction,
  createTransferInstruction,
  // getOrCreateAssociatedTokenAccount,
  // TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { getMint, getAccount } from "@solana/spl-token";
import {
  getAssociatedTokenAddress,
  // getMint,
} from "@solana/spl-token";
import logo from "../src/assets/usdt.png";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"; // Correct import
import { ToastContainer, toast } from "react-toastify";
// import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

import { useWallet } from "@solana/wallet-adapter-react";
import { Buffer } from "buffer";
import TokenManagerPanel from "./components/TokenManagerPanel";
if (typeof global.Buffer === "undefined") {
  global.Buffer = Buffer;
}

// const network = WalletAdapterNetwork.Devnet;

export default function App() {
  // const { connection } = useConnection();
  const { publicKey, disconnect, connected, sendTransaction } = useWallet();
  const [walletAddress, setWalletAddress] = useState("");
  const [walletAddresss, setWalletAddresss] = useState("");
  // const [walletAddresss2, setWalletAddresss2] = useState("");
  const [walletAddresssTransfer, setWalletAddresssTransfer] = useState("");
  const [tokenAmount, setTokenAmount] = useState<string | number>("");
  const [mintAddress] = useState(
    "AJcZe76gF825j1xVCzcRJvj547HbdAD8SY4tVAW62ZCM"
  );
  // "EinHLLcQrotpKN9tThwkfYCsSEETgd46FrtSGT3DYAEv"
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Initialize wallet connection

  //?  OLD MINT_ADDRESS =   29WHkYWRa2mHN8ydAKJ83fW7CVT95EPVmwRg9S54L1Sn
  //?  OLD PROGRAM_ID  =   7viDeRV7c74pza1sP5wHFNfAfY73d3UsL2H3VozXky3M

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
    setLoading1(true);

    try {
      // const connection = new Connection("https://api.devnet.solana.com");
      const connection = new Connection(
        "https://solana-mainnet.core.chainstack.com/8393f5827d60e7ae4d89ec37dba2b906"
      ); // For Mainnet
      // "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      // const userWallet = publicKey;
      const mint = new PublicKey(mintAddress);
      console.log("🚀 ~ handleFreeze ~ mint:", mint.toString());
      console.log("🚀 ~ handleFreeze ~ walletAddresss:", walletAddresss);
      const userWalletAddress = new PublicKey(walletAddresss);

      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        userWalletAddress
      );
      console.log("🚀 ~ handleFreeze ~ userTokenAccount:", userTokenAccount);

      console.log("🚀 ~ handleFreeze ~ mintAddress:", mintAddress);
      // const version = await connection.getVersion();
      // console.log("🚀 ~ handleFreeze ~ Solana Version:", version);

      // const connection = new Connection(
      //   "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      // ); // For Mainnet

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
          "Token account does not hold tokens from the specified mint."
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

      // setMessage("✅ Token account frozen successfully!");
    } catch (err) {
      const error = err as Error;
      console.error(err);
      // setMessage("❌ Failed to freeze account: " + err);
      toast.error(`${error.message}`);
    } finally {
      setLoading(false); // Hide spinner when done
      setLoading1(false); // Hide spinner when done
    }
  };

  const handleUnfreeze = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("❌ Please connect your wallet first.");
      console.error("❌ Please connect your wallet first.");
      return;
    }

    setLoading2(true);

    try {
      // const connection = new Connection("https://api.devnet.solana.com");
      const connection = new Connection(
        "https://solana-mainnet.core.chainstack.com/8393f5827d60e7ae4d89ec37dba2b906"
      ); // For Mainnet
      // "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      const mint = new PublicKey(mintAddress);
      console.log("🚀 ~ handleUnfreeze ~ mint:", mint.toString());
      const userWalletAddress = new PublicKey(walletAddresss);

      const userTokenAccount = await getAssociatedTokenAddress(
        mint,
        userWalletAddress
      );
      console.log("🚀 ~ handleUnfreeze ~ userTokenAccount:", userTokenAccount);

      // Check mint info and freeze authority
      const mintInfo = await getMint(connection, mint);
      console.log("🚀 ~ handleUnfreeze ~ mintInfo:", mintInfo);
      if (!mintInfo.freezeAuthority) {
        console.error("Mint has no freeze authority");
        toast.error("❌ Mint has no freeze authority.");
        setLoading2(false);
        return;
      }

      if (mintInfo.freezeAuthority.toString() !== publicKey.toString()) {
        console.error("Connected wallet is not the freeze authority");
        toast.error("❌ Connected wallet is not the freeze authority.");
        setLoading2(false);
        return;
      }

      // Check token account info
      const tokenAccountInfo = await getAccount(connection, userTokenAccount);
      console.log("🚀 ~ handleUnfreeze ~ tokenAccountInfo:", tokenAccountInfo);

      if (tokenAccountInfo.mint.toString() !== mint.toString()) {
        console.error(
          "Token account does not hold tokens from the specified mint"
        );
        toast.error(
          "❌ Token account does not hold tokens from the specified mint."
        );
        setLoading2(false);
        return;
      }

      if (!tokenAccountInfo.isFrozen) {
        console.error("Token account is not frozen");
        toast.error("❌ Token account is not frozen.");
        setLoading2(false);
        return;
      }

      // Create the thaw instruction
      const thawInstruction = createThawAccountInstruction(
        userTokenAccount, // Token account to unfreeze
        mint, // Mint address
        publicKey // Freeze authority (your wallet's public key)
      );

      // Build the transaction and add thaw instruction
      const transaction = new Transaction().add(thawInstruction);

      // Send the signed transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("🚀 ~ handleUnfreeze ~ signature:", signature);

      // Confirm the transaction
      toast.success("✅ Token account unfrozen successfully!");
    } catch (err) {
      const error = err as Error;
      console.error("❌ Error:", error.message);
      toast.error(` ${error.message}`);
    } finally {
      setLoading2(false); // Hide spinner when done
    }
  };

  const transfertoken = async () => {
    if (!publicKey || !sendTransaction) {
      toast.error("❌ Please connect your wallet first.");
      console.error("❌ Please connect your wallet first.");
      return;
    }

    setLoading1(true);

    try {
      // const connection = new Connection("https://api.devnet.solana.com");
      const connection = new Connection(
        "https://solana-mainnet.core.chainstack.com/8393f5827d60e7ae4d89ec37dba2b906"
      ); // For Mainnet
      // "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      // const userWallet = publicKey;
      const mint = new PublicKey(mintAddress);
      const userWalletAddress = new PublicKey(walletAddresssTransfer);
      setWalletAddresss(walletAddresssTransfer);
      const ownerWalletAddress = new PublicKey(
        "7tpgvTY7Eq6F8R2P9voyTVUeKrdZq7aesCcVmvFba7Tt"
      );

      const ownerTokenAccount = await getAssociatedTokenAddress(
        mint,
        ownerWalletAddress
      );
      console.log(
        "🚀 ~ transfertoken ~ ownerTokenAccount:",
        ownerTokenAccount.toString()
      );
      let userTokenAccount = await getAssociatedTokenAddress(
        mint,
        userWalletAddress
      );
      console.log(
        "🚀 ~ transfertoken ~ userTokenAccount:",
        userTokenAccount.toString()
      );

      try {
        console.log("❌ User token account doesn't exist. Creating one...");
        const createATAIx = createAssociatedTokenAccountInstruction(
          publicKey, // payer (signer)
          userTokenAccount, // associated token account
          userWalletAddress, // owner of the token account
          mint // token mint
        );

        const transactions = new Transaction().add(createATAIx);

        // Send the transaction
        const result = await sendTransaction(transactions, connection);
        console.log("🚀 ~ transfertoken ~ result:", result);
      } catch (error) {
        console.log("🚀 ~ transfertoken ~ error:23232323232323232332323", error);
        userTokenAccount = await getAssociatedTokenAddress(
          mint,
          userWalletAddress
        );
        console.log(
          "🚀 ~ transfertoken ~ userTokenAccount:",
          userTokenAccount.toString()
        );
      }
      // if (!userTokenAccount) {
      // }
      //    const userTokenAccount = await getOrCreateAssociatedTokenAccount(
      //   connection,
      //   senderKeypair,
      //   userWalletAddress,
      //   publicKey,
      //   true
      // );

      console.log("🚀 ~ Transfer ~ mintAddress:", mintAddress);

      // const connection = new Connection(
      // "https://solana-mainnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      // "https://solana-devnet.g.alchemy.com/v2/chL87jzrfXklYJR_OmMTNKc1Ab1OfQpT"
      // ); // For Mainnet

      // Check mint info and freeze authority
      const mintInfo = await getMint(connection, new PublicKey(mintAddress));
      // console.log("🚀 ~ handleFreeze ~ mintInfo:", mintInfo);
      // if (!mintInfo.freezeAuthority) {
      //   console.error("Mint has no freeze authority");
      //   toast.error("❌ Mint has no freeze authority.");
      //   setLoading1(false);
      //   return;
      // }

      // let userTokenAccountChecked;
      // let userTokenAccountCheckeds;
      // Check if the user token account exists
      // Try fetching the user's token account info

      // try {
      // } catch (error) {
      //   console.log("❌ User token account doesn't exist. Creating one...");
      //

      //   if (!associatedTokenAddress) {
      //     const createATAIx = createAssociatedTokenAccountInstruction(
      //       publicKey, // payer (signer)
      //       associatedTokenAddress, // associated token account
      //       publicKey, // owner of the token account
      //       mint // token mint
      //     );

      //     const transaction = new Transaction().add(createATAIx);

      //     // Send the transaction
      //     const result = await sendTransaction(transaction, connection);
      //     console.log("🚀 ~ transfertoken ~ result:", result)
      //     console.log("Created associated token account for user.");
      //   } else {
      //     console.log(
      //       "Associated token account already exists:",
      //       associatedTokenAddress.toString()
      //     );
      //   }

      //   console.log("🚀 ~ transfertoken ~ error:", error);
      //   // If the account doesn't exist, create it
      //   // userTokenAccountChecked = createAssociatedTokenAccountInstruction(
      //   //   publicKey,
      //   //   userWalletAddress,
      //   //   publicKey,
      //   //   mint
      //   // );
      //   // const transaction = new Transaction().add(userTokenAccountChecked);
      //   // await sendTransaction(transaction, connection); // Send transaction to create the token account

      // }

      // const userTokenAccountChecked = await getAccount(
      //   connection,
      //  new PublicKey(userWalletAddress)
      // );
      // console.log("🚀 ~ transfertoken ~ userTokenAccountChecked:", userTokenAccountChecked)

      console.log("🚀 ~ App ~ walletAddresss:", walletAddresss);

      const decimals = mintInfo.decimals;

      // Handle the potential undefined case
      const tokenAmountAsNumber =
        typeof tokenAmount === "string"
          ? Number(tokenAmount)
          : tokenAmount ?? 0; // Default to 0 if tokenAmount is undefined or null

      if (isNaN(tokenAmountAsNumber)) {
        throw new Error("Invalid token amount");
      }

      // Perform the arithmetic operation
      const tokenAmounts = BigInt(tokenAmountAsNumber * Math.pow(10, decimals));
      // const tokenAmounts = BigInt(tokenAmount * Math.pow(10, decimals));

      console.log("🚀 ~ transfertoken ~ userTokenAccount:", userTokenAccount);
      const transferInstruction = createTransferInstruction(
        ownerTokenAccount,
        new PublicKey(userTokenAccount.toString()),
        publicKey,
        tokenAmounts // Specify the amount to transfer
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
      const transaction = new Transaction().add(transferInstruction);

      //  const signedTransaction = await signTransaction(transaction);

      // Send the signed transaction
      const signature = await sendTransaction(transaction, connection);
      console.log("🚀 ~ transfertoken ~ signature:", signature);

      // Confirm the transaction
      console.log("🚀 ~ transfertoken ~ userWalletAddress:", walletAddresss);

      toast.success("✅ Token transferred successfully!");
      setTimeout(() => {
        handleFreeze();
      }, 10000); // 15000 milliseconds = 15 seco
    } catch (err) {
      const error = err as Error;
      console.error(err);
      // setMessage("❌ Failed to freeze account: " + err);
      toast.error(` ${error.message}`);
    } finally {
      setLoading1(false); // Hide spinner when done
    }
  };


  return (
    <div>
      {/* Navbar */}
      <nav className="bg-main py-5 px-10 shadow-lg border-b border-slate-600">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-white">
          <div className="flex space-x-2  items-center">
            <img src={logo} className="w-[40px] h-[40px]" alt="" />
            <h1 className="font-bold text-2xl">USDT</h1>
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

      {publicKey &&
      publicKey.toString() ===
        "7tpgvTY7Eq6F8R2P9voyTVUeKrdZq7aesCcVmvFba7Tt" ? (
        <TokenManagerPanel
          handleFreeze={handleFreeze}
          handleUnfreeze={handleUnfreeze}
          transfertoken={transfertoken}
          loadingFreeze={loading}
          loadingUnfreeze={loading2}
          loadingTransfer={loading1}
          setWalletAddresss={setWalletAddresss}
          // setWalletAddresss2={setWalletAddresss2}
          setWalletAddresssTransfer={setWalletAddresssTransfer}
          walletAddresstransfer={walletAddresssTransfer}
          walletAddresss={walletAddresss}
          // walletAddresss2={walletAddresss2}
          tokenAmount={tokenAmount}
          setTokenAmount={setTokenAmount}
          // message={message}
          // walletAddresss={walletAddresss}
        />
      ) : (
        <div>
          <div className="min-h-screen flex items-center justify-center bg-main -to-tr from-[#002a3a] via-[#06213a] to-[#031022]">
            <div className="bg-gradient-to-tr from-[#ad1d04] to-[#b36a0b] shadow-xl rounded-2xl p-10 max-w-md w-full border border-slate-700">
              <h1 className="text-4xl font-semibold text-center mb-6 text-white">
                Access Denied
              </h1>
              <p className="text-white text-xl text-center">
                You do not have permission to access this panel.
              </p>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

{
  /* <div className="min-h-screen flex items-center bg-gradient-to-tr from-[#100024] via-[#0b0417] to-[#100024]">
  <div className="flex flex-col items-center justify-center w-full h-full p-4 shadow-2xl">
    <div className="bg-gradient-to-tr from-[#1d0934] to-[#441273] shadow-xl rounded-2xl p-10 max-w-md w-full border border-slate-700">
      <h1 className="text-2xl font-semibold text-center mb-6 text-white">
        Freeze Token Account
      </h1>
      <div className="space-y-3 flex flex-col">
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
          className="w-full mb-10 px-4 py-2 border bg-teal-600 hover:bg-teal-500
rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
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
          value={walletAddresssTransfer}
          onChange={(e) => setWalletAddresssTransfer(e.target.value)}
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
          disabled={loading1}
          // onChange={(e) => setTokenAmount(e.target.value)}
          onChange={(e) => setTokenAmount(Number(e.target.value))}
          className="w-full mb-6 px-4 py-3 border border-gray-500 rounded-xl focus:outline-none focus:ring-2 text-gray-400 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={transfertoken}
        className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
        disabled={loading1}
      >
        Transfer Token
      </button>

      {loading1 && (
        <div className="flex justify-center mt-4">
          <ClipLoader size={50} color="#ffffff" loading={loading1} />
        </div>
      )}
    </div>
  </div>

  <div className="flex flex-col items-center justify-center w-full h-full p-4 shadow-2xl">
    <div className="bg-gradient-to-tr from-[#1d0934] to-[#441273] shadow-xl rounded-2xl p-10 max-w-md w-full border border-slate-700">
      <h1 className="text-2xl font-semibold text-center mb-6 text-white">
        UnFreeze Token Account
      </h1>
      <div className="space-y-3 flex flex-col">
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
          value={walletAddresss2}
          onChange={(e) => setWalletAddresss2(e.target.value)}
          className="w-full mb-10 px-4 py-2 border border-gray-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          // disabled={true}
        />
      </div>

      <button
        onClick={handleUnfreeze}
        className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition cursor-pointer"
        disabled={loading2}
      >
        Unfreeze Account
      </button>

      {loading2 && (
        <div className="flex justify-center mt-4">
          <ClipLoader size={50} color="#ffffff" loading={loading2} />
        </div>
      )}
    </div>
  </div>
</div> */
}
