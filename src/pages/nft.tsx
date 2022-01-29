import type { NextPage } from "next";
import Head from "next/head";
import { NFTView } from "../views";

const NFT: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="NFT basics"
        />
      </Head>
      <NFTView />
    </div>
  );
};

export default NFT;
