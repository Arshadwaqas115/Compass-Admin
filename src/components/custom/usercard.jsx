import { Avatar } from '@mui/material';

export const Card = ({ item, setPath, setDocId, type, setType }) => {

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
    else if(type === "Vendor"){
      setDocId(item?.id);
      setPath('chart');
      setType(type);
    }
  };
  

  return (
    <div 
      className={`flex flex-row hover:border-b p-4 items-center justify-between text-xl cursor-pointer mb-4 ${type === 'User' || type === 'Agent' ? 'cursor-pointer' : ''}`} 
      onClick={handleClick}
    >
      <div className='flex items-center gap-4'>
        <div>
          <Avatar />
        </div>
        <div>
          {item?.name}
        </div>
      </div>
      <div>
        <button className='py-2 px-4 border border-black text-sm font-semibold hover:border-red-700 rounded-full'>
          View
        </button>
      </div>
    </div>
  );
};

export default Card;
