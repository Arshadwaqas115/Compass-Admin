"use client";

import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";

export const EmployeeModal = ({ onClose, fetchData }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const options = [
    { value: "Admin", label: "Admin" },
    { value: "Employee", label: "Employee" },
  ];

  const submitData = async () => {
    if (!name || !password || !role) {
      toast.error("All fields are required");
      return;
    }

    try {
      await addDoc(collection(db, "employees"), {
        name: name,
        password: password,
        role: role,
      });
      setName("");
      setRole("");
      setPassword("");
      onClose()
      fetchData()
      
      toast.success("Employee added successfully");
    } catch (error) {
      toast.error("Failed to add employee");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded shadow-lg w-1/3">
        <h1 className="text-lg text-right cursor-pointer p-2" onClick={() => { onClose(); }}>
          x
        </h1>
        <div className="mt-4 flex flex-col items-center justify-center gap-6 p-4">
          <div>
            <h1 className="font-bold text-xl">Name</h1>
          </div>
          <div>
            <input
              type="text"
              placeholder="Enter employee name"
              className="border p-2 rounded-lg py-3 text-center w-full"
              value={name}
              onChange={(e) => { setName(e.target.value); }}
            />
          </div>
          <div>
            <h1 className="font-bold text-xl">Password</h1>
          </div>
          <div>
            <input
              type="password"
              placeholder="Enter employee password"
              className="border p-2 rounded-lg py-3 text-center w-full"
              value={password}
              onChange={(e) => { setPassword(e.target.value); }}
            />
          </div>
          <div>
            <h1 className="font-bold text-xl">Role</h1>
          </div>
          <div className="w-[220px]">
            <Select options={options} onChange={(selectionOption) => { setRole(selectionOption.value); }} />
          </div>
          <div>
            <button
              onClick={submitData}
              className="text-lg hover:bg-black bg-green-300 px-4 py-2 w-40 rounded-xl border text-white font-bold"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
