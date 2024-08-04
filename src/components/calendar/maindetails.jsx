"use client";

import dayjs from "dayjs";

// import { DatePicker } from "@mui/x-date-pickers";


export const Maindetails = ({ data}) => {

  

  return (
    <div className="">
     <div className="mb-8 text-xl">
        <h1>Main Details</h1>
      </div>
      <div className="grid grid-cols-3 p-4 pb-2  gap-4">
        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">File no</h1>
          </div>
          <div>
            {data?.fileNo}
          </div>
        </div>
        <div>
          <div>
            <h1 className="font-semibold">Date</h1>
          </div>
          <div>
            {dayjs(data?.date,"DD-MM-YY").format("DD-MM-YY")}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
           <h1 className="font-semibold">Agent</h1>
          </div>
          <div>
            {data?.agent}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
           <h1 className="font-semibold">Guest Name</h1>
          </div>
          <div>
           {data?.guestName}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
          <h1 className="font-semibold">Details</h1>
          </div>
          <div>
           {data?.details}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
          <h1 className="font-semibold">Visa Required</h1>
          </div>
          <div>
            {data?.visaRequired}
          </div>
        </div>
            {data?.visaRequired === "yes" && (
              <>
                <div className="flex flex-col gap-2">
                  <div>
                  <h1 className="font-semibold">Visa Company</h1>
                  </div>
                  <div>
                    {data?.visaCompany}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                  <h1 className="font-semibold">P/A</h1>
                  </div>
                  <div>
                    {data?.pa}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div>
                  <h1 className="font-semibold">R/A</h1>
                  </div>
                  <div>
                    {data?.ra}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div>
                    <h1 className="font-semibold">Visa Count</h1>
                    </div>
                    <div>
                      {data?.visaCount}
                    </div>
                </div>
              </>
            )}
        
       
       
      </div>
    </div>
  );
};
