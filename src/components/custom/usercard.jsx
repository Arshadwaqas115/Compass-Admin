import { db } from '@/firebase/firebase';
import { Avatar } from '@mui/material';
import { doc, deleteDoc ,collection, query, where, getDocs} from "firebase/firestore";
import { toast } from 'react-toastify';

export const Card = ({ item, setPath, setDocId, type, setType,getUsersData }) => {


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
      
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
    else if(type === "Vendor"){
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
  };
  
  const handleDelete = async() =>{
    
        if(type === "Agent"){
          await deleteDoc(doc(db,"Agents",item.id))
          toast.success("Agent Deleted Successfully")
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
          getUsersData()
        
        }
        
        
  }

  return (
    <div 
      className={`flex flex-row hover:border-b p-4 items-center justify-between text-xl cursor-pointer mb-4 ${type === 'User' || type === 'Agent' ? 'cursor-pointer' : ''}`} 
     
    >
      <div className='flex items-center gap-4'>
        <div>
          <Avatar />
        </div>
        <div>
          {item?.name}
        </div>
      </div>
      <div className='gap-4 flex'>
        <button  onClick={handleClick} className='py-2 px-4 border border-black text-sm font-semibold hover:border-red-700 rounded-full'>
          View
        </button>
        <button  onClick={handleDelete} className='py-2 px-4 border border-black text-sm font-semibold hover:border-red-700 rounded-full'>
          Delete
        </button>
      </div>
    </div>
  );
};

export default Card;
