"use client";

import React, { useEffect, useState } from 'react';
import { Loading } from "../custom/loading";
import { Maindetails } from './maindetails';
import { Accomodation } from './accomodation';
import { Transport } from './transport';
import { Services } from './services';
import { OfficeInvoice } from './officeInvoice';
import {  addDoc, doc, setDoc, collection, getDocs, getDoc } from "firebase/firestore";
import {db} from "../../firebase/firebase"
import dayjs from 'dayjs';
import { toast } from 'react-toastify';
export const UserForm = ({setPath,data}) => {

  console.log(data)
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [agentOptions,setAgentsOptions] = useState([])
  const [vendorOptions,setVendorOptions] = useState([])
  const [transportVendorOptions,setTransportVendorOptions] = useState([])
  const [formErrors, setFormErrors] = useState({});



  const initialFormData = {
    mainDetails: {
      fileNo: data?.mainDetails?.fileNo,
      date: null,
      agent: "",
      agentId: "",
      guestName: "",
      details: "",
      visaCompany: "",
      pa: 0,
      ra: 0,
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
      fileNo: data?.mainDetails?.fileno,
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
    setFormErrors(prevErrors => ({
      ...prevErrors,
      [section]: {
        ...prevErrors[section],
        [field]: null,
      }
    }));
  
    if ((field === 'pa' || field === 'ra') && value !== '' && !/^\d+$/.test(value)) {
      setFormErrors(prevErrors => ({
        ...prevErrors,
        [section]: {
          ...prevErrors[section],
          [field]: 'Must be an integer',
        }
      }));
      return;
    }
  
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

  

  const validateMainDetails = () => {
    const errors = {};
    const requiredFields = ["fileNo", "date", "agentId", "guestName", "visaCompany"];

    requiredFields.forEach(field => {
      if (!formData.mainDetails[field]) {
        errors[field] = `${field} is required`;
      }
    });

    setFormErrors(prevErrors => ({
      ...prevErrors,
      mainDetails: errors
    }));

    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateMainDetails()) {
      toast.error("Please fill out all required fields in Main Details.");
      return;
    }
    
    try {
      setLoading(true);
  
      const agentName = agentOptions.find((item) => item.id === formData.mainDetails.agentId);
  
      const mainDetails = {
        fileNo: formData.mainDetails.fileNo,
        date: formData.mainDetails.date ? dayjs(formData.mainDetails.date).format("MM-DD-YYYY") : "",
        agent: agentName.value,
        guestName: formData.mainDetails.guestName,
        details: formData.mainDetails.details,
        visaCompany: formData.mainDetails.visaCompany,
        pa: formData.mainDetails.pa,
        ra: formData.mainDetails.ra,
        visaRequired: formData.mainDetails.visaRequired,
        visaCount: formData.mainDetails.visaCount,
      };
  
      let docRef;
      if (data?.docId) {
        docRef = doc(db, "Data", data.docId);
        
        await setDoc(docRef, { mainDetails, accomodation: formData.accomodation, transport: formData.transport, services: formData.services, officeInvoice: formData.officeInvoice }, { merge: true });
       
        
     
        const userSnapshot = await getDocs(collection(db, "Users"));
        const userDoc = userSnapshot.docs.find(doc => doc.data().id === data.docId);
       
        const userRef = doc(db, "Users", userDoc.id);
        await setDoc(userRef, { id: data.docId, name: formData.mainDetails.guestName, fileNo: formData.mainDetails.fileNo }, { merge: true });;
      
  
        // Update agent document
        const agentRef = doc(db, "Agents", formData.mainDetails.agentId);
        const agentDoc = await getDoc(agentRef);
        const agentData = agentDoc.data() || {};
        const updatedAgentAccommodation = (agentData.accomodation || []).filter(acc => acc.fileno !== formData.mainDetails.fileNo).concat(formData.accomodation);
        const updatedAgentTransport = (agentData.transport || []).filter(trans => trans.fileno !== formData.mainDetails.fileNo).concat(formData.transport);
        const updatedAgentData = {
          ...agentData,
          accomodation: updatedAgentAccommodation,
          transport: updatedAgentTransport,
          mainDetails,
        };
        console.log("updated",updatedAgentData)
        await setDoc(agentRef, updatedAgentData, { merge: true });
  
      // Update accommodation vendors
      const accommodationVendors = formData.accomodation.map(acc => {
        const vendor = vendorOptions.find(v => v.label === acc.vendor);
        return vendor ? vendor.id : null;
      }).filter(Boolean);
      const uniqueAccommodationVendors = [...new Set(accommodationVendors)];
      for (const vendorId of uniqueAccommodationVendors) {
        const vendorRef = doc(db, "Vendors", vendorId);
        const vendorDoc = await getDoc(vendorRef);
        const vendorData = vendorDoc.data() || {};
        const updatedAccommodation = (vendorData.accommodation || []).filter(acc => acc.fileno !== formData.mainDetails.fileNo).concat(formData.accomodation.filter(acc => acc.vendor === vendorOptions.find(v => v.id === vendorId).label));
        await setDoc(vendorRef, { accommodation: updatedAccommodation }, { merge: true });
      }
  
      // Update transport vendors
      const transportVendors = formData.transport.map(trans => {
        const vendor = transportVendorOptions.find(v => v.label === trans.vendor);
        return vendor ? vendor.id : null;
      }).filter(Boolean);
      const uniqueTransportVendors = [...new Set(transportVendors)];
      for (const vendorId of uniqueTransportVendors) {
        const vendorRef = doc(db, "TransportVendors", vendorId);
        const vendorDoc = await getDoc(vendorRef);
        const vendorData = vendorDoc.data() || {};
        const updatedTransport = (vendorData.transport || []).filter(trans => trans.fileno !== formData.mainDetails.fileNo).concat(formData.transport.filter(trans => trans.vendor === transportVendorOptions.find(v => v.id === vendorId).label));
        await setDoc(vendorRef, { transport: updatedTransport }, { merge: true });
      }
  
        setFormData(initialFormData);
        toast.success("User Data Successfully Saved");
        setPath("users");
        console.log("Form data submitted successfully with ID:", data?.docId || docRef.id);
      
    }
      }
        catch (error) {
          console.error("Error submitting form data:", error);
          toast.error("Error submitting form data");
        } finally {
          setLoading(false);
        }
  };
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
   
      const transportVendors = await getDocs(collection(db, "TransportVendors"));
      const transportVendorslist = transportVendors.docs.map(doc => ({
            id: doc.id,
            value : doc?.data()?.name,
            label :doc?.data()?.name
      }));
      setTransportVendorOptions(transportVendorslist);
    } catch (error) {
      console.error("Error fetching agents:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    setFormData(prevData => ({
      ...prevData,
      mainDetails: {
             ...prevData.mainDetails,
               date: data?.mainDetails?.date ? dayjs(data?.mainDetails?.date) : null,
               fileNo: data?.mainDetails?.fileNo,
               agent: data?.mainDetails?.agent,
               agentId: data?.mainDetails?.agentId,
               guestName: data?.mainDetails?.guestName,
               details: data?.mainDetails?.details,
               visaCompany: data?.mainDetails?.visaCompany,
               pa: data?.mainDetails?.pa,
               ra: data?.mainDetails?.ra,
               visaRequired: data?.mainDetails?.visaRequired,
               visaCount: data?.mainDetails?.visaCount,
      },
      accomodation: data?.accomodation,
      transport: data?.transport,
      services: data?.services,
      officeInvoice: data?.officeInvoice
    }));

     
     
  }, []);


  const steps = [
    { name: 'Main details', 
      component: <Maindetails  
      data={formData.mainDetails} 
      handleChange={handleChange} 
      agentOptions={agentOptions}
      fetchData={fetchData}
      errors={formErrors.mainDetails || {}} /> 
   },

    { name: 'Accomodation', 
      component: <Accomodation 
      mainDetails={formData.mainDetails}
      vendorOptions={vendorOptions} 
      formData={formData} 
      setFormData={setFormData} 
      data={formData.accomodation} 
      handleChange={handleChange}
      fetchData={fetchData}
      /> 
    },

    { name: 'Transport', 
      component: 
      <Transport 
      formData={formData} 
      mainDetails={formData.mainDetails}
      transportVendorOptions={transportVendorOptions}
      setFormData={setFormData} 
      data={formData.transport} 
      handleChange={handleChange} 
      fetchData={fetchData}
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
            <button onClick={handleSubmit} className="bg-green-500 text-white p-2 rounded-lg w-40">
              Save
            </button>
          )}
        </div>
      </div>
    );
  }
};
