'use client'
import React, { useState } from "react";
import { CiCirclePlus } from "react-icons/ci";
import SalesLogTable from "./SalesLogTable";
import NewTaskModal from "./NewTaskModal";

const SalesLog = () => {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const openModal = (row = null) => {
    setSelectedRow(row); // Store the selected row for editing or null for new
    setIsModalOpen(true); // Show the modal
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedRow(null); // Clear the selected row after closing
  };

  const handleSave = (updatedTask) => {
    if (selectedRow) {
      // Handle updating an existing task
      console.log("Updated task:", updatedTask);
    } else {
      // Handle creating a new task
      console.log("New task saved:", updatedTask);
    }
    handleClose(); // Close the modal after saving
  };

  return (
    <div className="bg-white shadow-2xl">
      <div className="flex justify-between px-10 py-5 bg-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-sm font-bold">SALES LOG</h1>
          <button
            className="flex border border-black text-sm font-bold px-4 py-2 rounded-sm ms-5"
            onClick={() => openModal()}
          >
            <span className="flex text-blue-700 pe-2">
              <CiCirclePlus size={18} />
            </span>
            New Task
          </button>
          <NewTaskModal
            isOpen={isModalOpen}
            onClose={handleClose}
            existingTask={selectedRow} // Pass existing row data to modal
            onSave={handleSave}
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
        <SalesLogTable openModal={openModal} />
      </div>
    </div>
  );
};

export default SalesLog;
