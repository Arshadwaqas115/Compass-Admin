"use client"

import { Loading } from "@/components/custom/loading";
import { db } from "@/firebase/firebase";
import { Avatar } from "@mui/material";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

export const VendorForm = ({ setPath }) => {
  const [agent, setAgent] = useState("");
  const [loading, setLoading] = useState(false);

  const addVendor = async () => {
    if (agent.trim() === "") {
      alert("Please fill the detail");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "Vendors"), { name: agent });
      setPath("agents");
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl">Add Vendor</h1>
        </div>

        <div>
          <button 
            className="bg-black py-2 px-4 rounded-full text-white"
            onClick={() => { setPath("agents") }}>
            Back
          </button>
        </div>
      </div>

      <div className="mt-20 flex flex-col items-center justify-center gap-6 p-4">
        <div>
          <Avatar sx={{ width: 56, height: 56 }} />
        </div>
        <div>
          <h1 className="font-bold text-xl">Vendor Name</h1>
        </div>
        <div>
          <input
            type="text"
            placeholder="Enter vendor name"
            className="border p-2 rounded-lg py-3 text-center"
            value={agent}
            onChange={(e) => { setAgent(e.target.value) }}
          />
        </div>
        <div>
          <button 
            onClick={addVendor} 
            className="text-lg hover:bg-black bg-green-300 px-4 py-2 w-40 rounded-xl border text-white font-bold">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
