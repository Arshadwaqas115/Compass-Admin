"use client"



import Chart from "./Chart";
import { useState } from "react";
import { Hotels } from "./hotels";
import { HotelForm} from "./hotelForm"
const Page = () => {

    const [path,setPath] = useState("hotels")
    const [docId,setDocId] = useState("")
    const [type,setType] = useState("")
 
    return(
            <div className="pt-8">
                {path === "chart" && <Chart setPath={setPath} docId={docId} setDocId={setDocId} type={type}/>}
                {path === "hotels" && <Hotels setPath={setPath} setDocId={setDocId} setType={setType}/>}
                {path === "add" && <HotelForm setPath={setPath}/>} 
                {/* {path === "users" && <Customers setPath={setPath} setDocId={setDocId} setType={setType}/>}
                
                {/* {path === "edit" && <EditForm setPath={setPath} docId={docId} />} */}
            </div>

    )
};

export default Page;
