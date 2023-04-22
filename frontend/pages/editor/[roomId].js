import { useRouter } from "next/router";
import React from "react";
import Head from "next/head";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import stubs from "../components/defaultStubs";
import moment from "moment";
import Client from "../components/Client";
import Logo2 from "../components/Logo2";
import {IoMdCheckmarkCircle} from "react-icons/io"
import { BiReset } from "react-icons/bi";
import { AiFillSetting } from "react-icons/ai";
import { AiOutlineClose } from "react-icons/ai";
import Editor from "@monaco-editor/react"
import Theme from "../components/Theme";
import Language from "../components/Language";
import Font from "../components/Font";
import Size from "../components/Size";


const roomId = () => {
  const router = useRouter();
  const idOfRoom = router.query.roomId;
  const editorRef = useRef(null);

  // This section is for the logic of the execution of the files.

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [jobId, setJobId] = useState("");
  const [status, setStatus] = useState("");
  const [jobDetails, setJobDetails] = useState(null);
  const [username, setUsername] = useState("")
  const [theme, setTheme] = useState("vs-dark")
  const [sizeOfFont, setSizeOfFont] = useState(20);
  const [familyOfFont, setFamilyOfFont] = useState("default");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setCode(stubs[language]);
  }, [language]);

  useEffect(() => {
    const defaultLang = localStorage.getItem("default-language") || "cpp";
    const defaultTheme = localStorage.getItem("default-theme") || "vs-dark";
    const defaultSize = localStorage.getItem("default-size") || 20;
    const defaultFont = localStorage.getItem("default-font") || "default";
    setLanguage(defaultLang);
    setTheme(defaultTheme);
    setSizeOfFont(defaultSize);
    setFamilyOfFont(defaultFont);
  }, []);

useEffect(() => {
  setUsername(router.query.name);
}, [router.query]);



  const setDefaultLanguage = () => {
    let response = window.confirm(
      `This will set all your current settings as your default settings. Would you like to continue?`
    );
    if (response) {
      localStorage.setItem("default-language", language);
      localStorage.setItem("default-theme", theme);
      localStorage.setItem("default-size", sizeOfFont);
      localStorage.setItem("default-font", familyOfFont);
    }
  };

  const resetCode = () => {
    let response = window.confirm(
      "This will reset the code in the editor. Would you like to continue?"
    );
    if (response) setCode(stubs[language]);
  };

  const handleEditorDidMount = (editor, monaco) =>{
    editorRef.current = editor;
  }
  const setEditorValue = ()=>{
    setCode(editorRef.current.getValue());
    }

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
        <div className="aside">
          <div className="asideInner">
            <div className="logo">
              <Logo2 />
            </div>
            <h3 className="logoColor2 flex items-center flex-wrap text-sm mt-6 mb-2">
              Connection Successful <IoMdCheckmarkCircle className="m-2" />
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
            Leave Room
          </button>
        </div>

        <div className="editorWrap">
          <div className="editorTopbar flex items-center justify-between mx-20 flex-wrap">
            <div>
              <Language language={language} setLanguage={setLanguage} />
            </div>

            <div className="flex">
              <Theme theme={theme} setTheme={setTheme} />
              <button
                onClick={resetCode}
                className="text-white text-2xl hover:animate-pulse mx-2"
              >
                <BiReset />
              </button>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white text-2xl hover:animate-pulse"
              >
                <AiFillSetting />
              </button>
            </div>

            {isOpen && (
              <div className="fixed inset-0 bg-slate-700 bg-opacity-75 z-50 flex justify-center items-center text-white">
                <div className="p-4 pop-up rounded-lg shadow-lg">
                  <div className="flex justify-between items-center w-full mb-8 border-b-2 border-slate-700">
                    <div className="text-4xl">Settings</div>
                    <div>
                      <button
                        className="text-3xl"
                        onClick={() => setIsOpen(false)}
                      >
                        <AiOutlineClose />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col w-full items-center">
                    <div className="flex justify-between w-full">
                      <div>
                        <p className="text-2xl">Font size</p>
                        <p className="text-slate-400">
                          Choose your preferred font size for the code editor.
                        </p>
                      </div>
                      <div>
                        <Size
                          sizeOfFont={sizeOfFont}
                          setSizeOfFont={setSizeOfFont}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>
                        <p className="text-2xl">Font family</p>
                        <p className="text-slate-400">
                          Choose your preferred font family for the code editor.
                        </p>
                      </div>
                      <div>
                        <Font
                          familyOfFont={familyOfFont}
                          setFamilyOfFont={setFamilyOfFont}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div>
                        <p className="text-2xl">Set as default</p>
                        <p className="text-slate-400">
                          Click to set all the current settings as your default
                          settings.
                        </p>
                      </div>
                      <div>
                        <button
                          onClick={setDefaultLanguage}
                          className="btn defaultButton m-2"
                        >
                          Set Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="editorContent">
            <Editor
              name="codeBox"
              value={code}
              onMount={handleEditorDidMount}
              onChange={setEditorValue}
              height="85vh"
              width="100%"
              theme={theme}
              defaultLanguage="cpp"
              options={{ fontSize: sizeOfFont, fontFamily: familyOfFont }}
            />
          </div>

          <div className="editorBottombar flex flex-col justify-center">
            <div>
              {" "}
              <div className="run-code flex justify-between items-center">
                {" "}
                <button className="btn consoleButton mx-10">Console</button>
                <button className="btn runButton mx-10" onClick={handleSubmit}>
                  Run Code
                </button>
              </div>
              <p>{status}</p>
              <p>{renderJobDetails()}</p>
              {output ? (
                <p className="text-green-700">Output-{output}</p>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default roomId;