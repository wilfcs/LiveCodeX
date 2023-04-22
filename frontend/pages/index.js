import Head from 'next/head'
import { Inter } from 'next/font/google'
import Logo from "./components/Logo"
import {v4 as uuidv4} from "uuid";
import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";
import Router, { withRouter } from "next/router";


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const router = useRouter();

  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success("Created a new room");
  };

  const joinRoom = ()=>{
    if(!roomId || !username){
      toast.error("Please enter Room ID and Username")
      return;
    }
    router.push({
      pathname: `/editor/${roomId}`,
      query: { name: username },
    }, `editor/${roomId}`);
  }

  const handleInputEnter = (e)=>{
    if(e.code === "Enter")
      joinRoom();
  }
  
  return (
    <>
      <Head>
        <title>LiveCodeX</title>
        <meta
          name="description"
          content="Online code compiler that can be used by interviewers to evaluate the interviewee's performance. It shows code written by interviewee to the interviewer in real time. Interviewer simply can make a room and send the code to the interviewee so they can join the room and write thier codes and compile them"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main>
        <>
          <div>
            <Toaster
              toastOptions={{
                success: {
                  theme: {
                    primary: "",
                  },
                },
              }}
            ></Toaster>
          </div>
          <div className="homePageWrapper">
            <div className="formWrapper">
              <div className=''>
                <Logo />
              </div>

              <h4 className="mainLabel text-slate-400">
                Join a room & share code in real-time🔥
              </h4>

              <div className="inputGroup">
                <input
                  type="text"
                  className="inputBox"
                  placeholder="ROOM ID"
                  onChange={(e) => setRoomId(e.target.value)}
                  value={roomId}
                  onKeyUp={handleInputEnter}
                />
                <input
                  type="text"
                  className="inputBox"
                  placeholder="USERNAME"
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                  onKeyUp={handleInputEnter}
                />
                <button className="btn joinBtn" onClick={joinRoom}>
                  Join
                </button>
                <span className="createInfo">
                  If you don't have an invite then create &nbsp;
                  <a href="" className="createNewBtn" onClick={createNewRoom}>
                    new room
                  </a>
                </span>
              </div>
            </div>
            <footer>
              <h4 className='text-slate-400'>
                Contact the &nbsp;
                <a
                  href="https://portfolio-website-xi-two.vercel.app/"
                  target="_blank"
                  className="underline"
                >
                  Dev :)
                </a>
              </h4>
            </footer>
          </div>
        </>
      </main>
    </>
  );
}
