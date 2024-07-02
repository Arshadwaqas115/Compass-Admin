"use client"

import React, {useEffect, useRef} from 'react';
import { format, eachDayOfInterval, isWithinInterval, isValid } from 'date-fns';
// import { useScreenshot , createFileName } from 'use-react-screenshot'
const Chart = ({ data, fromDate, toDate }) => {
  const days = eachDayOfInterval({ start: new Date(fromDate), end: new Date(toDate) });
  const ref = useRef(null)
  // const [image, takeScreenshot] = useScreenshot()
  // const getImage = () => takeScreenshot(ref.current)



  const filteredData = data?.filter((item) => {
    const lastAccommodationCheckout = item.accomodation.length > 0 ? new Date(item.accomodation[item.accomodation.length - 1]?.checkout) : null;
    const lastTransportDate = item.transport.length > 0 ? new Date(item.transport[item.transport.length - 1]?.date) : null;

    const isAccommodationWithinRange = lastAccommodationCheckout && isValid(lastAccommodationCheckout) && isWithinInterval(lastAccommodationCheckout, { start: new Date(fromDate), end: new Date(toDate) });
    const isTransportWithinRange = lastTransportDate && isValid(lastTransportDate) && isWithinInterval(lastTransportDate, { start: new Date(fromDate), end: new Date(toDate) });

    return isAccommodationWithinRange || isTransportWithinRange;
  });


  // const download = (iImage, { name = 'img', extension = 'png' } = {}) => {
  //   const a = document.createElement('a')
  //   a.href = iImage
  //   a.download = createFileName(extension, name)
  //   a.click()
  // }



  
  // useEffect(() => {
  //   if (image) {
  //     const now = new Date()
  //     const formattedTime = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
  //     download(image, { name: `${fromDate} - ${toDate} -- ${now.toDateString()} -- ${formattedTime}`, extension: 'png' })
  //   }
  // }, [image])

  return (
    <div className="mt-20">
      <div>
        {/* <button  className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 text-sm' onClick={getImage}>
          Take screenshot
        </button> */}
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
                  const checkinDate = new Date(acc.checkinn);
                  const checkoutDate = new Date(acc.checkout);
                  return isValid(checkinDate) && isValid(checkoutDate) && isWithinInterval(day, {
                    start: checkinDate,
                    end: checkoutDate
                  });
                });

                const transportItem = item?.transport.find(t => {
                  const transportDate = new Date(t.date);
                  return isValid(transportDate) && format(transportDate, 'MM-dd-yyyy') === format(day, 'MM-dd-yyyy');
                });

                
                const isSameTransportDay = transportItem && isValid(new Date(transportItem.date)) && new Date(transportItem.date).toDateString() === day.toDateString();

                return (
                  <td key={dayIndex} className="border py-2">
                    {currentHotel && (
                      <div className={`p-1 truncate ${currentHotel?.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-green-500 text-black'}`} >
                        <div className="w-full p-1 truncate font-bold" style={{ width: "100%" }}>
                          {currentHotel?.hotelname} / {currentHotel?.vendor}
                          {currentHotel?.status === "Cancelled" && <span className="text-white"> (Cancelled)</span>}
                        </div>
                      </div>
                    )}
                    {isSameTransportDay &&  (
                
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
{/*       
      <div>
            <img className='w-full' src={image} alt={'Screenshot'} />
      </div> */}
    </div>
  );
}

export default Chart;
