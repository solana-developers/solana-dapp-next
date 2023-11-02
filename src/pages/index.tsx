import type { NextPage } from "next";
import Head from "next/head";
import { HomeView } from "@/views";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Solana Scaffold</title>
        <meta
          name="description"
          content="Solana Scaffold"
        />
      </Head>
      <HomeView />
    </div>
  );
};

export default Home;
