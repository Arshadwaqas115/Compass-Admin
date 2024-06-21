"use client";

import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Sublocation } from "./sublocation";
import { useState } from "react";
import dayjs from "dayjs";
import { Loading } from "./loading";
import { collection, addDoc } from "firebase/firestore";
import {db} from "../../firebase/firebase"
export const UserForm = () => {
  // User Main States
  const [userName, setUserName] = useState("");
  const [service, setService] = useState("");
  const [remarks, setRemarks] = useState("");
  const [stayDurationFrom, setStayDurationFrom] = useState(null);
  const [stayDurationTo, setStayDurationTo] = useState(null);
  const [loading, setLoading] = useState(false);



  // Sub Locations States
  const [subLocation, setSubLocation] = useState("");
  const [subStayFrom, setSubStayFrom] = useState(null);
  const [subStayTo, setSubStayTo] = useState(null);
  const [sublocations, setSubLocations] = useState([]);

  console.log(sublocations)
  const deleteSubLocation =(item) =>{
    console.log("run",item)
    const updatedLocations =  sublocations.filter((x)=> item.id !==x.id)

      setSubLocations([...updatedLocations])
  }


  const addSubLocation = () => {
    if (!subStayTo || !subStayFrom || !subLocation) {
      alert("Please fill all the missing fields in sublocations");
      return;
    }

    const formattedSubStayFrom = subStayFrom ? dayjs(subStayFrom).format("M/D/YYYY") : "";
    const formattedSubStayTo = subStayTo ? dayjs(subStayTo).format("M/D/YYYY") : "";
    const uuid = crypto.randomUUID();

    const SubLocationObject = {
      type: "task",
      id: uuid,
      name: subLocation,
      start: formattedSubStayFrom,
      end: formattedSubStayTo,
      progress: 100,
      project: userName,
    };

    setSubLocations([...sublocations, SubLocationObject]);
    setSubLocation("");
    setSubStayFrom(null);
    setSubStayTo(null);
  };

  const finalSubmit = async () => {
    if (!userName || !service || !stayDurationFrom || !stayDurationTo) {
      alert("Fill all the missing fields");
      return;
    }

    setLoading(true);

    try {
      const StayFrom = stayDurationFrom ? dayjs(stayDurationFrom).format("M/D/YYYY") : "";
      const StayTo = stayDurationTo ? dayjs(stayDurationTo).format("M/D/YYYY") : "";
      const mainObj = {
        type: "project",
        id: userName,
        name: userName,
        start: StayFrom,
        end: StayTo,
        progress: 100,
        hideChildren: false,
      };

      const finalObject = [mainObj, ...sublocations];
      console.log(finalObject);
     
      
      const docRef = await addDoc(collection(db, "data"), {data:finalObject,info:{remarks:remarks, service:service ,name:userName}});
    
      const userData = {
        id:docRef.id,
        name:userName,
        createdAt: Date.now()
      }
      // const userRef = await addDoc(collection(db, "users"), userData);
      
      setLoading(false);
      setSubLocations([])
      setUserName("")
      setService("")
      setStayDurationFrom(null)
      setStayDurationTo(null)
      setRemarks("")
    } catch (error) {
      console.log(error)
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  } 
    else{
      return (
        <div>
                            <div className="grid grid-cols-2 border-b pb-2 container">
    
                                    <div className="p-4 flex flex-col gap-4">
                                            <div>
                                                <h1 className="p-2">User Name:</h1>
                                                <input 
                                                  value={userName} 
                                                  placeholder="Enter user name" 
                                                  className=" border-b p-2 pb-2"
                                                  onChange={(e)=>{setUserName(e.target.value)}}
                                                  />
                                            </div>
                                            <div>
                                                <h1 className="p-2">Service:</h1>
                                                <input
                                                  value={service}
                                                  onChange={(e)=>{setService(e.target.value)}}
                                                  placeholder="Enter Service" 
                                                  className=" border-b p-2 pb-2"
                                                 />
                                            </div>
                                            <div>
                                                <h1 className="p-2">Remarks:</h1>
                                                <input 
                                                  value={remarks}
                                                  onChange={(e)=>{setRemarks(e.target.value)}}
                                                  placeholder="Enter Remarks" 
                                                  className=" border-b p-2 pb-2"
                                                />
                                            </div>
                                            <div>
                                                <h1 className="p-2">Stay Duration From:</h1>
                                                <DatePicker
                                                  value={stayDurationFrom}
                                                  onChange={(value)=>{setStayDurationFrom(value)}}
    
                                                />
                                            </div>
                                            <div>
                                                <h1 className="p-2">Stay Duration To:</h1>
                                                <DatePicker
                                                  value={stayDurationTo}
                                                  onChange={(value)=>{setStayDurationTo(value)}}
                                                />
                                            </div>
                                            <div >
                                                 <button className="border py-2 px-4 mt-4  w-40 text-center rounded-xl border-black cursor-pointer" onClick={finalSubmit}>Submit</button>
                                            </div>
                                          
                                    </div>
                                    <div className="p-4 flex flex-col gap-4">
                                          <div>
                                              <h1 className="p-1">Sub Locations:</h1>
                                          </div>
                                          <div>
                                                  <h1 className="p-2">Location Name:</h1>
                                                  <input 
                                                    value={subLocation} 
                                                    placeholder="Enter location name" 
                                                    className=" border-b p-2 pb-2"
                                                    onChange=
                                                      {(e)=>{setSubLocation(e.target.value)}
                                                    }
                                                  />
                                          </div>
                                          <div>
                                                  <h1 className="p-2">Stay Duration From:</h1>
                                                  <DatePicker
                                                   value={subStayFrom}
                                                   onChange={(value)=>{setSubStayFrom(value)}}
                                                  />
                                          </div>
                                            <div>
                                                <h1 className="p-2">Stay Duration To:</h1>
                                                  <DatePicker
                                                  value={subStayTo}
                                                  onChange={(value)=>{setSubStayTo(value)}}
                                                  />
                                            </div>
                                            <div className="">
                                                <div>
                                                    <Button variant="outlined" className="!text-red-400 !w-40 !border-gray-400" onClick={addSubLocation}>Add</Button>
                                                </div>
                                            </div>
                                            
                                    </div>
                            </div>
    
                            <div className="p-4 flex flex-row gap-4 overflow-x-scroll">
                                  
                                      {sublocations?.map((item,index)=>{
                                        return(
                                          <div key={index}>
                                               <Sublocation item={item} key={index} deleteSubLocation={deleteSubLocation}/>
                                          </div>
                                        )
                                      })}
                                      
                                  
                                
                            </div>
        </div>
      )
    }  
 
}

