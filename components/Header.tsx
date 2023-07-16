import Link from "next/link"
import Image from "next/image"

import * as fcl from "@onflow/fcl";
import { useEffect, useState } from "react";

const AuthedState = ({ addr }: { addr: string | null }) => {
  return (
    <div>
      <div>Address: {addr ?? "No Address"}</div>
      <button onClick={fcl.unauthenticate}>Log Out</button>
    </div>
  )
}

const UnauthenticatedState = () => {
  return (
    <div>
      <button onClick={fcl.logIn}>Log In</button>
      <button onClick={fcl.signUp}>Sign Up</button>
    </div>
  )
}

const Header = () => {

  const [user, setUser] = useState({ loggedIn: null, addr: null })
  useEffect(() => { fcl.currentUser.subscribe(setUser) }, [])

  return <div className="navbar bg-base-100">
    <div className="flex-1">
      <div className="w-48">
        <Link href={"/"}><Image alt="logo of storyverse" src={"/logo.png"} height={"40"} layout='responsive' width={"40"} /></Link>
      </div>
    </div>
    <div className="flex-none">
      {user.loggedIn
        ? <AuthedState addr={user.addr} />
        : <UnauthenticatedState />
      }
    </div>
  </div>
}

export default Header
