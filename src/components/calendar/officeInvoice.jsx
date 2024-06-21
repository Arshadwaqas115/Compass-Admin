import React, { useState } from "react";

export const OfficeInvoice = ({  data }) => {
  const headers = [
    'Total P/A', 'Total R/A', 'RoE', 'PKR P/A', 'PKR R/A'
  ];

  // const [rowData, setRowData] = useState({
  //   totalpa: '',
  //   totalra: '',
  //   roe: '',
  //   pkrpa: '',
  //   pkrra: '',
  // });

  
  return (
    <div>
      <div className="mb-8 text-xl">
        <h1> Office Invoice</h1>
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
