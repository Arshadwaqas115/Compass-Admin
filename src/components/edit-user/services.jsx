import React, { useState } from 'react';
import { serviceOptions, staffOptions } from '@/extra/data';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable'
export const Services = ({ formData, setFormData, data, handleChange }) => {
  const headers = ['Service', 'Charges', 'Staff'];

  const [rowData, setRowData] = useState({
    service: '',
    charges: '',
    staff: '',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [serviceValue, setServiceValue] = useState(null);
  const [staffValue,setStaffValue] = useState(null);
  const handleInputChange = (value, field) => {
    setRowData({ ...rowData, [field]: value });
  };

  const handleAddRow = () => {
    for (const key in rowData) {
      if (rowData[key] === '') {
        alert(`Please fill out the ${key.charAt(0).toUpperCase() + key.slice(1)} field`);
        return;
      }
    }

    if (isEditing) {
      const updatedData = [...data];
      updatedData[editIndex] = rowData;
      setFormData({ ...formData, services: updatedData });
      setIsEditing(false);
      setEditIndex(null);
    } else {
      handleChange('services', null, rowData);
    }

    setRowData({
      service: '',
      charges: '',
      staff: '',
    });
    setStaffValue(null)
    setServiceValue(null)
  };

  const handleEditRow = (index) => {
    const rowDataToEdit = data[index];
    setServiceValue(data[index].service? {label: data[index].service, value: data[index].service}: null);
    setStaffValue(data[index].staff? {label: data[index].staff, value: data[index].staff}: null);
    setRowData(rowDataToEdit);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteRow = (index) => {
    const updatedServices = data.filter((item, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
    setStaffValue(null)
    setServiceValue(null)
  };

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Step 4: Services</h1>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {headers.map((header, index) => {
          const field = header.toLowerCase();
          return (
            <div key={index} className="flex flex-col gap-2 justify-center">
              <label className="font-semibold">{header}</label>
              {header === 'Service' ? (
                <CreatableSelect
                  placeholder={header}
                  className="p-2 rounded-lg"
                  value={serviceValue}
                  onChange={(selectedOption) => {handleInputChange(selectedOption.value, field); setServiceValue(selectedOption)} }
                  options={serviceOptions}
                />
              ) : header === 'Staff' ? (
                <CreatableSelect
                  placeholder={header}
                  className="p-2 rounded-lg"
                  value={staffValue}
                  onChange={(selectedOption) => {handleInputChange(selectedOption.value, field); setStaffValue(selectedOption)} }
                  options={staffOptions}
                />
              ) : (
                <input
                  type={header === 'Charges' ? 'number' : 'text'}
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
        <table className="table-auto w-full border-collapse">
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
                    const field = header.toLowerCase();
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
    </div>
  );
};
