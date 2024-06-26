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

  const [users, setUsers] = useState([]);
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
  }, [searchTerm, users]);

  if (loading) {
    return <Loading />;
  }

  const noResultsMessage = 'No results to display.';

  const receivedFilteredData = (data) => {
   
    setDataFromChild(data);
    const updatedUsers = data.map(item => ({
      id: item.id,
      name: item.mainDetails.guestName
    }));
    setFilteredUsers(updatedUsers);
  };

  
  return (
    <div className="p-4">
      <NewModal show={showModal} onClose={handleClose} filteredData={receivedFilteredData}  setGraphView={setGraphView}/>
      <FilteredDataModal show={showFilteredDataModal} data={dataFromChild} onClose={handleFilteredDataClose}  />
      <div className="flex items-center justify-between border-b mb-4">
        <h1 className="text-xl p-4">Guests</h1>
        <div className="flex items-center space-x-2">
          {graphView && filteredUsers.length > 0 && (
              <h1
                onClick={() => {
                  setShowFilteredDataModal(true);
                }}
                className="font-bolder text-md mr-4 border px-4 py-2 hover:text-green-400 cursor-pointer rounded-xl"
              >
                Show Chart
              </h1>
            )}
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
        </div>
      </div>

      <div className="mt-4">
        <div className="h-96 overflow-y-scroll">
          <div className="space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => (
                <Card key={index} item={item} setPath={setPath} setDocId={setDocId} type="User" setType={setType}  getUsersData={ getUsersData} />
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
