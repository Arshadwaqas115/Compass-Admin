"use client"

import { AppContext } from "@/contexts/userContext";
import { db } from "@/firebase/firebase"
import { doc, deleteDoc } from "firebase/firestore";
import { useContext } from "react";

export const EmployeCard = ({data,fetchData}) =>{


  const {user} = useContext(AppContext)
 console.log(user)
     
    const deleteEmployee = async() =>{

        try {   
        
                await deleteDoc(doc(db, "employees", data.id));
                fetchData()
        } catch (error) {
                console.log(error)
        }
    }

    return(

        <div className=" pb-4 hover:border-b cursor-pointer border-gray-400 text-lg mb-4">
            
                {data.role !== "Super" && (
                    <div className="flex items-center justify-between">
                                  <div className="text-xl">
                                    <h1>{data.name}</h1>
                                    </div>
                                    <div className="flex gap-4">
                                            <div className="px-4 py-2 border cursor-pointer  rounded-full ">
                                                    <h1 >{data.role}</h1>
                                            </div>
                                            {user?.role !== "Employee" && user?.role !== "Admin" && (
                                                        <div onClick={deleteEmployee} className="px-4 py-2 border cursor-pointer  rounded-full hover:border-red-400">
                                                                 <button >Delete</button>
                                                        </div> 
                                            )}
                                            

                                    </div>
                    </div>
               

                )}
               

          
         
        </div>
    )

}
