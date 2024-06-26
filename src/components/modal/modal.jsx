import { useEffect, useState } from 'react';
import { db } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';

import { Loading } from '@/components/custom/loading';

const NewModal = ({ show, onClose, filteredData }) => {
  const dummyArray = [
    { title: 'Hotel Vendor', type: 'dropdown' },
    { title: 'Agent Name', type: 'dropdown' },
    { title: 'Transport Vendor', type: 'dropdown' },
    { title: 'File Number', type: 'input' },
    { title: 'Date Range', type: 'date' },
    { title: 'Hotel Name', type: 'input' },
    { title: 'Staff Name', type: 'input' },
    { title: 'Ref No', type: 'input' },
  ];

  const [vendors, setVendors] = useState([]);
  const [agents, setAgents] = useState([]);
  const [transportVendors, setTransportVendors] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [checkedOptions, setCheckedOptions] = useState({});
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  
    getVendors();
    getAgents();
    getTransportVendors();
  }, []);

<<<<<<< HEAD
=======
  const debounce = (func, wait) => {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  };

  const debounceOptionClicked = useCallback(
    debounce((option, data) => {
      filterAccordingToOption(option, data);
    }, 1000), // delay
    []
  );

  const handleInputChange = (option, value) => {
    debounceOptionClicked(option, value);
  };

>>>>>>> d6ecc5513c83e927c4a1dea1c4968239bb08dae8
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

  const getTransportVendors = async () => {
    try {
      const userQuerySnapshot = await getDocs(collection(db, 'TransportVendors'));
      let vendorsTemp = [];
      userQuerySnapshot.forEach((doc) => {
        vendorsTemp.push({ id: doc.id, ...doc.data() });
      });
      setTransportVendors(vendorsTemp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (option, value) => {
    if (option === 'startDate' || option === 'endDate') {
      setSelectedOptions(prev => ({
        ...prev,
        'Date Range': { ...prev['Date Range'], [option]: value }
      }));
    } else {
      setSelectedOptions(prev => ({ ...prev, [option]: value }));
    }
  };

  const handleCheckboxChange = (option) => {
    setCheckedOptions(prev => ({ ...prev, [option]: !prev[option] }));
  };

  const filterAccordingToOption = async (selectedOptions) => {
    try {
      setLoading(true);
      const dataCollection = collection(db, 'Data');
      const querySnapshot = await getDocs(dataCollection);

      setGraphView(false)
      const results = [];

      const isWithinRange = (dateStr, startDate, endDate) => {
        const dateObj = new Date(dateStr);
        return dateObj >= new Date(startDate) && dateObj <= new Date(endDate);
      };

      querySnapshot.forEach((doc) => {
<<<<<<< HEAD
        let match = true;

        for (const option in selectedOptions) {
          if (option === 'Hotel Vendor') {
            const hasVendor = doc.data().accomodation?.some((accomodation) => accomodation.vendor === selectedOptions[option]);
            if (!hasVendor) {
              match = false;
              break;
            }
          } else if (option === 'Agent Name') {
            const hasAgent = doc.data().mainDetails?.agent === selectedOptions[option];
            if (!hasAgent) {
              match = false;
              break;
            }
          } else if (option === 'Transport Vendor') {
            const hasVendor = doc.data().transport?.some((transport) => transport.vendor === selectedOptions[option]);
            if (!hasVendor) {
              match = false;
              break;
            }
          } else if (option === 'File Number') {
            const hasFile = doc.data().mainDetails?.fileNo === selectedOptions[option];
            if (!hasFile) {
              match = false;
              break;
            }
          } else if (option === 'Hotel Name') {
            const hasHotel = doc.data().accomodation?.some((accomodation) => accomodation.hotelname === selectedOptions[option]);
            if (!hasHotel) {
              match = false;
              break;
            }
          } else if (option === 'Staff Name') {
            const hasStaff = doc.data().services?.some((services) => services.staff === selectedOptions[option]);
            if (!hasStaff) {
              match = false;
              break;
            }
          } else if (option === 'Ref No') {
            const hasRef = doc.data().accomodation?.some((accomodation) => accomodation.ref === selectedOptions[option]);
            if (!hasRef) {
              match = false;
              break;
            }
          } else if (option === 'Date Range') {
            const { startDate, endDate } = selectedOptions['Date Range'];
            if (!startDate || !endDate) {
              match = false;
              break;
            }
            const hasDateRange = doc.data().accomodation?.some((accomodation) =>
              isWithinRange(accomodation.checkinn, startDate, endDate) || isWithinRange(accomodation.checkout, startDate, endDate)
            );
            setGraphView(true)
            if (!hasDateRange) {
              match = false;
              break;
            }
=======
        if (option == 'vendor') {
          const hasVendor = doc.data().accomodation?.some((accommodation) => accommodation.vendor == data);
          if (hasVendor) {
            // alert('Vendor found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'agent') {
          const hasAgent = doc.data().mainDetails?.agent == data;
          if (hasAgent) {
            // // alert('Agent found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Transport Vendor') {
          const hasVendor = doc.data().transport?.some((transport) => transport.vendor == data);
          if (hasVendor) {
            // alert('Vendor found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'File Number') {
          const hasFile = doc.data().mainDetails?.fileNo == data;
          if (hasFile) {
            // alert('File found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Hotel Name') {
          const hasHotel = doc.data().accomodation?.some((accommodation) => accommodation.hotelname == data);
          if (hasHotel) {
            // alert('Hotel found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Staff Name') {
          const hasStaff = doc.data().services?.some((services) => services.staff == data);
          if (hasStaff) {
            // alert('Staff found!');
            results.push({ id: doc.id, ...doc.data() });
          }
        } else if (option == 'Ref No') {
          const hasRef = doc.data().accomodation?.some((accommodation) => accommodation.ref == data);
          if (hasRef) {
            // alert('Ref found!');
            results.push({ id: doc.id, ...doc.data() });
>>>>>>> d6ecc5513c83e927c4a1dea1c4968239bb08dae8
          }
        }

        if (match) {
          results.push({ id: doc.id, ...doc.data() });
        }
      });

      setFilteredDocuments(results);
      filteredData(results);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleSubmitClick = async () => {
    const activeFilters = Object.keys(checkedOptions).filter(option => checkedOptions[option]);
    const selectedFilters = activeFilters.reduce((obj, option) => {
      obj[option] = selectedOptions[option];
      return obj;
    }, {});
    console.log('Selected Filters:', selectedFilters); // Debugging log
    await filterAccordingToOption(selectedFilters);
    document.body.style.overflow = 'unset';
    onClose();
  };

  useEffect(() => {}, [filteredDocuments]);

  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [show]);

  if (!show) return null;

<<<<<<< HEAD

  console.log(selectedOptions);
=======
  const handleSubmitClick = () => {
    // alert('Clicked');
    document.body.style.overflow = 'unset';
  };

  const optionClicked = async (option, data) => {
    await filterAccordingToOption(option, data);
  };

  if (loading) {
    return <Loading />;
  }

>>>>>>> d6ecc5513c83e927c4a1dea1c4968239bb08dae8
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Filter Guests</h2>
          <button onClick={onClose} className="text-black">
            &times;
          </button>
        </div>
        <form className="space-y-4">
          {dummyArray.map((item, index) => (
            <div key={index} className="flex items-center space-x-4">
              <input
                type="checkbox"
                className="form-checkbox"
                checked={checkedOptions[item.title] || false}
                onChange={() => handleCheckboxChange(item.title)}
              />
              <label className="flex-grow">{item.title}</label>
              {item.type === 'input' && checkedOptions[item.title] ? (
                <input
                  type="text"
                  className="border p-1 rounded w-1/3"
                  placeholder="Input"
                  onChange={(e) => handleInputChange(item.title, e.target.value)}
                />
              ) : item.type === 'dropdown' && checkedOptions[item.title] ? (
                <select
                  className="border p-1 rounded w-1/3"
                  onChange={(e) => handleInputChange(item.title, e.target.value)}
                >
                  {item.title === 'Transport Vendor' &&
                    transportVendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </option>
                    ))}
                  {item.title === 'Hotel Vendor' &&
                    vendors.map((vendor) => (
                      <option key={vendor.id} value={vendor.name}>
                        {vendor.name}
                      </option>
                    ))}
                  {item.title === 'Agent Name' &&
                    agents.map((agent) => (
                      <option key={agent.id} value={agent.name}>
                        {agent.name}
                      </option>
                    ))}
                </select>
              ) : item.type === 'date' && checkedOptions[item.title] ? (
                <div className="flex space-x-4 justify-end">
                  <input
                    type="date"
                    className="border p-1 rounded w-1/3"
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                  />
                  <input
                    type="date"
                    className="border p-1 rounded w-1/3"
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                  />
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
