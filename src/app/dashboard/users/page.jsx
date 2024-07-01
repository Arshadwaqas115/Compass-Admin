"use client"


import Chart from "./Chart";
import { useState } from "react";
import {Customers} from "./customers"
 import {EditForm} from "./editForm"
import { UserForm } from "@/components/add-user/userForm";
const Page = () => {

    const [path,setPath] = useState("users")
    const [docId,setDocId] = useState("")
    const [type,setType] = useState("")
    return(
            <div className="pt-8">
             
                {path === "chart" && <Chart setPath={setPath} docId={docId} setDocId={setDocId} type={type}/>}
                {path === "users" && <Customers setPath={setPath} setDocId={setDocId} setType={setType}/>}
                {path === "add" && <UserForm setPath={setPath}/>}
                {path === "edit" && <EditForm setPath={setPath} docId={docId} />}
            </div>

    )
};

export default Page;
