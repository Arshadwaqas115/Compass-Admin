import React, { useRef, useState, forwardRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const TransportVoucher = forwardRef(({ printData }, ref) => (
  <div ref={ref} className="p-8">
    <div className="text-center mb-4">
      <h1 className="text-3xl font-mono italic underline">Compass Travel & Tours</h1>
    </div>
    <div className="mb-8 text-xl">
      <div className="border-b pb-8">
        <h1 className="text-center text-3xl font-mono italic underline">Transport Voucher</h1>
      </div>
      <p className="italic mt-4">We would like to thank you for choosing our services. Please find your transport details below.</p>
      <div className="italic font-bold mt-4 mb-4">
        <div>Traveler Name: {printData.travelerName}</div>
      </div>
    </div>
    <div className="mb-8 text-xl text-center">
      <h2 className="text-2xl font-bold italic underline">Service Details</h2>
    </div>
    <table className="table-auto w-full border-collapse border-4 text-center">
      <thead>
        <tr>
          <th className="border px-4 py-2">Vehicle Type</th>
          <th className="border px-4 py-2">Sector</th>
          <th className="border px-4 py-2">Date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">{printData.vehicleType}</td>
          <td className="border px-4 py-2">{printData.sector}</td>
          <td className="border px-4 py-2">{printData.date}</td>
        </tr>
      </tbody>
    </table>
    <div className="mt-4">
      <p className="text-2xl italic font-bold mb-4 text-yellow-400">Very Important Note:</p>
      <p className="italic">
        Due to operational reasons at Jeddah and Medina Airports, you have to call on the given number then the driver will coordinate whereas driver waiting in Airport parking.
        If call coordination is not done from your side there will be difficulty to pick you up which could be considered a NO SHOW.
      </p>
      <p className="italic">Flight Detail:</p>
      <ul className="list-disc pl-5">
        <li className="italic">Contact the concerned person one day earlier to traveling.</li>
        <li className="italic">Your rental will start and finish according to the pick-up and drop-off dates and times detailed on your voucher.</li>
        <li className="italic">If our car does not reach you at the agreed time and date, it is essential you contact us as soon as possible.</li>
        <li className="italic">This voucher is neither refundable nor transferable.</li>
        <li className="italic">In case you lose the voucher, please contact our office nearest to your location.</li>
        <li className="italic">You are not allowed to sublet or use the vehicle to any other person.</li>
        <li className="italic">You are not allowed to use the vehicle out of the itinerary.</li>
      </ul>
      <p className="italic mt-4">We look forward to serving you and if there are any queries, please do not hesitate to contact us.</p>
    </div>
  </div>
));

export const Transport = ({ data, customer }) => {
  const printRef = useRef();
  const [printData, setPrintData] = useState(null);

  const handlePrint = (row) => {
    const objectForPrint = {
      vehicleType: row.vehicle,
      date: row.date,
      travelerName: customer.guestName,
      sector:row.sector
    };
    setPrintData(objectForPrint);
  };

  const triggerPrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Transport Voucher',
    onAfterPrint: () => setPrintData(null),
  });

  React.useEffect(() => {
    if (printData) {
      triggerPrint();
    }
  }, [printData, triggerPrint]);

  const headers = [
    'Vehicle', 'Ref', 'Date', 'Sector', 'Vendor', 'Booked', 'R/A', 'P/A', 'Remarks', 'Pick Point', 'Drop Point', 'Print'
  ];

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Transport</h1>
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
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {headers.slice(0, -1).map((header, index) => {
                    const field = header.toLowerCase().replace(/[^a-zA-Z]/g, '');
                    return (
                      <td key={index} className="border px-4 py-2">
                        {row[field]}
                      </td>
                    );
                  })}
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handlePrint(row)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={headers.length} className="border px-4 py-2 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {printData &&<div style={{ display: 'none' }}> <TransportVoucher ref={printRef} printData={printData} /></div> }
    </div>
  );
};
