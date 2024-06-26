"use client";
import { useContext, useEffect, useState } from "react";
import { EmployeeModal } from "../../../components/modal/employemodal";
import { db } from "@/firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import {EmployeCard} from './employecard'
import { Loading } from "@/components/custom/loading";
import { AppContext } from "@/contexts/userContext";

const Page = () => {
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [data, setData] = useState([]);
  const [loading,setLoading] = useState(false)
  const {user} = useContext(AppContext)   
  
 
  const closeModal = () => {
    setShowEmployeeModal(false);
  };

  const fetchData = async () => {
    try {
      setLoading(true)
      const querySnapshot = await getDocs(collection(db, "employees"));
      const employees = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(employees);
      setLoading(false)
    } catch (error) {
      console.error("Error fetching employees: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if(loading) {
    return(
        <Loading/>
    )
  }
  return (
    <div className="mt-5 p-4">
      <div className="flex justify-between items-center mt-8">
        <h1 className="text-2xl">Employees</h1>
        {user?.role !== "Employee" && user?.role !== "Admin" && (
                                                        <button
                                                        onClick={() => { setShowEmployeeModal(true); }}
                                                        className="px-4 py-2 bg-green-400 rounded-full text-xl text-white cursor-pointer"
                                                      >
                                                        +
                                                      </button>
        )}
       
      </div>
      {showEmployeeModal && <EmployeeModal onClose={closeModal} fetchData={fetchData} />}
            <div className="mt-4 p-2" >
                    {data.map((item,index) => (
                             <div key={index}>
                                  <EmployeCard data={item} fetchData={fetchData}/>
                            </div>
                          
                    ))}
            </div>
    </div>
  );
};

export default Page;
