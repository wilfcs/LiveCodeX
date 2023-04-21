import Head from 'next/head'
import { Inter } from 'next/font/google'
import Logo from "../public/LiveCodeX logo red.json";
import Lottie from "lottie-react";



const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  
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
          <h1>Home page</h1>
          <div className='w-10'>
          <Lottie loop={true} animationData={Logo} height={100} width={100} />
          </div>
          <h1>working</h1>
        </>
      </main>
    </>
  );
}
