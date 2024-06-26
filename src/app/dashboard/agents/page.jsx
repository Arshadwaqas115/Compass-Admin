"use client"



import Chart from "./Chart";
import { useState } from "react";
import { Agents } from "./agents";
import {AgentForm} from "./agentForm"
const Page = () => {

    const [path,setPath] = useState("agents")
    const [docId,setDocId] = useState("")
    const [type,setType] = useState("")
 
    return(
            <div className="pt-8">
                {path === "chart" && <Chart setPath={setPath} docId={docId} setDocId={setDocId} type={type}/>}
                {path === "agents" && <Agents setPath={setPath} setDocId={setDocId} setType={setType}/>}
                {path === "add" && <AgentForm setPath={setPath}/>} 
                {/* {path === "users" && <Customers setPath={setPath} setDocId={setDocId} setType={setType}/>}
                
                {/* {path === "edit" && <EditForm setPath={setPath} docId={docId} />} */}
            </div>

    )
};

export default Page;
