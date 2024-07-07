"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import Select from 'react-select';
import {SharedModal} from "../../components/modal/sharedmodal"; 
import { toast } from "react-toastify";
import dayjs from "dayjs";

export const Maindetails = ({ data, handleChange, agentOptions, errors,fetchData }) => {
  const agent = agentOptions.find((agent) => agent.name === data?.mainDetails?.agent);
  
  const [selected, setSelected] = useState(agent);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const handleSelectChange = (selectedOption) => {
    setSelected(selectedOption);
  };

  const openVendorModal = () => {
    setShowVendorModal(true);
  };

  const closeVendorModal = () => {
    setShowVendorModal(false);
  };
  useEffect(() => {
    if (selected) {
      handleChange("mainDetails", "agent", selected.label); 
      handleChange("mainDetails", "agentId", selected.id);
    } else {
      handleChange("mainDetails", "agent", "");
      handleChange("mainDetails", "agentId", "");
    }
  }, [selected]);

  return (
    <div className="">
      <div className="mb-8 text-xl">
        <h1>Step 1: Main Details</h1>
      </div>
      <div className="grid grid-cols-3 p-4 pb-2 gap-4">
        <div className="flex flex-col gap-2"  >
          <div>
            <h1 className="font-semibold">File no</h1>
          </div>
          <div >
            <input
              type="text"
              placeholder="file no"
              className="border p-2 rounded-lg py-3 bg-gray-200"
              value={data.fileNo}
           
              onChange={(e) => handleChange("mainDetails", "fileNo", e.target.value)}
              disabled
            />
          </div>
          {errors?.fileNo && <p className="text-red-500">{errors.fileNo}</p>}
        </div>
        <div>
          <div>
            <h1 className="font-semibold">Date</h1>
          </div>
          <div>
            <DatePicker
              value={dayjs(data.date,"DD-MM-YY")}
              onChange={(date) => handleChange("mainDetails", "date", date)}
              format="DD-MM-YY"
            />
          </div>
          {errors?.date && <p className="text-red-500">{errors.date}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Agent</h1>
          </div>
          <div className="flex items-center">
            <Select
              className="flex-grow"
              options={agentOptions}
              value={selected}
              onChange={handleSelectChange}
              isClearable
            />
            <button
              onClick={openVendorModal}
              className="ml-2 bg-green-500 text-white p-2 rounded-full"
            >
              +
            </button>
          </div>
          {errors?.agent && <p className="text-red-500">{errors.agent}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Guest Name</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="guest name"
              className="border p-2 rounded-lg py-3"
              value={data.guestName}
              onChange={(e) => handleChange("mainDetails", "guestName", e.target.value)}
            />
          </div>
          {errors?.guestName && <p className="text-red-500">{errors.guestName}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Details</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="details"
              className="border p-2 rounded-lg py-3"
              value={data.details}
              onChange={(e) => handleChange("mainDetails", "details", e.target.value)}
            />
          </div>
          {errors?.details && <p className="text-red-500">{errors.details}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Visa Company</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="visa company"
              className="border p-2 rounded-lg py-3"
              value={data.visaCompany}
              onChange={(e) => handleChange("mainDetails", "visaCompany", e.target.value)}
            />
          </div>
          {errors?.visaCompany && <p className="text-red-500">{errors.visaCompany}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">P/A</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="p/a"
              className="border p-2 rounded-lg py-3"
              value={data.pa}
              onChange={(e) => handleChange("mainDetails", "pa", e.target.value)}
            />
          </div>
          {errors?.pa && <p className="text-red-500">{errors.pa}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">R/A</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="r/a"
              className="border p-2 rounded-lg py-3"
              value={data.ra}
              onChange={(e) => handleChange("mainDetails", "ra", e.target.value)}
            />
          </div>
          {errors?.ra && <p className="text-red-500">{errors.ra}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Visa Required</h1>
          </div>
          <div>
            <select
              name="Visa Required"
              className="w-40 p-2"
              value={data.visaRequired}
              onChange={(e) => handleChange("mainDetails", "visaRequired", e.target.value)}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>
        {data.visaRequired === "yes" && (
          <div className="flex flex-col gap-2">
            <div>
              <h1 className="font-semibold">How many?</h1>
            </div>
            <div>
              <input
                type="text"
                placeholder="visa count"
                className="border p-2 rounded-lg py-3"
                value={data.visaCount}
                onChange={(e) => handleChange("mainDetails", "visaCount", e.target.value)}
              />
            </div>
            {errors?.visaCount && <p className="text-red-500">{errors.visaCount}</p>}
          </div>
        )}
      </div>
      {showVendorModal && <SharedModal onClose={closeVendorModal} type="agent"   fetchData={fetchData} />}
    </div>
  );
};