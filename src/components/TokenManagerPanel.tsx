import  { useState } from "react";
import { Wallet, Lock, Send, ArrowRightCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// TokenManagerPanel
// - Keeps your existing logic surface (freeze/unfreeze/transfer) but presents a
//   fresh, modern glassmorphic layout with a sidebar and animated panels.
// - Props (all optional):
//    - handleFreeze(addr)       async function
//    - handleUnfreeze(addr)     async function
//    - transfertoken({to,amount}) async function
//    - loadingFreeze, loadingUnfreeze, loadingTransfer (booleans)
// If a handler isn't passed we fall back to a console.log so you can drop this in immediately.

interface TokenManagerPanelProps {
  handleFreeze: () => Promise<void>;
  handleUnfreeze: () => Promise<void>;
  transfertoken: () => Promise<void>;
  loadingFreeze: boolean;
  loadingUnfreeze: boolean;
  loadingTransfer: boolean;
  setWalletAddresss: React.Dispatch<React.SetStateAction<string>>;
  walletAddresss: string;
  setWalletAddresssTransfer: React.Dispatch<React.SetStateAction<string>>;
  walletAddresstransfer: string | undefined;
  tokenAmount:  string | number | undefined;
  setTokenAmount: React.Dispatch<React.SetStateAction< string | number >>;
}

export default function TokenManagerPanel({
  handleFreeze = async () => {},
  handleUnfreeze = async () => {},
  transfertoken = async () => {},
  loadingFreeze = false,
  loadingUnfreeze = false,
  loadingTransfer = false,
  setWalletAddresss = () => {},
  walletAddresss,
  setWalletAddresssTransfer   = () => {},
  walletAddresstransfer  ,
  tokenAmount ,
  setTokenAmount = () => {},
}: TokenManagerPanelProps) {
  const [active, setActive] = useState("freeze"); // 'freeze' | 'transfer'
  const [mode, setMode] = useState("freeze"); // inside freeze panel: 'freeze' | 'unfreeze'

  const onAction = async () => {
    try {
      if (mode === "freeze") {
        await handleFreeze();
      } else {
        await handleUnfreeze();
      }
    } catch (err) {
    console.log("🚀 ~ onAction ~ err:", err)
    }
  };

  const onTransfer = async () => {
    try {
      await transfertoken();
    } catch (err) {
    console.log("🚀 ~ onTransfer ~ err:", err)
    }
  };

  return (
    <div className="min-h-screen bg-main -to-tr from-[#002a3a] via-[#06213a] to-[#031022] flex text-white">
      {/* Sidebar */}
      <aside className="w-[320px] p-6 bg-black/20 backdrop-blur-lg border-r border-white/6">
        <h2 className="text-4xl font-bold mb-6 bg-gradient-to-tr from-[#0a3a48] to-[#3492af] via-[#115e75] bg-clip-text text-transparent">USDT Manager</h2>
        <p className="text-lg text-white/70 mb-6 font-bold">Manage token accounts quickly — freeze, unfreeze or transfer.</p>

        <div className="space-y-3">
          <button
            onClick={() => setActive("freeze")}
            className={`w-full text-left cursor-pointer py-3 px-3 rounded-xl flex items-center gap-3 transition ${
              active === "freeze" ? "bg-white/8" : "hover:bg-white/4"
            }`}
          >
            <Lock className="w-5 h-5" /> <span className="font-bold text-xl">Freeze / Unfreeze</span>
          </button>

          <button
            onClick={() => setActive("transfer")}
            className={`w-full text-left cursor-pointer py-3 px-3 rounded-xl flex items-center gap-3 transition ${
              active === "transfer" ? "bg-white/8" : "hover:bg-white/4"
            }`}
          >
            <Send className="w-5 h-5" /> <span className="font-bold text-lg">Transfer Token</span>
          </button>
        </div>

        <div className="mt-8 text-lg text-white/70">
          <div className="flex items-center gap-2 mb-2 font-bold text-xl">
            <Wallet className="w-6 h-6 " /> <span>Wallet-ready</span>
          </div>
          <div className="flex items-center gap-2 font-bold  text-xl">
            <ArrowRightCircle className="w-6 h-6" /> <span>Fast processing</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-10 grid  grid-cols-1 md:grid-cols-2 gap-8">
        <AnimatePresence mode="wait">
          {active === "freeze" && (
            <motion.section
              key="freeze"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-black/20 backdrop-blur-lg rounded-2xl p-8 border border-white/6 shadow-lg"
            >
              <div className="flex items-center  justify-between mb-4">
                <h3 className="text-2xl font-bold bg-gradient-to-tr from-[#c7a5f3] via-[#dbd7e2] to-[#b087e2] bg-clip-text text-transparent">Freeze / Unfreeze</h3>

                <div className="rounded-lg bg-black/40 px-2 py-1 inline-flex">
                  <button
                    onClick={() => setMode("freeze")}
                    className={`px-3 py-1 cursor-pointer rounded ${mode === "freeze" ? "bg-teal-500 text-white" : "text-white/80"}`}
                  >
                    Freeze
                  </button>
                  <button
                    onClick={() => setMode("unfreeze")}
                    className={`px-3 py-1 rounded cursor-pointer ${mode === "unfreeze" ? "bg-rose-500 text-white" : "text-white/80"}`}
                  >
                    Unfreeze
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* floating label input */}
                <div className="relative">
                  <input
                    id="wallet"
                    value={walletAddresss}
                    onChange={(e) => setWalletAddresss(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent  border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white"
                  />
                  <label
                    htmlFor="wallet"
                    className="absolute left-4 -top-3 bg-transparent px-1 font-bold text-white/80"
                  >
                    Wallet Address
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onAction}
                    disabled={loadingFreeze || loadingUnfreeze}
                    className={`flex-1 py-3 rounded-xl  text-white font-bold cursor-pointer disabled:opacity-60   ${mode === "unfreeze" ? "bg-rose-500 text-white" : "text-white/80 bg-teal-600 hover:bg-teal-500"}     `}
                  >
                    {mode === "freeze" ? "Freeze Account" : "Unfreeze Account"}
                  </button>

                  <button onClick={() => {setWalletAddresss(""); setWalletAddresssTransfer("");}} className="px-4 py-3 rounded-xl bg-white/6 cursor-pointer text-white">
                    Clear
                  </button>
                </div>

                {(loadingFreeze || loadingUnfreeze) && (
                  <div className="flex justify-center mt-2">
                    <Spinner size={36} />
                  </div>
                )}
              </div>
            </motion.section>
          )}

          {active === "transfer" && (
            <motion.section
              key="transfer"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-white/6 shadow-lg"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">Transfer Token</h3>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    id="transferWallet"
                    // value={transferWallet}
                    value={walletAddresstransfer}
                    // onChange={(e) => setTransferWallet(e.target.value)}
                    onChange={(e) => {
                      setWalletAddresssTransfer(e.target.value);
                      setWalletAddresss(e.target.value)
                    }}
                    placeholder=" "
                    className="peer w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white font-bold text-xl"
                  />
                  <label htmlFor="transferWallet" className="absolute left-4 -top-2 bg-transparent px-1 text-sm text-white/80">
                    Recipient Wallet
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    value={tokenAmount}
                    // value={amount}
                    // onChange={(e) => setAmount(e.target.value)}
                    onChange={(e) => setTokenAmount(e.target.value)}
                    placeholder=" "
                    className="peer w-full bg-transparent border border-white/10 rounded-xl px-4 py-3 focus:outline-none text-white font-bold text-xl"
                  />
                  <label htmlFor="amount" className="absolute left-4 -top-2 bg-transparent px-1 text-sm text-white/80">
                    Amount
                  </label>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={onTransfer}
                    disabled={loadingTransfer}
                    className="flex-1 py-3 rounded-xl bg-[#0a3a48] border hover:bg-indigo-500 text-white font-semibold disabled:opacity-60"
                  >
                    Transfer Token
                  </button>

                  <button onClick={() => {setWalletAddresss(""); setWalletAddresssTransfer("");}} className="px-4 py-3 rounded-xl bg-white/6 text-white">
                    Clear
                  </button>
                </div>

                {loadingTransfer && (
                  <div className="flex justify-center mt-2">
                    <Spinner size={36} />
                  </div>
                )}

              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Helper / Info panel */}
        <aside className="hidden md:block bg-black/40 backdrop-blur-lg rounded-2xl p-6 border border-white/6">
          <h4 className="text-white font-bold mb-3">Quick Actions</h4>
          <p className="text-sm text-white/80 mb-4">Use the sidebar to switch modules. The buttons call your existing handlers.</p>

          <div className="space-y-3 text-white/80">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" /> <span className="text-sm">Recent: 3 freezes</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRightCircle className="w-4 h-4" /> <span className="text-sm">Last transfer: 100 USDT</span>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

// Simple spinner SVG used for loading states
function Spinner({ size = 24 }) {
  return (
    <svg className="animate-spin text-white" width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
