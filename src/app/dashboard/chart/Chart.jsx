"use client";

import React, { useEffect, useRef } from 'react';
import { format, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { useScreenshot, createFileName } from 'use-react-screenshot';
import dayjs from 'dayjs';

const Chart = ({ data, fromDate, toDate }) => {
  const days = eachDayOfInterval({ start: dayjs(fromDate, 'DD-MM-YY').toDate(), end: dayjs(toDate, 'DD-MM-YY').toDate() });
  const ref = useRef(null);
  const [image, takeScreenshot] = useScreenshot();

  const getImage = async () => {
    const screenshot = await takeScreenshot(ref.current);
    const now = new Date();
    const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    download(screenshot, { name: `${fromDate} - ${toDate} -- ${now.toDateString()} -- ${formattedTime}`, extension: 'png' });
  };

  const download = (iImage, { name = 'img', extension = 'png' } = {}) => {
    const a = document.createElement('a');
    a.href = iImage;
    a.download = createFileName(extension, name);
    a.click();
  };

  const filteredData = data?.filter((item) => {
    const hasAccommodationWithinRange = item.accomodation.some(acc => {
      const checkinDate = dayjs(acc.checkinn, 'DD-MM-YY').toDate();
      const checkoutDate = dayjs(acc.checkout, 'DD-MM-YY').toDate();

      return dayjs(checkinDate).isValid() && dayjs(checkoutDate).isValid() && 
             ((checkinDate >= dayjs(fromDate, 'DD-MM-YY').toDate() && checkinDate <= dayjs(toDate, 'DD-MM-YY').toDate()) || 
              (checkoutDate >= dayjs(fromDate, 'DD-MM-YY').toDate() && checkoutDate <= dayjs(toDate, 'DD-MM-YY').toDate()) ||
              (checkinDate < dayjs(fromDate, 'DD-MM-YY').toDate() && checkoutDate > dayjs(toDate, 'DD-MM-YY').toDate()));
    });

    const hasTransportWithinRange = item.transport.some(tran => {
      const transportDate = dayjs(tran.date, 'DD-MM-YY').toDate();
      return dayjs(transportDate).isValid() && 
             transportDate >= dayjs(fromDate, 'DD-MM-YY').toDate() && 
             transportDate <= dayjs(toDate, 'DD-MM-YY').toDate();
    });

    return hasAccommodationWithinRange || hasTransportWithinRange;
  });

  console.log("filteredData", filteredData);

  return (
    <div className="mt-20">
      <div>
        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 text-sm' onClick={getImage}>
          Take screenshot
        </button>
      </div>
      <table className="border-collapse border-2 text-xs" ref={ref}>
        <thead>
          <tr className='bg-orange-400'>
            <th className="border px-4 py-2">Guest Name</th>
            <th className="border px-4 py-2">Service</th>
            {days.map((day, index) => (
              <th key={index} className="border px-4 py-2">
                {format(day, 'dd')} {format(day, 'MMM')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-xs">
          {filteredData?.map((item, index) => (
            <tr key={index}>
              <td className="border px-4 py-2 text-black font-bold">{item.mainDetails?.guestName}</td>
              <td className="border px-4 py-2 text-black font-bold">{item.services[0]?.service}</td>
              {days.map((day, dayIndex) => {
                const currentHotel = item.accomodation.find(acc => {
                  const checkinDate = dayjs(acc.checkinn, 'DD-MM-YY').toDate();
                  const checkoutDate = dayjs(acc.checkout, 'DD-MM-YY').toDate();
                  return dayjs(checkinDate).isValid() && dayjs(checkoutDate).isValid() && 
                         isWithinInterval(day, {
                           start: checkinDate,
                           end: new Date(checkoutDate.setHours(23, 59, 59, 999)) // Extend to the end of the checkout day
                         });
                });

                const transportItem = item?.transport.find(t => {
                  const transportDate = dayjs(t.date, 'DD-MM-YY').toDate();
                  return dayjs(transportDate).isValid() && 
                         format(transportDate, 'MM-dd-yyyy') === format(day, 'MM-dd-yyyy');
                });

                const isSameTransportDay = transportItem && dayjs(transportItem.date, 'DD-MM-YY').isValid() && 
                                           format(dayjs(transportItem.date, 'DD-MM-YY').toDate(), 'MM-dd-yyyy') === format(day, 'MM-dd-yyyy');

                return (
                  <td key={dayIndex} className="border py-2">
                    {currentHotel && (
                      <div className={`p-1 truncate ${currentHotel?.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`}>
                        <div className="w-full p-1 truncate font-bold" style={{ width: "100%" }}>
                          {currentHotel?.hotelname} / {currentHotel?.vendor}
                          {currentHotel?.status === "Cancelled" && <span className="text-white"> (Cancelled)</span>}
                        </div>
                      </div>
                    )}
                    {isSameTransportDay && (
                      <div className="p-1">
                        <div className={`w-full p-2 truncate text-white font-bold ${transportItem?.status === 'Cancelled' ? 'bg-red-500' : (item.services[0]?.service === 'Visa Only' || item.services[0]?.service === 'Ticket' || item.services[0]?.service === 'Air Ticket' ? 'bg-yellow-500' : 'bg-blue-500')}`} style={{ width: "100%" }}>
                          {transportItem?.sector} / {transportItem?.vehicle}
                          {transportItem?.status === "Cancelled" && <span className="text-white"> (Cancelled)</span>}
                        </div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Chart;
