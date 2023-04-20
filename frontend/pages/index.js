import Head from 'next/head'
import { Inter } from 'next/font/google'
import { useState, useEffect } from 'react';
import axios from "axios"
import stubs from './components/defaultStubs';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp")
  const [output, setOutput] = useState("")
  const [jobId, setJobId] = useState("")
  const [status, setStatus] = useState("")

  useEffect(() => {
    setCode(stubs[language]);
  }, [language])

  useEffect(()=>{
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, [])
  

  const setDefaultLanguage = ()=>{
    let response = window.confirm(`Do you want to set this as your default language?`)
    if(response){
      localStorage.setItem("default-language", language);
    }
  }

  const handleSubmit = async()=>{
    const payload = {
      language,
      code
    };
    try {
      setJobId("");
      setStatus("");
      setOutput("");

      const { data } = await axios.post("http://localhost:5000/run", payload);
      console.log(data)
      setJobId(data.jobId);

      let intervalId;

      intervalId = setInterval(async ()=>{
        const { data: dataRes } = await axios.get("http://localhost:5000/status", { params: {id: data.jobId}});
        console.log(dataRes)

        const { success, job, error } = dataRes;
        console.log(dataRes);

        if (success) {
          let jobStatus = "Pending", jobOutput;
          if (job){
            // { status: jobStatus, output: jobOutput } = job;
            jobStatus = job.status;
            jobOutput = job.output;
          }

          setStatus(jobStatus);
           
          if (jobStatus === "Pending") return;
          setOutput(jobOutput);
          clearInterval(intervalId);
        } else {
          console.error(error);
          setStatus("Error: Please try again!")
          clearInterval(intervalId);
          setOutput(error);
        }
      }, 500);

      

    } catch ({response}) {
      if(response){
        const errorMessage = response.data.error.stderr;
        setOutput(errorMessage);
      }
      else{
        setOutput("Error connecting to server");
      }
      // console.log(response)
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
        <h1 className="text-3xl font-bold underline">LiveCodeX</h1>
        <div>
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => {
              let response = window.confirm(
                "WARNING: Switching the language will remove your current code. Do you want to proceed?"
              )
              if(response)
                setLanguage(e.target.value);
            }}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </div>
        <div>
          <button onClick={setDefaultLanguage}>Set Default</button>
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
        <p>{status}</p>
        {output ?  <p className="text-green-700">Output-{output}</p> : <></>}
   
      </main>
    </>
  );
}
