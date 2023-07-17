import Head from 'next/head'
import Image from 'next/image'
import "../flow/config";
import { useState, useEffect } from "react";
import * as fcl from "@onflow/fcl";
import '../styles/Home.module.css';
import Gameplay from '../components/Gameplay';

const HomeContent = () => {
  return <>
    <Head>
      <title>Storyverse | Explore the world unkown to others | AI NFT Based Game</title>
      <meta name="description" content="World's first Generative AI based NFT Game in which player emerses themselves into text-based storyline and take decisions to progress on-chain." />
      <link rel="icon" href="/favicon.png" />
    </Head>
    <div className='flex flex-col flex-1 justify-center items-center'>
      <div className='flex flex-1 justify-center items-center flex-col'>
        <h1 className='text-4xl font-bold text-white leading-relaxed text-shadow'>Unleash Your Imagination, Forge Your Storyline, Collect NFT Memories!</h1>
        <h2 className='text-xl text-white font-bold text-shadow'>A text-based game for story readers, thinkers and creators.</h2>
        <div className='flex-row mt-8'>
          <div className='btn btn-accent mr-2'>Read Docs</div>
          <div className='btn' onClick={fcl.logIn}>Start Game</div>
        </div>
      </div>
    </div>
    <div className='flex justify-center items-center flex-col mb-12'>
      <Image src={"/type.gif"} height={250} width={250} alt="type" />
    </div>
  </>
}


export default function Home() {

  const [user, setUser] = useState({ loggedIn: null, addr: null })
  useEffect(() => { fcl.currentUser.subscribe(setUser) }, [])

  return (
    <div className='mt-12 body h-full p-4 flex flex-1 flex-col justify-between items-center text-center'>
      {user.loggedIn ? <Gameplay /> : <HomeContent />}
    </div>
  );
}
