import { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

import { Loading } from '@/components/custom/loading';

import { Card } from '../../../components/custom/usercard';
import NewModal from '../../../components/modal/modal';
import FilteredDataModal from  './FilteredDataModal'
export const Customers = ({ setPath, setDocId, setType }) => {
  const [showModal, setShowModal] = useState(false);
  const [dataFromChild, setDataFromChild] = useState('');
  const [graphView,setGraphView] = useState(false);
  const [showFilteredDataModal, setShowFilteredDataModal] = useState(false);

  const handleFilteredDataClose = () => {
    setShowFilteredDataModal(false);
  };
  const handleSearchClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleResetClick = () => {
    console.log('Original Users', originalUsers);
    setFilteredUsers(originalUsers);
  };

  const [users, setUsers] = useState([]);
  const [originalUsers, setOriginalUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
 
  const getUsersData = async () => {
    setLoading(true);
    try {
      const userQuerySnapshot = await getDocs(collection(db, 'Users'));
      let usersTemp = [];

      userQuerySnapshot.forEach((doc) => {
        console.log('Doc: ', doc);
        usersTemp.push({ id: doc.id, ...doc.data() });
      });

      setUsers(usersTemp);
      setFilteredUsers(usersTemp);
      setOriginalUsers(usersTemp);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsersData();
  }, []);

  useEffect(() => {
   
    const userResults = users.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredUsers(userResults);
    // setOriginalUsers(userResults);
  }, [searchTerm, users]);

  if (loading) {
    return <Loading />;
  }

  const noResultsMessage = 'No results to display.';

  const receivedFilteredData = (data) => {
   
    setDataFromChild(data);
    const updatedUsers = data.map((item) => ({
      id: item.id,
      name: item.mainDetails.guestName,
    }));
    setFilteredUsers(updatedUsers);
    setShowModal(false);
  };

  
  return (
    <div className="p-4">
      <NewModal show={showModal} onClose={handleClose} filteredData={receivedFilteredData}  setGraphView={setGraphView}/>
      <FilteredDataModal show={showFilteredDataModal} data={dataFromChild} onClose={handleFilteredDataClose}  />
      <div className="flex items-center justify-between border-b mb-4">
        <h1 className="text-xl p-4">Guests</h1>
        <div className="flex items-center space-x-2">
          {graphView && <h1 onClick={()=>{setShowFilteredDataModal(true)}}className='font-bolder text-md mr-4 border px-4 py-2 hover:text-green-400  cursor-pointer rounded-xl'>Show Chart</h1>}
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            onClick={handleSearchClick}
          >
            <title>Filter</title>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Filter">
                <rect id="Rectangle" fill-rule="nonzero" x="0" y="0" width="24" height="24"></rect>
                <line
                  x1="4"
                  y1="5"
                  x2="16"
                  y2="5"
                  id="Path"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                ></line>
                <line
                  x1="4"
                  y1="12"
                  x2="10"
                  y2="12"
                  id="Path"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                ></line>
                <line
                  x1="14"
                  y1="12"
                  x2="20"
                  y2="12"
                  id="Path"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                ></line>
                <line
                  x1="8"
                  y1="19"
                  x2="20"
                  y2="19"
                  id="Path"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                ></line>
                <circle
                  id="Oval"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                  cx="18"
                  cy="5"
                  r="2"
                ></circle>
                <circle
                  id="Oval"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                  cx="12"
                  cy="12"
                  r="2"
                ></circle>
                <circle
                  id="Oval"
                  stroke="#0C0310"
                  stroke-width="2"
                  stroke-linecap="round"
                  cx="6"
                  cy="19"
                  r="2"
                ></circle>
              </g>
            </g>
          </svg>
          <input
            type="text"
            placeholder="Search by guest name"
            className="p-2 placeholder:text-center border border-gray-300 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <button
            onClick={() => {
              setPath('add');
            }}
            className="w-10 bg-green-300 text-white h-10 rounded-full border flex items-center justify-center"
          >
            <h1 className="text-2xl">+</h1>
          </button>
          <svg
            width="35px"
            height="35px"
            viewBox="0 0 512 512"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            onClick={handleResetClick}
          >
            <title>clear-filter</title>
            <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Combined-Shape" fill="#000000" transform="translate(42.666667, 85.333333)">
                <path d="M320,170.666667 C348.289759,170.666667 375.420843,181.90473 395.424723,201.90861 C415.428604,221.91249 426.666667,249.043574 426.666667,277.333333 C426.666667,336.243707 378.910373,384 320,384 C261.089627,384 213.333333,336.243707 213.333333,277.333333 C213.333333,218.42296 261.089627,170.666667 320,170.666667 Z M320,192 C272.871701,192 234.666667,230.205035 234.666667,277.333333 C234.666667,324.461632 272.871701,362.666667 320,362.666667 C367.128299,362.666667 405.333333,324.461632 405.333333,277.333333 C405.333333,230.205035 367.128299,192 320,192 Z M356.543147,225.705237 L371.628096,240.790187 L335.083904,277.333237 L371.628096,313.87648 L356.543147,328.961429 L319.999904,292.417237 L283.456853,328.961429 L268.371904,313.87648 L304.914904,277.333237 L268.371904,240.790187 L283.456853,225.705237 L319.999904,262.248237 L356.543147,225.705237 Z M341.333333,1.42108547e-14 L192,181.999 L192,304 L149.333333,304 L149.333,182 L3.55271368e-14,1.42108547e-14 L341.333333,1.42108547e-14 Z M251.114667,42.6666667 L90.1973333,42.6666667 L170.666667,140.714667 L251.114667,42.6666667 Z"></path>
              </g>
            </g>
          </svg>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-96 overflow-y-scroll">
          <div className="space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => (
                <Card key={index} item={item} setPath={setPath} setDocId={setDocId} type="User" setType={setType} />
              ))
            ) : (
              <p className="">{noResultsMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
