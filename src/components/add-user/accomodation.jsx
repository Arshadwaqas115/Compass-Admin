"use client";

import React, { useState } from 'react';

const headers = [
  'City',
  'Ref',
  'Hotel Name',
  'HCN',
  'Room Type',
  'Meals',
  'Quantity',
  'Check Inn',
  'Check Out',
  'Nights',
  'Vendor',
  'Selling',
  'Purchase',
];

export const Accomodation = ({ formData,data, setFormData,handleChange }) => {
  console.log("Form",formData)
  const [rowData, setRowData] = useState({
    city: '',
    ref: '',
    hotelname: '',
    hcn: '',
    roomtype: '',
    meals: '',
    quantity: '',
    checkinn: '',
    checkout: '',
    nights: '',
    vendor: '',
    selling: '',
    purchase: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (['meals', 'quantity', 'nights', 'selling', 'purchase'].includes(field)) {
      if (!/^\d*$/.test(value)) {
        alert(`${field.charAt(0).toUpperCase() + field.slice(1)} must be a number`);
        return;
      }
    }
    setRowData({ ...rowData, [field]: value });
  };

  const handleAddRow = () => {
    // Check for empty fields
    for (const key in rowData) {
      if (rowData[key] === '') {
        alert(`Please fill out the ${key.charAt(0).toUpperCase() + key.slice(1)} field`);
        return;
      }
    }

    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = rowData;
      setFormData( { ...formData, accomodation: updatedData });
    
      setIsEditing(false);
      setEditIndex(null);
    } else {
      handleChange('accomodation', null, rowData); 
    }

    setRowData({
      city: '',
      ref: '',
      hotelname: '',
      hcn: '',
      roomtype: '',
      meals: '',
      quantity: '',
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
    console.log(updatedAccommodation)
    setFormData( { ...formData, accomodation: updatedAccommodation });
    
  };
  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Step 2: Accomodation</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {headers.map((header, index) => {
          const field = header.toLowerCase().replace(/ /g, '');
          return (
            <div key={index} className="flex flex-col gap-2">
              <label className="font-semibold">{header}</label>
              <input
                type={header === 'Check Inn' || header === 'Check Out' ? 'date' : 'text'}
                placeholder={header}
                className="border p-2 rounded-lg"
                value={rowData[field]}
                onChange={(e) => handleInputChange(e, field)}
              />
            </div>
          );
        })}
      </div>
      <div className='flex items-center justify-end'>
        <button
          onClick={handleAddRow}
          className="mt-4 bg-blue-500 text-white p-2 rounded-lg w-40"
        >
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
                    const field = header.toLowerCase().replace(/ /g, '');
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
                    <button
                      onClick={() => handleDeleteRow(rowIndex)}
                      className="bg-red-500 text-white p-1 rounded"
                    >
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
    </div>
  );
};
