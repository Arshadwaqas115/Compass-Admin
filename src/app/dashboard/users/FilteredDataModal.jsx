import React, { useState } from 'react';
import { Gantt } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";

const FilteredDataModal = ({ show, onClose, data }) => {
  if (!show) return null;

  const [transformedData, setTransformedData] = useState([]);

  const transformAccommodationEntries = (guest) => {
    const accommodations = guest.accomodation;
    
    const firstCheckin = new Date(accommodations[0].checkinn);
    const lastCheckout = new Date(accommodations[accommodations.length - 1].checkout);

    const projectTask = {
      start: firstCheckin,
      end: lastCheckout,
      name: guest.mainDetails.guestName,
      id: 'Project',
      type: 'Project',
      progress: 100,
      isDisabled: true,
      styles: { progressColor: '#F08080', progressSelectedColor: '#ff9e0d' },
    };

    const tasks = accommodations.map((accommodation, index) => ({
      start: new Date(accommodation.checkinn),
      end: new Date(accommodation.checkout),
      name: accommodation.hotelname,
      id: `Task ${index}`,
      type: 'task',
      progress: 100,
      isDisabled: true,
      styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
    }));

    return [projectTask, ...tasks];
  };


  useState(() => {
    const transformed = data.map((guest) => transformAccommodationEntries(guest));
    setTransformedData(transformed);
  }, [data]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-40">
      <div className="bg-white p-4 rounded shadow-lg  lg:w-1/2 h-full overflow-y-auto overflow-x-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl">Filtered Data</h2>
          <button onClick={onClose} className="text-black">
            &times;
          </button>
        </div>
        <div>
          {/* Gantt chart component */}
          <Gantt tasks={transformedData.flat()} />
        </div>
      </div>
    </div>
  );
};

export default FilteredDataModal;
