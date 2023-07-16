import Head from 'next/head'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";

export default function Home() {

  const [user, setUser] = useState({ loggedIn: null, addr: null })
  useEffect(() => { fcl.currentUser.subscribe(setUser) }, [])

  return (
    <div>
      <Head>
        <title>Storyverse | Explore the world unkown to others | AI NFT Based Game</title>
        <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
        <link rel="icon" href="/favicon.png" />
      </Head>
      <h1 className="text-4xl font-bold underline">
        Flow App
      </h1>
    </div>
  );
}
