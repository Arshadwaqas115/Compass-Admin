"use client";

import { Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { Sublocation } from "../../../components/custom/sublocation";
import { useEffect, useState } from "react";
import dayjs from "dayjs";

import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";

export const EditForm = ({ docId, setPath }) => {
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

  const fetchData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "data", docId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      setUserName(data.info.name);
      setService(data.info.service);
      setRemarks(data.info.remarks);
      setStayDurationFrom(dayjs(data.data[0].start));
      setStayDurationTo(dayjs(data.data[0].end));
      setSubLocations(data.data.slice(1));

      setLoading(false);
    } catch (error) {
      console.error("Error fetching document: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteSubLocation = (item) => {
    const updatedLocations = sublocations.filter((x) => item.id !== x.id);
    setSubLocations([...updatedLocations]);
  };

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
    

      await updateDoc(doc(db, "data", docId), { data: finalObject, info: { remarks: remarks, service: service, name: userName } });



        const usersRef = collection(db, "users");
        const q = query(usersRef, where("id", "==", docId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await updateDoc(userDoc.ref, { name: userName });
        }
      setLoading(false);
      setPath("users"); 
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
         <div className="pb-10 pl-4 flex items-center ">
          
            <div>
               <button className="bg-black py-2 px-4 rounded-full text-white " onClick={()=>{setPath("users")}}>Back</button>
            </div>
        </div>
        <div className="grid grid-cols-2 border-b pb-2 container">
          <div className="p-4 flex flex-col gap-4">
            <div>
              <h1 className="p-2">User Name:</h1>
              <input
                value={userName}
                placeholder="Enter user name"
                className="border-b p-2 pb-2"
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </div>
            <div>
              <h1 className="p-2">Service:</h1>
              <input
                value={service}
                onChange={(e) => {
                  setService(e.target.value);
                }}
                placeholder="Enter Service"
                className="border-b p-2 pb-2"
              />
            </div>
            <div>
              <h1 className="p-2">Remarks:</h1>
              <input
                value={remarks}
                onChange={(e) => {
                  setRemarks(e.target.value);
                }}
                placeholder="Enter Remarks"
                className="border-b p-2 pb-2"
              />
            </div>
            <div>
              <h1 className="p-2">Stay Duration From:</h1>
              <DatePicker value={stayDurationFrom} onChange={(value) => { setStayDurationFrom(value); }} />
            </div>
            <div>
              <h1 className="p-2">Stay Duration To:</h1>
              <DatePicker value={stayDurationTo} onChange={(value) => { setStayDurationTo(value); }} />
            </div>
            <div>
              <button className="border py-2 px-4 mt-4 w-40 text-center rounded-xl border-black cursor-pointer" onClick={finalSubmit}>Submit</button>
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
                className="border-b p-2 pb-2"
                onChange={(e) => {
                  setSubLocation(e.target.value);
                }}
              />
            </div>
            <div>
              <h1 className="p-2">Stay Duration From:</h1>
              <DatePicker value={subStayFrom} onChange={(value) => { setSubStayFrom(value); }} />
            </div>
            <div>
              <h1 className="p-2">Stay Duration To:</h1>
              <DatePicker value={subStayTo} onChange={(value) => { setSubStayTo(value); }} />
            </div>
            <div className="">
              <div>
                <Button variant="outlined" className="!text-red-400 !w-40 !border-gray-400" onClick={addSubLocation}>Add</Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 flex flex-row gap-4 overflow-x-scroll">
          {sublocations?.map((item, index) => (
            <div key={index}>
              <Sublocation item={item} deleteSubLocation={deleteSubLocation} />
            </div>
          ))}
        </div>
      </div>
    );
  }
};


