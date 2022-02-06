import { useConnection, useWallet} from '@solana/wallet-adapter-react';
import { Keypair, SystemProgram, Transaction, TransactionSignature, LAMPORTS_PER_SOL, sendAndConfirmTransaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";
import { Token, TOKEN_PROGRAM_ID} from "@solana/spl-token";
import useUserSOLBalanceStore from '../stores/useUserSOLBalanceStore';

export const CreateToken: FC = () => {
    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();
    const { getUserSOLBalance } = useUserSOLBalanceStore();

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

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: kp.publicKey,
                    lamports: LAMPORTS_PER_SOL/100,
                })
            );

            signature = await sendTransaction(transaction, connection);

            await connection.confirmTransaction(signature, 'confirmed');
            notify({ type: 'success', message: 'Transaction successful!', txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            console.log('error', `Transaction failed! ${error?.message}`, signature);
            return;
        }

        const mintRequester = publicKey;
        const mintingFromWallet = kp;

        try {
            const startBalance = getUserSOLBalance(kp.publicKey, connection);
            console.log('start balance: ');
            console.log(startBalance);

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

            const endBalance = getUserSOLBalance(kp.publicKey, connection);
            console.log('end balance: ');
            console.log(endBalance);
            notify({ type: 'success', message: 'Token created successful!', txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Token creation failed!`, description: error?.message, txid: signature });
            console.log('error', `Token creation failed! ${error?.message}`, signature);
            return;
        }

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
