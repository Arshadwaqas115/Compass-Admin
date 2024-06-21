import React, { useState } from 'react';

export const Transport = ({  formData,data, setFormData, handleChange }) => {
  const headers = [
    'Vehicle', 'Ref', 'Date', 'Sector', 'Vendor', 'Booked', 'R/A', 'P/A', 'Remarks', 'Pick Point', 'Drop Point'
  ];

  const [rowData, setRowData] = useState({
    vehicle: '',
    ref: '',
    date: '',
    sector: '',
    vendor: '',
    booked: '',
    ra: '',
    pa: '',
    remarks: '',
    pickpoint: '',
    droppoint: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  console.log(rowData)
  const handleInputChange = (e, field) => {
    let value = e.target.value;
  
    if (field === "r/a") {
      field = "ra";
    } else if (field === "p/a") {
      field = "pa";
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
      setFormData( { ...formData, transport: updatedData });
      setIsEditing(false);
      setEditIndex(null);
      
    } else {
      handleChange('transport', null, rowData);
    }

    setRowData({
      vehicle: '',
      ref: '',
      date: '',
      sector: '',
      vendor: '',
      booked: '',
      ra: '',
      pa: '',
      remarks: '',
      pickpoint: '',
      droppoint: '',
    });
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
    
    setRowData(transformedData);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedTransport = data.filter((item, i) => i !== index);
    setFormData( { ...formData, transport: updatedTransport });
  };

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Step 3: Transport</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {headers.map((header, index) => {
          const field = header.toLowerCase().replace(/[^a-zA-Z]/g, '');
          return (
            <div key={index} className="flex flex-col gap-2">
              <label className="font-semibold">{header}</label>
              <input
                type={header === 'Date' ? 'date' : 'text'}
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