import { AppContext } from '@/contexts/userContext';
import { db } from '@/firebase/firebase';
import { Avatar } from '@mui/material';
import { doc, deleteDoc ,collection, query, where, getDocs,setDoc} from "firebase/firestore";
import { useContext } from 'react';
import { toast } from 'react-toastify';

export const Card = ({ item, setPath, setDocId, type, setType,getUsersData }) => {
 

  const {user} = useContext(AppContext)

  const handleClick = () => {
    
    if (type === 'User') { 
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
    else if(type === "Agent"){
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
    else if(type === "TransportVendor"){
      console.log("clicked")
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
    else if(type === "Vendor"){
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
    // else if(type === "Hotel"){
    //   setDocId(item?.id);
    //   setPath('chart');
    //   setType(type);
    // }
    // else if(type === "Transport"){
    //   setDocId(item?.id);
    //   setPath('chart');
    //   setType(type);
    // }
  };
  

  const handleEdit = () => {
    setDocId(item?.id);
    setPath('edit');
  }
  const handleDelete = async() =>{
    
        if(type === "Agent"){
          await deleteDoc(doc(db,"Agents",item.id))
          toast.success("Agent Deleted Successfully")
          getUsersData()
        }
        else if(type === "Hotel"){
          await deleteDoc(doc(db,"Hotels",item.id))
          toast.success("Hotel Deleted Successfully")
          getUsersData()
        }
        else if(type === "Transport"){
          await deleteDoc(doc(db,"Transport",item.id))
          toast.success("Vehicle Deleted Successfully")
          getUsersData()
        }
        else if(type === "TransportVendor"){
          await deleteDoc(doc(db,"TransportVendors",item.id))
          toast.success("Vendor Deleted Successfully")
          getUsersData()
        }
        else if(type === "Vendor"){
          await deleteDoc(doc(db,"Vendors",item.id))
          toast.success("Vendor Deleted Successfully")
          getUsersData()
        }
        else if(type === "User"){
         
          await deleteDoc(doc(db,"Data",item.id))
          const usersRef = collection(db, "Users");

          const q = query(usersRef, where("id", "==", item.id));
          const querySnapshot = await getDocs(q);
      
    
          if (!querySnapshot.empty) {
            querySnapshot.forEach(async (docSnapshot) => {
              await deleteDoc(doc(db, "Users", docSnapshot.id));
            });
            toast.success("User Deleted Successfully");
          } else {
            toast.error("User not found");
          }

          const vendorsRef = collection(db, "Vendors");
          const vendorsSnapshot = await getDocs(vendorsRef);



          if (!vendorsSnapshot.empty) {
            vendorsSnapshot.forEach(async (vendorDoc) => {
              const newVendorDocs = vendorDoc.data().accomodation.filter(doc => doc.fileno !== item.fileNo);
              await setDoc(vendorDoc.ref, {accomodation: newVendorDocs}, {merge: true});
            });
          }

          const transportVendorsRef = collection(db, "TransportVendors");
          const transportVendorsSnapshot = await getDocs(transportVendorsRef);

          if (!transportVendorsSnapshot.empty) {
            transportVendorsSnapshot.forEach(async (transportVendorDoc) => {
              const newTransportVendorDocs = transportVendorDoc.data().transport.filter(doc => doc.fileno !== item.fileNo);
              await setDoc(transportVendorDoc.ref, {transport: newTransportVendorDocs}, {merge: true});
            });
          }
          
          const agentsRef = collection(db, "Agents");
          const agentsSnapshot = await getDocs(agentsRef);

          if (!agentsSnapshot.empty) {
            agentsSnapshot.forEach(async (agentDoc) => {
              const newAccomodationDocs = agentDoc.data().accomodation.filter(doc => doc.fileno !== item.fileNo);
              const newTransportDocs = agentDoc.data().transport.filter(doc => doc.fileno !== item.fileNo);

              await setDoc(agentDoc.ref, { accomodation: newAccomodationDocs, transport: newTransportDocs }, { merge: true });
            });
          }

          getUsersData()
        
        }
        
        
  }

  return (
    <div 
      className={`flex flex-row hover:border-b p-4 items-center justify-between text-xl cursor-pointer mb-4 ${type === 'User' || type === 'Agent' ? 'cursor-pointer' : ''}`} 
     
    >
      <div className='flex items-center gap-4'>
        {/* <div>
          <Avatar />
        </div> */}
        {type === "User" && (
        <div className='flex flex-row gap-8'>
           <div className='border-r-2 pr-2 w-24 truncate'>
                 {item?.fileNo ===  undefined ? "xxxxxxx" : item?.fileNo}
               
           </div>
           <div>
                 {item?.name}
           </div>
        
        </div>

        )}
        {type !== "User" && (
        <div className='flex flex-row gap-4'>
           <div>
                 {item?.name}
           </div>
           
        
        </div>

        )}
      </div>
      <div className='gap-4 flex'>
        
        {
          (type !== 'Hotel' && type !== 'Transport') &&
          <button  onClick={handleClick} className='py-2 px-4 border border-black text-sm font-semibold hover:border-red-700 rounded-full'>
          View
         </button>

        }
        
        {user?.role !== "Employee" && type === "User" && (
          <button  onClick={handleEdit} className='py-2 px-4 border border-black text-sm font-semibold hover:border-red-700 rounded-full'>
            Edit
          </button>
        )} 
        {user?.role !== "Employee" && (
          <button  onClick={handleDelete} className='py-2 px-4 border border-black text-sm font-semibold hover:border-red-700 rounded-full'>
            Delete
          </button>
        )}
       
      </div>
    </div>
  );
};

export default Card;
