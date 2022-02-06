import { useConnection, useWallet, WalletProvider } from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionSignature, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";

import {
    NATIVE_MINT,
    Token,
    TOKEN_PROGRAM_ID,
} from "@solana/spl-token";




export const CreateToken: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const onClick = useCallback(async () => {
        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = '';

        const kp = Keypair.generate();
        console.log(kp.publicKey);
        console.log(kp.secretKey);

        signature = await connection.requestAirdrop(kp.publicKey, LAMPORTS_PER_SOL);
        await connection.confirmTransaction(signature, 'confirmed');

        const mintRequester = publicKey;
        const mintingFromWallet = kp;

        const creatorToken = await Token.createMint(connection, mintingFromWallet, mintingFromWallet.publicKey, null, 6, TOKEN_PROGRAM_ID);
        console.log(creatorToken);
        const fromTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(mintingFromWallet.publicKey);
        console.log(fromTokenAccount);
        const mintToResult = await creatorToken.mintTo(fromTokenAccount.address, mintingFromWallet.publicKey, [], 1000000);
        console.log(mintToResult);

        const toTokenAccount = await creatorToken.getOrCreateAssociatedAccountInfo(mintRequester);
        const transaction = new Transaction().add(
            Token.createTransferInstruction(
                TOKEN_PROGRAM_ID,
                fromTokenAccount.address,
                toTokenAccount.address,
                mintingFromWallet.publicKey,
                [],
                1000000
            )
        );

        signature = await sendAndConfirmTransaction(connection, transaction, [mintingFromWallet], { commitment: "confirmed" });

        console.log(signature);


    }, [publicKey, notify, connection, sendTransaction]);

    return (
        <div>
            <button
                className="btn m-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:from-pink-500 hover:to-yellow-500 ..."
                onClick={onClick} disabled={!publicKey}
            >
                <span> Create Token </span>
            </button>
        </div>
    );
};
