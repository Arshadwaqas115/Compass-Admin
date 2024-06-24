'use client';

import React, { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

const Voucher = React.forwardRef(({ printData }, ref) => (
  <div ref={ref} className="p-8">
    <div className="mb-8 text-xl">
      <div className="border-b pb-8">
        <h1 className="text-center text-3xl font-mono italic  underline">Service Voucher</h1>
      </div>

      <p className="italic mt-4">
        We would like to thank you for choosing our services we are pleased to confirm your reservation.
      </p>
      {/* <div>Reservation Number: {printData.ref}</div> */}
      <div className="italic font-bold mt-4 mb-4">
        <div>Guest Name: {printData.guestName}</div>
        <div>Hotel Name: {printData.hotelName}</div>
        <div>Check In: {printData.checkInn}</div>
        <div>Check Out: {printData.checkOut}</div>
        <div>Nights: {printData.nights}</div>
      </div>
    </div>
    <table className="table-auto w-full border-collapse border-4">
      <thead>
        <tr>
          <th className="border px-4 py-2">QTY</th>
          <th className="border px-4 py-2">Room Type</th>
          <th className="border px-4 py-2">Meals</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="border px-4 py-2">{printData.quantity}</td>
          <td className="border px-4 py-2">{printData.roomType}</td>
          <td className="border px-4 py-2">{printData.meals}</td>
        </tr>
      </tbody>
    </table>
    <div className="mt-4 ">
      <p className="text-2xl italic font-bold mb-4">Booking Terms & Conditions:</p>
      <ul className="list-disc pl-5 ">
        <li className="italic">Hotel Check in Time @ 16:00 - Check out Time @ 12:00 noon.</li>
        <li className="italic">Early Check in and Late Check-out Subject to Hotel Availability with Extra Charge.</li>
        <li className="italic">Triple or Quad occupancy will be through an Extra Mattress or Folding Bed.</li>
        <li className="italic">Extra-person charges may apply and vary depending on property policy.</li>
        <li className="italic">
          Government-issued photo identification and a credit card debit card or cash deposit may be required at
          check-in for incidental charges.
        </li>
        <li className="italic">
          Special requests are subject to availability upon check-in and may incur additional charges; special requests
          cannot be guaranteed.
        </li>
        <li className="italic">Noise-free guestrooms cannot be guaranteed.</li>
        <li className="italic">Booking Details Cant be amended or modified.</li>
        <li className="italic">Full Stay Will be charged in Case Of Cancellation or No Show.</li>
        <li className="italic">Full Stay will be charged in Case of Early Departure.</li>
        <li className="italic">PS: Children sharing bed with the parents (no additional bed).</li>
        <li className="italic">
          Once it is paid this booking it will be: Non Cancellation / Non Refundable / Non Amendable.
        </li>
        <li className="italic">
          Please note that cultural norms and guest policies may differ by country and by property; the policies listed
          are provided by the property.
        </li>
      </ul>
      <p className="italic mt-4">
        We look forward to welcoming you at our Hotel and if there are any queries please do not hesitate to contact us.
      </p>
    </div>
  </div>
));

Voucher.displayName = 'Voucher';

export const Accomodation = ({ data, customer, type }) => {

 
  const customerHeaders = [
    'File No',
    'Guest Name',
    'City',
    'Ref',
    'Hotel Name',
    'HCN',
    'Room Type',
    'Meals',
    'Rooms Quantity',
    'Check Inn',
    'Check Out',
    'Nights',
    'Vendor',
    'Selling',
    'Purchase',
    'Print',
  ];
  const agentHeaders = [
    'File No',
    'Guest Name',
    'City',
    'Ref',
    'Hotel Name',
    'HCN',
    'Room Type',
    'Meals',
    'Rooms Quantity',
    'Check Inn',
    'Check Out',
    'Nights',
    'Vendor',
    'Selling',
    'Purchase',
    'Print',
  ];
  const vendorHeaders = [
    'File No',
    'Guest Name',
    'City',
    'Ref',
    'Hotel Name',
    'HCN',
    'Room Type',
    'Meals',
    'Rooms Quantity',
    'Check Inn',
    'Check Out',
    'Nights',
    'Vendor',
    'Selling',
    'Purchase',
    'Print',
  ];
  const getHeaders = () => {
    if (type === 'Agent') {
      return agentHeaders;
    }
    if (type === 'Vendor'){
      return vendorHeaders
    }
    else {
      return customerHeaders;
    }
  };

  const headers = getHeaders();

  const printRef = useRef();
  const [printData, setPrintData] = useState(null);

  const handlePrint = (row) => {
    const objectForPrint = {
      checkInn: row.checkinn,
      checkOut: row.checkout,
      hotelName: row.hotelname,
      guestName: row.guestname,
      nights: row.nights,
      quantity: row.quantity,
      roomType: row.roomtype,
      meals: row.meals,
    };
    setPrintData(objectForPrint);
  };

  const triggerPrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Hotel Voucher',
    onAfterPrint: () => setPrintData(null),
  });

  React.useEffect(() => {
    if (printData) {
      triggerPrint();
    }
  }, [printData]);

  return (
    <div>
      <div className="mb-8 text-xl">
        <h1>Accomodation</h1>
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
                    const field = header.toLowerCase().replace(/ /g, '');
                    console.log(field);
                    return (
                      <td key={index} className="border px-4 py-2">
                        {row[field]}
                      </td>
                    );
                  })}
                  <td className="border px-4 py-2">
                    <button onClick={() => handlePrint(row)} className="bg-blue-500 text-white px-2 py-1 rounded">
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

      {printData && (
        <div style={{ display: 'none' }}>
          <Voucher ref={printRef} printData={printData} />
        </div>
      )}
    </div>
  );
};
