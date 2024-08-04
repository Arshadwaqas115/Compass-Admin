import { useContext, useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

import { Loading } from '@/components/custom/loading';

import { Card } from '../../../components/custom/usercard';
import NewModal from '../../../components/modal/modal';
import FilteredDataModal from './FilteredDataModal';
import { AppContext } from '@/contexts/userContext';

export const Customers = ({ setPath, setDocId, setType }) => {
  const [showModal, setShowModal] = useState(false);
  const [dataFromChild, setDataFromChild] = useState('');
  const [graphView, setGraphView] = useState(false);
  const [showFilteredDataModal, setShowFilteredDataModal] = useState(false);
  const { user } = useContext(AppContext);
  const [data, setData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [useDateRange, setUseDateRange] = useState(false);
  const [fileNo,setFileNo] = useState("")
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const handleFilteredDataClose = () => {
    setShowFilteredDataModal(false);
  };
  const handleSearchClick = () => {
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const isWithinRange = (dateStr, startDate, endDate) => {
    const dateObj = new Date(dateStr);
    return dateObj >= new Date(startDate) && dateObj <= new Date(endDate);
  };

  const filterDataByDateRange = () => {
    if (startDate && endDate) {
      const filteredData = data?.filter((item) =>
        item.accomodation?.some(
          (accomodation) =>
            isWithinRange(accomodation.checkinn, startDate, endDate) ||
            isWithinRange(accomodation.checkout, startDate, endDate)
        )
      );
      setGraphView(true);
      receivedFilteredData(filteredData);
      setStartDate('');
      setEndDate('');
    }
  };

  useEffect(() => {
    if (useDateRange) {
      filterDataByDateRange();
    } else {
      receivedFilteredData(data);
      setGraphView(false)
    }
  }, [startDate, endDate, data, useDateRange]);

 

  const getUsersData = async () => {
    setLoading(true);
    try {
     
      const dataQuerySnapshot = await getDocs(collection(db, 'Data'));
      let datatemp = [];

      dataQuerySnapshot.forEach((doc) => {
        datatemp.push({ id: doc.id, ...doc.data() });
      });

      const userQuerySnapshot = await getDocs(collection(db, 'Users'));
    let usersTemp = [];

    // Iterate over the documents
    userQuerySnapshot.forEach((doc) => {
      const data = doc.data();
      let fileNoAsNumber = Number(data.fileNo);

      // Safety check: if the conversion to number fails, set fileNoAsNumber to Infinity
      if (isNaN(fileNoAsNumber)) {
        fileNoAsNumber = Infinity;
      }

      usersTemp.push({ id: doc.id, fileNo: fileNoAsNumber, ...data });
    });

    // Sort the users array by the numeric fileNo
    usersTemp.sort((a, b) => a.fileNo - b.fileNo);

      setData(datatemp);
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

  console.log(users)
  useEffect(() => {
    const userResults = users?.filter((user) => {
      const nameMatch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
      const fileNoMatch = user?.fileNo?.toLowerCase().includes(searchTerm.toLowerCase());
      return nameMatch || fileNoMatch;
    });
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
      name: item.mainDetails.guestName,
      fileNo :item.mainDetails.fileNo
    }));
   
    setFilteredUsers(updatedUsers);
  };
 


  return (
    <div className="p-4">
      <NewModal show={showModal} onClose={handleClose} filteredData={receivedFilteredData} setGraphView={setGraphView} />
      {showFilteredDataModal && (
        <FilteredDataModal show={showFilteredDataModal} data={dataFromChild} onClose={handleFilteredDataClose} />
      )}
      <div className="flex items-center justify-between ">
        <h1 className="text-xl p-4">Guests</h1>
        <div className="flex items-center space-x-2">
          {/* {graphView && filteredUsers.length > 0 && (
            <h1
              onClick={() => {
                setShowFilteredDataModal(true);
              }}
              className="font-bolder text-md mr-4 border px-4 py-2 hover:text-green-400 cursor-pointer rounded-xl"
            >
              Show Chart
            </h1>
          )} */}
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
            placeholder="Search File-No / Name"
            className="p-2 placeholder:text-center border border-gray-300 rounded "
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
         
        
          {user?.role !== 'Employee' && (
            <button
              onClick={() => {
                setPath('add');
              }}
              className="w-10 bg-green-300 text-white h-10 rounded-full border flex items-center justify-center"
            >
              <h1 className="text-2xl">+</h1>
            </button>
          )}
        </div>
      </div>
      <div className="flex space-x-4 justify-end border-b pb-4 mt-4">
        {/* <div className="flex items-center">
          <input
            type="checkbox"
            id="useDateRange"
            checked={useDateRange}
            onChange={() => setUseDateRange(!useDateRange)}
          />
          <label htmlFor="useDateRange" className="ml-2">
            Use Date Range
          </label>
        </div> */}
        {/* <div className='flex items-center gap-2'>
          <h1>start date:</h1>
          <input
            value={startDate}
            type="date"
            className="border p-1 rounded"
            onChange={(e) => setStartDate(e.target.value)}
            disabled={!useDateRange}
          />
        </div>
        <div className='flex items-center gap-2'>
        <h1>end date:</h1>
          <input
            value={endDate}
            type="date"
            className="border p-1 rounded"
            onChange={(e) => setEndDate(e.target.value)}
            disabled={!useDateRange}
          />
        </div> */}
      </div>

      <div className="mt-4">
        <div className="h-[80vh] overflow-y-scroll">
          <div className="space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((item, index) => (
                <Card key={index} item={item} setPath={setPath} setDocId={setDocId} type="User" setType={setType} getUsersData={getUsersData} />
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
