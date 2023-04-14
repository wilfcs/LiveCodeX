import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';
import axios from "axios"


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp")
  const [output, setOutput] = useState("")


  const handleSubmit = async()=>{
    const payload = {
      language,
      code
    };
    try {
      const { data } = await axios.post("http://localhost:5000/run", payload);
      setOutput(data.output);
    } catch (error) {
      console.log(error.response)
    }
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold underline">Write your code here</h1>
        <div>
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
            }}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </div>
        <textarea
          name="codeBox"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          cols="60"
          rows="10"
          className="border-4"
        ></textarea>
        <button
          className="border-2 bg-blue-300 p-4 rounded-lg"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <h1>Output- </h1>
        <p className="text-green-700">{output}</p>
      </main>
    </>
  );
}
