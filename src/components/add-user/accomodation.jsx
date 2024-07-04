'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { hotelOptions, mealOptions, roomOptions } from '../../extra/data';
import {SharedModal} from "../../components/modal/sharedmodal";
import CreatableSelect from 'react-select/creatable'
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';

const headers = [
  'File No',
  'Guest Name',
  'City',
  'Ref',
  'Hotel Name',
  'HCN',
  'Rooms Quantity',
  'Room Type',
  'Meals',
  'Check Inn',
  'Check Out',
  'Nights',
  'Selling',
  'Purchase',
  'Vendor',
 
];

export const Accomodation = ({ formData, data, setFormData, handleChange, vendorOptions, mainDetails,fetchData, setVendorOptions }) => {
  const [rowData, setRowData] = useState({
    fileno: mainDetails.fileNo,
    guestname: mainDetails.guestName,
    city: '',
    ref: '',
    hotelname: '',
    hcn: '',
    roomtype: '',
    meals: '',
    roomsquantity: '',
    checkinn: dayjs().format('DD-MM-YY'),
    checkout: dayjs().format('DD-MM-YY'),
    nights: '',
    vendor: '',
    selling: '',
    purchase: '',
  });

  console.log(rowData, "formData")
  
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [roomValue, setRoomValue] = useState(null);
  const [hotelValue, setHotelValue] = useState(null);
  const [mealValue, setMealValue] = useState(null);
  const [vendorValue,setVendorValue] = useState(null);

  
  useEffect(() => {
    if (rowData.checkinn && rowData.checkout) {
      const nights = calculateNights(rowData.checkinn, rowData.checkout);
      setRowData((prevRowData) => ({ ...prevRowData, nights: nights.toString() }));
    }
  }, [rowData.checkinn, rowData.checkout]);

  const handleInputChange = (value, field) => {
    if (['roomsquantity', 'selling', 'purchase'].includes(field)) {
      if (!/^\d*$/.test(value)) {
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a number`);
        return;
      }
    }
    setRowData({ ...rowData, [field]: value });
  };

  const calculateNights = (checkinn, checkout) => {
    const checkInDate = dayjs(checkinn, 'DD-MM-YY');
    const checkOutDate = dayjs(checkout, 'DD-MM-YY');
    const timeDiff = checkOutDate.diff(checkInDate, 'days');
    return timeDiff > 0 ? timeDiff : 0;
  };

  const handleAddRow = () => {
    // for (const key in rowData) {
    //   if (rowData[key] === '' && key !== 'nights') {
    //     alert(`Please fill out the ${key.charAt(0).toUpperCase() + key.slice(1)} field`);
    //     return;
    //   }
    // }

    if (rowData.nights <= 0) {
      alert('Check Out date must be later than Check Inn date');
      return;
    }

    const newRowData = { ...rowData };

    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = newRowData;
     
      setFormData({ ...formData, accomodation: updatedData });
      
      setIsEditing(false);
      setEditIndex(null);
    } else {
      handleChange('accomodation', null, newRowData);
    }

    setRowData({
      fileno: mainDetails.fileNo,
      guestname: mainDetails.guestName,
      city: '',
      ref: '',
      hotelname: '',
      hcn: '',
      roomtype: '',
      meals: '',
      roomsquantity: '',
      checkinn: dayjs().format('MM-DD-YY'),
      checkout: dayjs().format('MM-DD-YY'),
      nights: '',
      vendor: '',
      selling: '',
      purchase: '',
   
    });
    setRoomValue(null);
    setHotelValue(null);
    setMealValue(null);
    setVendorValue(null)

    
  };

  const handleEditRow = (index) => {
    setRowData(data[index]);
    setRoomValue(data[index].roomtype ? {value: data[index].roomtype, label: data[index].roomtype} : null); 
    setHotelValue(data[index].hotelname ? {value: data[index].hotelname, label: data[index].hotelname} : null);
    setMealValue(data[index].meals ? {value: data[index].meals, label: data[index].meals} : null);
    setVendorValue(data[index].vendor ? {value: data[index].vendor, label: data[index].vendor} : null);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedAccommodation = data.filter((item, i) => i !== index);
    setFormData({ ...formData, accomodation: updatedAccommodation });
    setRoomValue(null);
    setHotelValue(null);
    setMealValue(null);
    setVendorValue(null)
  };

  const openVendorModal = () => {
    setShowVendorModal(true);
  };

  const closeVendorModal = () => {
    setShowVendorModal(false);
  };
  

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Step 2: Accommodation</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {headers
          .filter((header) => header !== 'File No' && header !== 'Guest Name' && header !== 'Rate')
          .map((header, index) => {
            const field = header.toLowerCase().replace(/ /g, '');
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="font-semibold">{header}</label>
                {header === 'Room Type' ? (
                  <CreatableSelect
                    placeholder={header}
                    className="p-2 rounded-lg"
                    value={roomValue}
                  
                    onChange={(selectedOption) => {
                      setRoomValue(selectedOption);
                      handleInputChange(selectedOption.value, field)
                    }}
                    options={roomOptions}
                  />
                ) : header === 'Hotel Name' ? (
                  <CreatableSelect
                    placeholder={header}
                    className="p-2 rounded-lg"
                    value={hotelValue}
                  
                    onChange={(selectedOption) => {
                      setHotelValue(selectedOption);
                      handleInputChange(selectedOption.value, field)
                    }}
                    options={hotelOptions}
                  
                  />
                ) : header === 'Vendor' ? (
                              <div className="flex items-center">
                                  <Select
                                    placeholder={header}
                                    className="p-2 rounded-lg flex-1"
                                    value={vendorValue}
                                    onChange={(selectedOption) => {
                                      handleInputChange(selectedOption.value, field);
                                      setVendorValue(selectedOption);
                                    }}
                                    options={vendorOptions}
                                  />
                              
                                    <button
                                      onClick={openVendorModal}
                                      className="ml-2 bg-green-500 text-white p-2 rounded-full"
                                    >
                                      +
                                    </button>
                          
                                </div>
                ) : header === 'Meals' ? (
                  <CreatableSelect
                    placeholder={header}
                    className="p-2 rounded-lg"
                    value={mealValue}
                  
                    onChange={(selectedOption) => {
                      setMealValue(selectedOption);
                      handleInputChange(selectedOption.value, field);
                    }}
                    options={mealOptions}
                  />
                ) : header === 'Nights' ? (
                  <input
                    type="text"
                    placeholder={header}
                    className="border p-2 rounded-lg"
                    value={rowData[field]}
                    readOnly
                  />
                ) 
                :
                
                
                header === "Check Inn" || header === "Check Out" ? (
                  <DatePicker
                    value={dayjs(rowData[field],"DD-MM-YY")}
                    format="DD-MM-YY"
                    onChange={(date) => handleInputChange(date ? dayjs(date).format('DD-MM-YY') : '', field)}
                  />
                )

              
               
                : (
                  <input
                    type='text'
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
                <th key={index} className="border px-4 py-2 bg-gray-200">
                  {header}
                </th>
              ))}
              <th className="border px-4 py-2 bg-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.map((header, index) => {
                    const field = header.toLowerCase().replace(/[^a-zA-Z]/g, '');
                    
                    if(field === "checkinn" || field === "checkout"){
                      return (
                        <td key={index} className="border px-4 py-2">
                          {  dayjs(row[field]).format("DD-MM-YY")}
                        </td>
                      )
                    } 
                    // else if (field === "rate") {
                    //   // Calculate the rate: nights * roomsquantity * selling
                    //   const rate = row['nights'] * row['roomsquantity'] * row['selling'];
                    //   return (
                    //     <td key={index} className="border px-4 py-2">
                    //       {rate.toFixed(2)} {/* Display rate with 2 decimal places */}
                    //     </td>
                    //   );
                    // }
                    else{
                      return (
                        <td key={index} className="border px-4 py-2">
                          {row[field]}
                        </td>
                      );

                    }
                  })}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEditRow(rowIndex)}
                      className="mr-2 bg-yellow-500 text-white p-1 rounded"
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteRow(rowIndex)} className="bg-red-500 text-white p-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length + 1} className="border px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showVendorModal && <SharedModal fetchData={fetchData} onClose={closeVendorModal} type="hotel"  />}
    </div>
  );
};