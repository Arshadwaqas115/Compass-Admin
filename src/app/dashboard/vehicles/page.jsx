"use client"



import Chart from "./Chart";
import { useState } from "react";
import { Vehicles } from "./vehicles";
import { VehicleForm} from "./vehicleForm"
const Page = () => {

    const [path,setPath] = useState("vehicles")
    const [docId,setDocId] = useState("")
    const [type,setType] = useState("")
 
    return(
            <div className="pt-8">
                {path === "chart" && <Chart setPath={setPath} docId={docId} setDocId={setDocId} type={type}/>}
                {path === "vehicles" && <Vehicles setPath={setPath} setDocId={setDocId} setType={setType}/>}
                {path === "add" && <VehicleForm setPath={setPath}/>} 
                {/* {path === "users" && <Customers setPath={setPath} setDocId={setDocId} setType={setType}/>}
                
                {/* {path === "edit" && <EditForm setPath={setPath} docId={docId} />} */}
            </div>

    )
};

export default Page;
