"use client";

import React, { useEffect, useState } from 'react';
import { Loading } from "../custom/loading";
import { Maindetails } from './maindetails';
import { Accomodation } from './accomodation';
import { Transport } from './transport';
import { Services } from './services';
import { OfficeInvoice } from './officeInvoice';
import {  addDoc, doc, setDoc, collection, getDocs } from "firebase/firestore";
import {db} from "../../firebase/firebase"
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
export const UserForm = ({setPath}) => {

  
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [agentOptions,setAgentsOptions] = useState([])
  const [vendorOptions,setVendorOptions] = useState([])
  const initialFormData = {
    mainDetails: {
      fileNo: "",
      date: null,
      agent: "",
      agentId: "",
      guestName: "",
      details: "",
      visaCompany: "",
      pa: "",
      ra: "",
      visaRequired: "no",
      visaCount: "",
    },
    accomodation: [],
    transport: [],
    services: [],
    officeInvoice: [],
  };

  const [formData, setFormData] = useState({
    mainDetails: {
      fileNo: "",
      date: null,
      agent:"",
      agentId: "",
      guestName: "",
      details: "",
      visaCompany: "",
      pa: "",
      ra: "",
      visaRequired: "no",
      visaCount: "",
     
    },
    accomodation: [],
    transport: [],
    services: [],
    officeInvoice: [],
  });


  const handleChange = (section, field, value) => {
    if (Array.isArray(formData[section])) {
      setFormData({
        ...formData,
        [section]: [...formData[section], value],
      });
    } else {
      setFormData({
        ...formData,
        [section]: {
          ...formData[section],
          [field]: value,
        },
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      
      const mainDetails = {
        fileNo: formData.mainDetails.fileNo,
        date: formData.mainDetails.date ? dayjs(formData.mainDetails.date).format("MM-DD-YYYY") : "",
        agent: formData.mainDetails.agent,
        guestName: formData.mainDetails.guestName,
        details: formData.mainDetails.details,
        visaCompany: formData.mainDetails.visaCompany,
        pa: formData.mainDetails.pa,
        ra: formData.mainDetails.ra,
        visaRequired: formData.mainDetails.visaRequired,
        visaCount: formData.mainDetails.visaCount,
      };
  
      
      const docRef = await addDoc(collection(db, "Data"), { mainDetails, accomodation: formData.accomodation, transport: formData.transport, services: formData.services, officeInvoice: formData.officeInvoice });
  
      await addDoc(collection(db, "Users"), { id: docRef.id, name: formData.mainDetails.guestName });

      const agentRef = doc(db, "Agents", formData.mainDetails.agentId);
      await setDoc(agentRef, {
        id: formData.mainDetails.agentId,
        accomodation: formData.accomodation,
        transport: formData.transport,
        mainDetails,
      }, { merge: true });
      setFormData(initialFormData);
      toast.success("User Added Successfully")
      console.log("Form data submitted successfully with ID:", docRef.id);
    } catch (error) {
      console.error("Error submitting form data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   
    const fetchData = async () => {
      setLoading(true);
      try {
        const agentSnapshot = await getDocs(collection(db, "Agents"));
        const agentsList = agentSnapshot.docs.map(doc => ({
          id: doc.id,
          value : doc?.data()?.name,
          label :doc?.data()?.name
        }));
        setAgentsOptions(agentsList);

        const vendorSnapshot = await getDocs(collection(db, "Vendors"));
        const vendorslist = vendorSnapshot.docs.map(doc => ({
          id: doc.id,
          value : doc?.data()?.name,
          label :doc?.data()?.name
        }));
        setVendorOptions(vendorslist);
     
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };


      
    fetchData();
  }, []);
  const steps = [
    { name: 'Main details', 
      component: <Maindetails  
      data={formData.mainDetails} 
      handleChange={handleChange} 
      agentOptions={agentOptions} /> 
   },

    { name: 'Accomodation', 
      component: <Accomodation 
      mainDetails={formData.mainDetails}
      vendorOptions={vendorOptions} 
      formData={formData} 
      setFormData={setFormData} 
      data={formData.accomodation} 
      handleChange={handleChange} /> 
    },

    { name: 'Transport', 
      component: 
      <Transport 
      formData={formData} 
      setFormData={setFormData} 
      data={formData.transport} 
      handleChange={handleChange} 
      /> 
    },

    { name: 'Services', 
      component: <Services 
      formData={formData} setFormData={setFormData}
       data={formData.services} handleChange={handleChange}
       /> 
    },


    { name: 'Office Invoice', 
      component: <OfficeInvoice formData={formData} setFormData={setFormData}
       data={formData.officeInvoice} 
       handleChange={handleChange} /> 
    },
  ];

  

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
        <div className='flex flex-row justify-between mb-12'>
              <div>
                 <h1 className='text-xl'>Add User/Guest</h1>
              </div>
              <div>
                    <button className="bg-black py-2 px-4 rounded-full text-white " onClick={() => { setPath("users") }}>Back</button>
              </div>
             
        </div>
        <div className="flex flex-row justify-center gap-4 mb-8">
          {steps.map((stepInfo, index) => (
            <div key={index}>
              <h1
                className={`border p-2 rounded-xl text-lg cursor-pointer ${
                  step === index ? 'bg-blue-400 text-white' : 'bg-black text-white hover:bg-blue-400'
                }`}
                onClick={() => setStep(index)}
              >
                {stepInfo.name}
              </h1>
            </div>
          ))}
        </div>
        <div>
          {steps[step].component}
        </div>
        <div className="flex justify-end mt-12">
          {step === steps.length - 1 && (
            <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-lg w-40">
              Submit
            </button>
          )}
        </div>
      </div>
    );
  }
};
