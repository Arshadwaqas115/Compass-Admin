import React, { useState } from 'react';
import { sectorOptions, vehicleOptions } from '@/extra/data';
import Select from 'react-select';
import { SharedModal } from "../../components/modal/sharedmodal"; 
import CreatableSelect from 'react-select/creatable';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

export const Transport = ({ formData, data, setFormData, handleChange, transportVendorOptions, mainDetails, fetchData, transportNameOptions }) => {
  const [showVendorModal, setShowVendorModal] = useState(false);

  const headers = [
    'File No',
    'Guest Name',
    'Vehicle',
    'Ref',
    'Date',
    'Sector',
    'Vendor',
    'Flight Details',
    'R/A',
    'P/A',
    'Remarks',
    'Pick Point',
    'Drop Point',
    'Status'
  ];

  const [rowData, setRowData] = useState({
    fileno: mainDetails.fileNo,
    guestname: mainDetails.guestName,
    vehicle: '',
    ref: '',
    date: dayjs().format('DD-MM-YY'),
    sector: '',
    vendor: '',
    flightdetails: '',
    ra: '',
    pa: '',
    remarks: '',
    pickpoint: '',
    droppoint: '',
    status: 'booked'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showTransportModal, setShowTransportModal] = useState(false);
  const [vehicleValue,setVehicleValue] = useState(null);
  const [sectorValue,setSectorValue] = useState(null);
  const [vendorValue,setVendorValue] = useState(null);
  const handleInputChange = (value, field) => {
    if (field === 'r/a') {
      if (!isNaN(value) && parseFloat(value) >= 0) {
        setRowData({ ...rowData, ra: parseFloat(value) });
      } else {
        alert(`Must be a number ${field.toUpperCase()}`);
      }
    } else if (field === 'p/a') {
      if (!isNaN(value) && parseFloat(value) >= 0) {
        setRowData({ ...rowData, pa: parseFloat(value) });
      } else {
        alert(`Must be a number ${field.toUpperCase()}`);
      }
    } else {
      setRowData({ ...rowData, [field]: value });
    }
  };

  const handleAddRow = () => {
    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = rowData;
      setFormData({ ...formData, transport: updatedData });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      handleChange('transport', null, rowData);
    }

    setRowData({
      fileno: mainDetails.fileNo,
      guestname: mainDetails.guestName,
      vehicle: '',
      ref: '',
      date: dayjs().format('DD-MM-YY'),
      sector: '',
      vendor: '',
      flightdetails: '',
      ra: '',
      pa: '',
      remarks: '',
      pickpoint: '',
      droppoint: '',
      status: 'booked'
    });
    setSectorValue(null)
    setVehicleValue(null)
    setVendorValue(null)
  };

  const handleEditRow = (index) => {
    const transformedData = { ...data[index] };
    if (transformedData['R/A']) {
      transformedData.ra = transformedData['R/A'];
      delete transformedData['R/A'];
    }
    if (transformedData['P/A']) {
      transformedData.pa = transformedData['P/A'];
      delete transformedData['P/A'];
    }
    setSectorValue(data[index].sector ? {value: data[index].sector, label: data[index].sector} : null);
    setVehicleValue(data[index].vehicle ? {value: data[index].vehicle, label: data[index].vehicle} : null);
    setVendorValue(data[index].vendor ? {value: data[index].vendor, label: data[index].vendor} : null);
    setRowData(transformedData);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedTransport = data.filter((item, i) => i !== index);
    setFormData({ ...formData, transport: updatedTransport });
    setSectorValue(null)
    setVehicleValue(null)
    setVendorValue(null)
  };

  const openVendorModal = () => {
    setShowVendorModal(true);
  };

  const closeVendorModal = () => {
    setShowVendorModal(false);
  };

  const openTransportModal = () => {
    setShowTransportModal(true);
  };

  const closeTransportModal = () => {
    setShowTransportModal(false);
  };

  const handleBookingStatus = (index) => {
    const updatedData = [...data];
    updatedData[index].status = updatedData[index].status === 'booked' ? 'Cancelled' : 'booked';
    setFormData({ ...formData, transport: updatedData });
  };

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Step 3: Transport</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {headers.filter((header) => header !== 'File No' && header !== 'Guest Name' && header !== 'Status')
          .map((header, index) => {
            const field = header.toLowerCase().replace(/ /g, '');
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="font-semibold">{header}</label>
                {header === 'Vendor' ? (
                  <div className="flex items-center">
                    <div className='flex-grow'>
                     
                        <Select
                          placeholder={header}
                          className="p-2 rounded-lg"
                          value={vendorValue}
                          
                          onChange={(selectedOption) =>{
                            setVendorValue(selectedOption);
                            handleInputChange(selectedOption.value, field)
                          }}
                          options={transportVendorOptions}
                        />
                    </div>
                    <button
                      onClick={openVendorModal}
                      className="ml-2 bg-green-500 text-white p-2 rounded-full"
                    >
                      +
                    </button>
                  </div>
                ) : header === 'Vehicle' ? (
                  <div className="flex items-center">
                                  <Select
                                    placeholder={header}
                                    className="p-2 rounded-lg flex-1"
                                    value={vehicleValue}
                                    onChange={(selectedOption) => {
                                      handleInputChange(selectedOption.value, field);
                                      setVehicleValue(selectedOption);
                                    }}
                                    options={transportNameOptions}
                                  />
                              
                                    <button
                                      onClick={openTransportModal}
                                      className="ml-2 bg-green-500 text-white p-2 rounded-full"
                                    >
                                      +
                                    </button>
                          
                                </div>
                  
                ) : header === 'Sector' ? (
                  <CreatableSelect
                  placeholder={header}
                  className="p-2 rounded-lg"
                  value={sectorValue}
                  onChange={(selectedOption) => {
                    handleInputChange(selectedOption.value, field)
                    setSectorValue(selectedOption);
                  }}
                  options={sectorOptions}
                />
                ) : header === "Date" ? (
                  <DatePicker
                  value={dayjs(rowData[field], "DD-MM-YY")}
                  format="DD-MM-YY"
                
                  onChange={(date) => handleInputChange(dayjs(date).format("DD-MM-YY"), field)}
                  />
                ) : (
                  <input
                    placeholder={header}
                    className="border p-2 rounded-lg"
                    value={rowData[field]}
                    onChange={(e) => handleInputChange(e.target.value, field)}
                  />
                )}
              </div>
            );
          })}
      </div>
      <div className="flex items-center justify-end">
        <button onClick={handleAddRow} className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-40">
          {isEditing ? 'Save' : 'Add'}
        </button>
      </div>
      <div className="mt-8">
        <h2 className="text-xl mb-4">Data</h2>
        <table className="table-auto w-full border-collapse ">
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="border px-4 py-2 bg-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">
                  {header}
                </th>
              ))}
              <th className="border px-4 py-2 bg-gray-200 whitespace-nowrap overflow-hidden text-ellipsis">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, index) => {
                    const field = header.toLowerCase().replace(/[^a-zA-Z]/g, '');
                    if (field === 'date') {
                      return (
                        <td key={index} className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                          {dayjs(row[field],"DD-MM-YY").format("DD-MM-YY")}
                        </td>
                      );
                    } else {
                      return (
                        <td key={index} className="border px-4 py-2 whitespace-nowrap overflow-hidden text-ellipsis">
                          {row[field]}
                        </td>
                      );
                    }
                  })}
                  <td className="border px-4 py-8 flex gap-4 whitespace-nowrap overflow-hidden text-ellipsis">
                    <button
                      onClick={() => handleEditRow(rowIndex)}
                      className="mr-2 bg-yellow-500 text-white p-1 rounded"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteRow(rowIndex)} className="bg-red-500 text-white p-1 rounded">
                      Delete
                    </button>
                    <button onClick={() => handleBookingStatus(rowIndex)} className="bg-blue-500 text-white p-1 rounded">
                      {data[rowIndex].status === 'booked' ? 'Cancel' : 'Book'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="border px-4 py-2 text-center whitespace-nowrap overflow-hidden text-ellipsis">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showVendorModal && <SharedModal onClose={closeVendorModal} type="transport" fetchData={fetchData} />}
      {showTransportModal && <SharedModal fetchData={fetchData} onClose={closeTransportModal} type="transportName"  />}
    </div>
  );
};
