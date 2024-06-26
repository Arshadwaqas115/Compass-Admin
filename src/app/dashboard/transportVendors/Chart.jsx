import { useEffect, useState } from "react";
import { Loading } from "@/components/custom/loading";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { Avatar } from "@mui/material";
import { Maindetails } from '../../../components/calendar/maindetails';
import { Accomodation } from '../../../components/calendar/accomodation';
import { Transport } from '../../../components/calendar/transport';
import { Services } from '../../../components/calendar/services';
import { OfficeInvoice } from '../../../components/calendar/officeInvoice';

const Chart = ({ setPath, docId, type }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [step, setStep] = useState(0);


  const getData = async () => {
    setLoading(true);
    try {
      let docRef;
      if (type === "User") {
        docRef = doc(db, "Data", docId);
      } else if (type === "Vendor") {
        docRef = doc(db, "TransportVendor", docId);
      }
      else if (type === "TransportVendor") {
        docRef = doc(db, "TransportVendors", docId);
      }


      const docSnap = await getDoc(docRef);
      let temp = docSnap.data();

      if (type === "Vendor") {
      
        const mainDetails = temp.mainDetails || {};
        const guestname = mainDetails.guestName || "";
        const fileno = mainDetails.fileNo || "";

      }
      else if(type === "TansportVendor"){
        const mainDetails = temp.mainDetails || {};
        const guestname = mainDetails.guestName || "";
        const fileno = mainDetails.fileNo || "";
      }

      setData(temp);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const steps = [
    { name: 'Main details', component: <Maindetails data={data?.mainDetails} /> },
    { name: 'Accomodation', component: <Accomodation data={data?.accommodation} customer={data?.mainDetails} type={type} /> },
    { name: 'Transport', component: <Transport data={data?.transport} customer={data?.mainDetails} type={type} /> },
    { name: 'Services', component: <Services data={data?.services} /> },
    { name: 'Office Invoice', component: <OfficeInvoice data={data?.officeInvoice} /> },
  ];


  const filteredSteps = type === "Vendor" || type ==="TransportVendor" ? steps.filter(step => step.name === 'Transport' ) : steps;

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="pb-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <Avatar />
          </div>
          {type === "TransportVendor"  && ( <div className="text-xl">
            {data?.name}
          </div>)}
          {type === "User" && ( <div className="text-xl">
            {data?.mainDetails?.guestName}
          </div>)}
          
        </div>
        <div>
          <button className="bg-black py-2 px-4 rounded-full text-white " onClick={() => { setPath("agents") }}>Back</button>
        </div>
      </div>

      <div className="flex flex-row justify-center gap-4 mb-8">
        {filteredSteps.map((stepInfo, index) => (
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
        {filteredSteps.map((stepInfo, index) => (
          <div key={index} style={{ display: step === index ? 'block' : 'none' }}>
            {stepInfo.component}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chart;
