'use client';

import React, { useEffect, useState } from 'react';
import Select from 'react-select';

import { hotelOptions, mealOptions, roomOptions } from '../../extra/data';
import {SharedModal} from "../../components/modal/sharedmodal";
import CreatableSelect from 'react-select/creatable'
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

export const Accomodation = ({ formData, data, setFormData, handleChange, vendorOptions, mainDetails,fetchData }) => {
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
    checkinn: '',
    checkout: '',
    nights: '',
    vendor: '',
    selling: '',
    purchase: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [showVendorModal, setShowVendorModal] = useState(false);
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
    const checkInDate = new Date(checkinn);
    const checkOutDate = new Date(checkout);
    const timeDiff = checkOutDate - checkInDate;
    const daysDiff = timeDiff / (1000 * 3600 * 24);
    return daysDiff > 0 ? daysDiff : 0;
  };

  const handleAddRow = () => {
    for (const key in rowData) {
      if (rowData[key] === '' && key !== 'nights') {
        alert(`Please fill out the ${key.charAt(0).toUpperCase() + key.slice(1)} field`);
        return;
      }
    }

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
      fileNo: mainDetails.fileNo,
      guestname: mainDetails.guestName,
      city: '',
      ref: '',
      hotelname: '',
      hcn: '',
      roomtype: '',
      meals: '',
      roomsquantity: '',
      checkinn: '',
      checkout: '',
      nights: '',
      vendor: '',
      selling: '',
      purchase: '',
    });
  };

  const handleEditRow = (index) => {
    setRowData(data[index]);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedAccommodation = data.filter((item, i) => i !== index);
    setFormData({ ...formData, accomodation: updatedAccommodation });
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
          .filter((header) => header !== 'File No' && header !== 'Guest Name')
          .map((header, index) => {
            const field = header.toLowerCase().replace(/ /g, '');
            return (
              <div key={index} className="flex flex-col gap-2">
                <label className="font-semibold">{header}</label>
                {header === 'Room Type' ? (
                  <CreatableSelect
                    placeholder={header}
                    className="p-2 rounded-lg"
                    value={roomOptions.find((option) => option.value === rowData[field])}
                    onChange={(selectedOption) => handleInputChange(selectedOption.value, field)}
                    options={roomOptions}
                  />
                ) : header === 'Hotel Name' ? (
                  <CreatableSelect
                    placeholder={header}
                    className="p-2 rounded-lg"
                    value={hotelOptions.find((option) => option.value === rowData[field])}
                    onChange={(selectedOption) => handleInputChange(selectedOption.value, field)}
                    options={hotelOptions}
                  
                  />
                ) : header === 'Vendor' ? (
                              <div className="flex items-center">
                                  <Select
                                    placeholder={header}
                                    className="p-2 rounded-lg flex-1"
                                    value={vendorOptions.find((option) => option.value === rowData[field])}
                                    onChange={(selectedOption) => {
                                      handleInputChange(selectedOption.value, field);
                                     
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
                    value={mealOptions.find((option) => option.value === rowData[field])}
                    onChange={(selectedOption) => handleInputChange(selectedOption.value, field)}
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
                ) : (
                  <input
                    type={header === 'Check Inn' || header === 'Check Out' ? 'date' : 'text'}
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
                    return (
                      <td key={index} className="border px-4 py-2">
                        {row[field]}
                      </td>
                    );
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