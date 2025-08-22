import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { MINT_SIZE, TOKEN_PROGRAM_ID, createInitializeMint2Instruction, getMinimumBalanceForRentExemptMint } from "@solana/spl-token"

export function TokenLaunchpad({onTokenCreate}) {
    const {connection} = useConnection();
    const wallet = useWallet();

    async function createToken() {
        const mintKeypair = Keypair.generate();
        const lamports = await getMinimumBalanceForRentExemptMint(connection);

        const transaction = new Transaction().add (
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,                
                newAccountPubkey: mintKeypair.publicKey,
                /** Amount of lamports to transfer to the created account */
                lamports,
                /** Amount of space in bytes to allocate to the created account */
                space: MINT_SIZE,
                /** Public key of the program to assign as the owner of the created account */
                programId: TOKEN_PROGRAM_ID
            }),
            createInitializeMint2Instruction(mintKeypair.publicKey,9,wallet.publicKey,wallet.publicKey,TOKEN_PROGRAM_ID)
       );
       transaction.feePayer = wallet.publicKey;
       transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
       transaction.partialSign(mintKeypair);

       await wallet.sendTransaction(transaction,connection);
       console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
       //new update
       onTokenCreate(mintKeypair.publicKey)
    }
    return <div style={{
        height:'100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    }}>
        <h1>Solana Token Launchpad</h1>
        <input className="inputText" type="text" placeholder="Name"></input><br/>
        <input className="inputText" type="text" placeholder="Symbol"></input><br/>
        <input className="inputText" type="text" placeholder="ImageUrl"></input><br/>
        <input className="inputText" type="text" placeholder="Initial Supply"></input><br/>
        <button onClick={createToken} className="btn"> Create a token</button>
    </div>
}