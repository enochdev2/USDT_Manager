import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { StrictMode } from "react";
import "./index.css";
import WalletContextProvider from "./WalletContextProvider.tsx";

// Set up the network and wallets
const network = "devnet"; // or 'mainnet' if you want to use the main network

const wallets = [new PhantomWalletAdapter()];

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConnectionProvider endpoint={`https://api.${network}.solana.com`}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletContextProvider>
          <App />
        </WalletContextProvider>
      </WalletProvider>
    </ConnectionProvider>
  </StrictMode>
);
