import React, { useEffect, useState } from "react";

export const OfficeInvoice = ({ formData, setFormData, data, handleChange }) => {
  const headers = [
    'Total P/A', 'Total R/A', 'RoE', 'PKR P/A', 'PKR R/A'
  ];

  const [rowData, setRowData] = useState({
    totalpa: '',
    totalra: '',
    roe: 74,
    pkrpa: '',
    pkrra: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);


  const calculation = () =>{
    const mainDetailRa = formData.mainDetails.ra
    const mainDetailPa = formData.mainDetails.pa
    let totalRA = 0;
    let totalPA = 0;
  
    for (const row of formData.transport) {
      console.log(row)
      totalRA += parseFloat(row.ra);
      totalPA += parseFloat(row.pa);
    }
    totalPA += parseFloat(mainDetailPa)
    totalRA += parseFloat(mainDetailRa)

    setRowData({...rowData,totalpa:totalPA,totalra:totalRA,pkrpa:rowData.roe * totalPA ,pkrra: rowData.roe * totalRA  })
  }
 
  useEffect(()=>{
    calculation()
  },[])


  const handleInputChange = (e, field) => {
   

   
    const value = e.target.value;
    if (['totalpa', 'totalra', 'roe', 'pkrpa', 'pkrra'].includes(field)) {
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
        alert(`Please fill out the ${key.replace(/(?<=\b)\w/g, c => c.toUpperCase())} field`);
        return;
      }
    }

    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = rowData;
      setFormData({ ...formData, officeInvoice: updatedData });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      handleChange('officeInvoice', null, rowData); // Pass the new row data as value
    }

    setRowData({
      totalpa: '',
      totalra: '',
      roe: '',
      pkrpa: '',
      pkrra: '',
    });
  };

  const handleEditRow = (index) => {
    const rowDataToEdit = data[index];
    setRowData(rowDataToEdit);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedOfficeInvoice = data.filter((item, i) => i !== index);
    setFormData({ ...formData, officeInvoice: updatedOfficeInvoice });
  };

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Step 5: Office Invoice</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {headers.map((header, index) => {
          const field = header.toLowerCase().replace(/[^a-zA-Z]/g, '');
          return (
            <div key={index} className="flex flex-col gap-2">
              <label className="font-semibold">{header}</label>
              <input
                type="text"
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
