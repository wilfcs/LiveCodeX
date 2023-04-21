import { useRouter } from "next/router";
import React from "react";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";
import stubs from "../components/defaultStubs";
import moment from "moment";
import Client from "../components/Client";
import Logo from "../components/Logo";
import Logo2 from "../components/Logo2";
import { FaBeer } from "react-icons/fa";
import {IoMdCheckmarkCircle} from "react-icons/io"

const roomId = () => {
  const router = useRouter();
  const idOfRoom = router.query.roomId;

  // This section is for the logic of the execution of the files.

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [jobDetails, setJobDetails] = useState(null);
  const [username, setUsername] = useState("")

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    setLanguage(defaultLang);
  }, []);

useEffect(() => {
  setUsername(router.query.name);
}, [router.query]);



  const setDefaultLanguage = () => {
    let response = window.confirm(
      `This will set ${
        language === "py" ? "python" : "c++"
      } as your default language. Would you like to continue?`
    );
    if (response) {
      localStorage.setItem("default-language", language);
    }
  };

  const resetCode = () => {
    let response = window.confirm(
      "This will reset the code in the editor. Would you like to continue?"
    );
    if (response) setCode(stubs[language]);
  };

  const renderJobDetails = () => {
    if (!jobDetails) return "";

    let result = "";
    let { submittedAt, completedAt, startedAt } = jobDetails;
    submittedAt = moment(submittedAt).toString();
    // result += `Submitted at: ${submittedAt}`;

    if (!completedAt || !startedAt) return result;

    const start = moment(startedAt);
    const end = moment(completedAt);

    const executionTime = end.diff(start, "seconds", true);

    result += `  Execution time: ${executionTime}s`;

    return result;
  };
  const handleSubmit = async () => {
    const payload = {
      language,
      code,
    };
    try {
      setJobId("");
      setStatus("");
      setOutput("");
      setJobDetails(null);

      const { data } = await axios.post("http://localhost:5000/run", payload);
      console.log(data);
      setJobId(data.jobId);

      let intervalId;

      intervalId = setInterval(async () => {
        const { data: dataRes } = await axios.get(
          "http://localhost:5000/status",
          { params: { id: data.jobId } }
        );
        console.log(dataRes);

        const { success, job, error } = dataRes;
        console.log(dataRes);

        if (success) {
          let jobStatus = "Pending",
            jobOutput;
          if (job) {
            // { status: jobStatus, output: jobOutput } = job;
            jobStatus = job.status;
            jobOutput = job.output;
          }

          setStatus(jobStatus);
          setJobDetails(job);
          renderJobDetails();
          if (jobStatus === "Pending") return;
          setOutput(jobOutput);
          clearInterval(intervalId);
        } else {
          console.error(error);
          setStatus("Error: Please try again!");
          clearInterval(intervalId);
          setOutput(error);
        }
      }, 500);
    } catch ({ response }) {
      if (response) {
        const errorMessage = response.data.error.stderr;
        setOutput(errorMessage);
      } else {
        setOutput("Error connecting to server");
      }
      // console.log(response)
    }
  };

  // End of the execution logic

  // This section is the logic for live editor sync

  const [clients , setClients] = useState([
    {socketId: 1, userName: 'Himanshu'},
    {socketId: 2, userName: 'Aditi'}
  ])

  const copyRoomId = ()=>{

  }

  const leaveRoom = ()=>{

  }

  return (
    <>
      <div className="mainWrap">
        <Head>
          <title>LiveCodeX</title>
        </Head>
        {/* <div>
          <label>Language:</label>
          <select
            value={language}
            onChange={(e) => {
              let response = window.confirm(
                "WARNING: Switching the language will remove your current code. Do you want to proceed?"
              );
              if (response) setLanguage(e.target.value);
            }}
          >
            <option value="cpp">C++</option>
            <option value="py">Python</option>
          </select>
        </div> */}
        {/* <div>
          <button onClick={setDefaultLanguage}>Set Default</button>
        </div> */}
        {/* <div>
          <button onClick={resetCode}>Reset logo</button>
        </div> */}
        {/* <div>
          <a
            href="https://portfolio-website-xi-two.vercel.app/"
            target="_blank"
          >
            i
          </a>
        </div> */}
        {/* <textarea
          name="codeBox"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          cols="60"
          rows="10"
          className="border-4"
        ></textarea> */}
        {/* <div>
          {" "}
          <button
            className="border-2 bg-blue-300 p-4 rounded-lg"
            onClick={handleSubmit}
          >
            Run Code
          </button>
          <p>{status}</p>
          <p>{renderJobDetails()}</p>
          {output ? <p className="text-green-700">Output-{output}</p> : <></>}
        </div> */}

        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              {/* <Logo className="logoImage" /> */}
              <Logo2 />
            </div>
            <h3 className="logoColor2 flex items-center flex-wrap text-sm mt-6 mb-2">
              Connection Successful <IoMdCheckmarkCircle className="m-2"/>
            </h3>
            <div className="clientsList">
              {clients.map((client) => (
                <Client key={client.socketId} userName={client.userName} />
              ))}
            </div>
          </div>
          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        <div className="editorWrap bg-slate-300">Editor goes here...</div>
      </div>
    </>
  );
};

export default roomId;