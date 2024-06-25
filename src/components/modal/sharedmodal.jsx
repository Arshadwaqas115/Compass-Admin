"use client"

import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
export const SharedModal = ({type,onClose}) =>{
    const [name,setName] = useState("")

    const submitData = async() =>{
        if(type === "hotel"){
          
            if (name.trim() === "") {
                alert("Please fill the detail");
                return;
              }
          
          
          
              try {
                await addDoc(collection(db, "Vendors"), { name: name });
                toast.success("Vendor added successfully")
                setName("")
              } catch (error) {
             
              }
        }
        else if(type === "transport"){
            if (name.trim() === "") {
                alert("Please fill the detail");
                return;
              }
          
          
          
              try {
                await addDoc(collection(db, "TransportVendors"), { name: name });
                toast.success("Vendor added successfully")
                setName("")
              } catch (error) {
             
              }
        }
    }
    
    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-4 rounded shadow-lg w-1/3">
                <h1 className="text-lg text-right cursor-pointer p-2" onClick={()=>{onClose()}}>x</h1>
                <div className="mt-4 flex flex-col items-center justify-center gap-6 p-4">
                       
                                <div>
                                    <h1 className="font-bold text-xl">Vendor Name</h1>
                                </div>
                                <div>
                                <input
                                    type="text"
                                    placeholder="Enter vendor name"
                                    className="border p-2 rounded-lg py-3 text-center"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value) }}
                                />
                                </div>
                                <div>
                                <button 
                                    onClick={submitData} 
                                    className="text-lg hover:bg-black bg-green-300 px-4 py-2 w-40 rounded-xl border text-white font-bold">
                                    Submit
                                </button>
                        </div>
                      </div>

    
                    
                </div>
    </div>
    )
}