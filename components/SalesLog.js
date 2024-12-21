'use client'
// components/SalesLog.js
import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import SalesLogTable from './SalesLogTable'
import NewTaskModal from "./NewTaskModal";


const SalesLog = () => {
  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const openModal = (row) => {
    setSelectedRow(row); // Store the selected row
    setIsModalOpen(true);   // Show the modal
  };


  const handleClose = () => {
    setIsModalOpen(false);
  }

  const handleSave = (newTask) => {
    // Do something with the new task, like updating state or refreshing data
    console.log("Task saved:", newTask);
  };


  return (
    <div className="bg-white shadow-2xl">
        <div className="flex justify-between px-10 py-5 bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-sm font-bold">SALES LOG</h1>
        <button className="flex border border-black text-sm font-bold px-4 py-2 rounded-sm ms-5"   onClick={() => setIsModalOpen(true)}>
          <span className="flex text-blue-700 pe-2"><CiCirclePlus size={18}/></span> New Task
        </button>
        <NewTaskModal
         isOpen={isModalOpen}
         onClose={handleClose}
        //  existingTask={selectedTask}
         onSave={handleSave} 
         row={selectedRow}
      />
      </div>
      <div>

      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-gray-300 p-2 w-96 mb-4"
        />
        </div>
        </div>
      <div className="overflow-x-auto p-8">
        <SalesLogTable openModal={openModal}/>
      </div>
    </div>
  );
};

export default SalesLog;
