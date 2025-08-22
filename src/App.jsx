import { useState, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import "@solana/wallet-adapter-react-ui/styles.css";
import "./App.css";
import { TokenLaunchpad } from './components/CreateToken';
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { MintToken } from "./components/MintToken";
import { CreatePool } from "./components/CreatePool";

function App() {
  const [token, setToken] = useState(null);
  const [mintDone, setMintDone] = useState(false);

  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
//new update
  return (
    <ConnectionProvider
      endpoint={
        process.env.REACT_APP_RPC_ENDPOINT
      }
    >
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
        <WalletDisconnectButton />
        <TokenLaunchpad onTokenCreate={(tokenMint) => {
          setToken(tokenMint);
        }} />
        {token && token.toBase58()}
        {token && <MintToken onDone={() => setMintDone(true)} mintAddress={token} />}
        {mintDone && <CreatePool />}
        </WalletModalProvider>
        
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
