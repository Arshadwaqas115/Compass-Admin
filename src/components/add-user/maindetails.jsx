"use client";
import { DatePicker } from "@mui/x-date-pickers";
import { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";

export const Maindetails = ({ data, handleChange, agentOptions }) => {
  const [selected, setSelected] = useState([]);

  const handleSelectChange = (selectedOption) => {
    setSelected(selectedOption.length > 0 ? [selectedOption[0]] : []);
  };

  useEffect(() => {
    if (selected.length > 0) {
      handleChange("mainDetails", "agent", selected[0].label); 
      handleChange("mainDetails", "agentId", selected[0].id);
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
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">File no</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="file no"
              className="border p-2 rounded-lg py-3"
              value={data.fileNo}
              onChange={(e) => handleChange("mainDetails", "fileNo", e.target.value)}
            />
          </div>
        </div>
        <div>
          <div>
            <h1 className="font-semibold">Date</h1>
          </div>
          <div>
            <DatePicker
              value={data.date}
              onChange={(date) => handleChange("mainDetails", "date", date)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Agent</h1>
          </div>
          <div>
              <MultiSelect
              options={agentOptions}
              value={selected}
              onChange={handleSelectChange}
              labelledBy="Select"
              hasSelectAll={false}
            />
          </div>
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
          </div>
        )}
      </div>
    </div>
  );
};
