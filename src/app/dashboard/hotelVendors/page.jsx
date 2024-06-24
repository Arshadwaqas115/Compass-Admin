"use client"



import Chart from "./Chart";
import { useState } from "react";
import { Vendors } from "./vendors";
import {VendorForm} from "./vendorform"
const Page = () => {

    const [path,setPath] = useState("agents")
    const [docId,setDocId] = useState("")
    const [type,setType] = useState("")
    return(
            <div className="pt-8">
                {path === "chart" && <Chart setPath={setPath} docId={docId} setDocId={setDocId} type={type}/>}
                {path === "agents" && <Vendors setPath={setPath} setDocId={setDocId} setType={setType}/>}
                {path === "add" && <VendorForm setPath={setPath}/>} 
                {/* {path === "users" && <Customers setPath={setPath} setDocId={setDocId} setType={setType}/>}
                
                {/* {path === "edit" && <EditForm setPath={setPath} docId={docId} />} */}
            </div>

    )
};

export default Page;
