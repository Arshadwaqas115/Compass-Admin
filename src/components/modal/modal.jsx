import { useCallback, useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

const NewModal = ({ show, onClose, filteredData }) => {
  const dummyArray = [
    { title: 'Hotel Vendor', type: 'dropdown' },
    { title: 'Agent Name', type: 'dropdown' },
    { title: 'Transport Vendor', type: 'input' },
    { title: 'File Number', type: 'input' },
    { title: 'Date Range', type: 'date' },
    { title: 'Hotel Name', type: 'input' },
    { title: 'Staff Name', type: 'input' },
    { title: 'Ref No', type: 'input' },
  ];

  const [vendors, setVendors] = useState([]);
  const [agents, setAgents] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  useEffect(() => {
    getVendors();
    getAgents();
  }, []);

  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const debounceOptionClicked = useCallback(
    debounce((option, data) => {
      awaitfilterAccordingToOption(option, data);
    }, 500), // 500ms delay
    []
  );

  const handleInputChange = (option, value) => {
    debounceOptionClicked(option, value);
    filteredData(filteredDocuments);
  };

  const getVendors = async () => {
    try {
      const userQuerySnapshot = await getDocs(collection(db, 'Vendors'));
      let vendorsTemp = [];
      userQuerySnapshot.forEach((doc) => {
        vendorsTemp.push({ id: doc.id, ...doc.data() });
      });
      setVendors(vendorsTemp);
    } catch (error) {
      console.log(error);
    }
  };

  const getAgents = async () => {
    try {
      const userQuerySnapshot = await getDocs(collection(db, 'Agents'));
      let agentsTemp = [];
      userQuerySnapshot.forEach((doc) => {
        agentsTemp.push({ id: doc.id, ...doc.data() });
      });
      setAgents(agentsTemp);
    } catch (error) {
      console.log(error);
    }
  };

  const filterAccordingToOption = async (option, data) => {
    try {
      const dataCollection = collection(db, 'Data');
      const querySnapshot = await getDocs(dataCollection);
      const results = [];

      querySnapshot.forEach((doc) => {
        if (option == 'vendor') {
          const hasVendor = doc.data().accomodation?.some((accommodation) => accommodation.vendor == data);
          if (hasVendor) {
            alert('Vendor found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'agent') {
          const hasAgent = doc.data().mainDetails?.agent == data;
          if (hasAgent) {
            alert('Agent found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Transport Vendor') {
          const hasVendor = doc.data().transport?.some((transport) => transport.vendor == data);
          if (hasVendor) {
            alert('Vendor found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'File Number') {
          const hasFile = doc.data().mainDetails?.fileNo == data;
          if (hasFile) {
            alert('File found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Hotel Name') {
          const hasHotel = doc.data().accomodation?.some((accommodation) => accommodation.hotelname == data);
          if (hasHotel) {
            alert('Hotel found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Staff Name') {
          const hasStaff = doc.data().services?.some((services) => services.staff == data);
          if (hasStaff) {
            alert('Staff found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Ref No') {
          const hasRef = doc.data().accomodation?.some((accommodation) => accommodation.ref == data);
          if (hasRef) {
            alert('Ref found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        }
      });
      setFilteredDocuments(results);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    console.log('Vendors: ', vendors);
  }, [vendors]);

  useEffect(() => {
    console.log('Agents: ', agents);
  }, [agents]);

  useEffect(() => {
    console.log('Filtered documents: ', filteredDocuments);
  }, [filteredDocuments]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [show]);

  if (!show) return null;

  const handleSubmitClick = () => {
    alert('Clicked');
    document.body.style.overflow = 'unset';
  };

  const optionClicked = async (option, data) => {
    await filterAccordingToOption(option, data);
    filteredData(filteredDocuments);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Filter Users</h2>
          <button onClick={onClose} className="text-black">
            &times;
          </button>
        </div>
        <form className="space-y-4">
          {dummyArray.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input type="checkbox" className="form-checkbox" />
              <label className="flex-grow">{item.title}</label>
              {item.type === 'input' ? (
                <input
                  type="text"
                  className="border p-1 rounded w-1/3"
                  placeholder="Input"
                  onChange={(e) => {
                    handleInputChange(item.title, e.target.value);
                  }}
                />
              ) : item.type === 'dropdown' ? (
                item.title == 'Hotel Vendor' ? (
                  <select
                    className="border p-1 rounded w-1/3"
                    onChange={(e) => optionClicked('vendor', e.target.value)}
                  >
                    {vendors.length > 0 &&
                      vendors.map((item, index) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                ) : item.title == 'Agent Name' ? (
                  <select className="border p-1 rounded w-1/3" onChange={(e) => optionClicked('agent', e.target.value)}>
                    {agents.length > 0 &&
                      agents.map((item, index) => (
                        <option key={item.id} value={item.name}>
                          {item.name}
                        </option>
                      ))}
                  </select>
                ) : null
              ) : item.type === 'date' ? (
                <div className="flex space-x-4 justify-end">
                  <input type="date" className="border p-1 rounded w-1/3" placeholder="Start Date" />
                  <input type="date" className="border p-1 rounded w-1/3" placeholder="End Date" />
                </div>
              ) : null}
            </div>
          ))}
        </form>
        <button
          className="bg-green-300 text-white h-10 rounded-full border flex items-center justify-center mt-4"
          style={{ width: '6.5rem', marginLeft: '25vh' }}
          onClick={handleSubmitClick}
        >
          <h1 className="text-1xl">Submit</h1>
        </button>
      </div>
    </div>
  );
};

export default NewModal;
