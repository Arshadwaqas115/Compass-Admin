"use client";


import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import {UserForm} from '../../../components/edit-user/userForm'
import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";

export const EditForm = ({ docId, setPath }) => {
  const [loading,setLoading] = useState(false)
  const [data,setData] = useState({})
  const fetchData = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "Data", docId);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      setData({docId:docSnap.id,...data})
     

      setLoading(false);
    } catch (error) {
      console.error("Error fetching document: ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
          <div className='flex flex-row justify-between mb-12'>
              <div>
                 <h1 className='text-xl'>Edit Guest</h1>
              </div>
              <div>
                    <button className="bg-black py-2 px-4 rounded-full text-white " onClick={() => { setPath("users") }}>Back</button>
              </div>
              
             
        </div>
        <div>
                    <UserForm data={data} setPath={setPath} />
          </div>
      </div>
    );
  }
};


