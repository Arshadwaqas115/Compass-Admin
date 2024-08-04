import React, { useState, useEffect } from "react";

export const OfficeInvoice = ({ formData, setFormData, data, handleChange }) => {
  const headers = [
    'Total P/A', 'Total R/A', 'RoE', 'PKR P/A', 'PKR R/A'
  ];

  const initialRowData = {
    totalpa: 0,
    totalra: 0,
    roe: 74,
    pkrpa: 0,
    pkrra: 0,
  };

  const [rowData, setRowData] = useState(initialRowData);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    // Calculate initial values when formData or rowData.roe changes
    calculateValues();
  }, []);

  const calculateValues = () => {
    let visaCount = parseInt(formData.mainDetails.visaCount);
    if (isNaN(visaCount)) {
      visaCount = 0;
    }
    const mainDetailRa = parseFloat(formData.mainDetails.ra * visaCount) || 0;
    const mainDetailPa = parseFloat(formData.mainDetails.pa * visaCount) || 0;
    let totalRA = 0;
    let totalPA = 0;

    for (const row of formData.transport) {
      totalRA += parseFloat(row.ra) || 0;
      totalPA += parseFloat(row.pa) || 0;
    }
   

    for (const row of formData.accomodation){
      totalPA += (parseFloat(row.purchase*row.roomsquantity*row.nights) || 0)
      totalRA += (parseFloat(row.selling*row.roomsquantity*row.nights) || 0)
    }

    for(const row of formData.services){
      totalRA +=(parseFloat(row.charges) || 0)
      // totalPA += (parseFloat(row.charges) || 0)
    }

    totalPA += mainDetailPa;
    totalRA += mainDetailRa;
    const roe = parseFloat(rowData.roe) || 0;

    setRowData({
      ...rowData,
      totalpa: totalPA,
      totalra: totalRA,
      pkrpa: roe * totalPA,
      pkrra: roe * totalRA,
    });
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    if (field === 'roe') {
     
      setRowData(prevRowData => ({
        ...prevRowData,
        roe: value,
      
        
        pkrpa: parseFloat(value || 0) * prevRowData.totalpa,
        pkrra: parseFloat(value || 0) * prevRowData.totalra,
      }));
    } else {
      setRowData({ ...rowData, [field]: value });
    }
  };

  const handleAddRow = () => {
    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = rowData;
      setFormData({ ...formData, officeInvoice: updatedData });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      handleChange('officeInvoice', null, rowData);
    }

    setRowData(initialRowData);
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

  const handleCalculateNow = () => {
    const roe = parseFloat(rowData.roe) || 0;
    const totalPA = parseFloat(rowData.totalpa) || 0;
    const totalRA = parseFloat(rowData.totalra) || 0;

    setRowData({
      ...rowData,
      pkrpa: roe * totalPA,
      pkrra: roe * totalRA,
    });
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
      <div className='flex items-center justify-end mt-4'>
        <button
          onClick={handleCalculateNow}
          className="mr-4 bg-green-500 text-white p-2 rounded-lg"
        >
          Calculate Now
        </button>
        <button
          onClick={handleAddRow}
          className="bg-blue-500 text-white p-2 rounded-lg w-40"
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
