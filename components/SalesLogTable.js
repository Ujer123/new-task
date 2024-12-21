"use client";
import { useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

const SalesLogTable = () => {
  const [products, setProducts] = useState([]); // Store fetched products
  const [filters, setFilters] = useState({});
  const [filterStates, setFilterStates] = useState({
    date: false,
    entity: false,
    task: false,
    time: false,
    person: false,
    notes: false,
    status: false,
  });
  const [openDropdownRow, setOpenDropdownRow] = useState(null);
  // const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
const [selectedProduct, setSelectedProduct] = useState(null); // State for the product being edited

const handleNotesModal = (productId) => {
  const product = products.find((prod) => prod._id === productId);
  setSelectedProduct(product);
  console.log(product);
  
  // setIsModalOpen(true); // Open the modal
};

const handleRowClick = (row) => {
  if (!row.notes) {
    openModal(row); // If notes are empty, open the modal
  }
};

const handleSaveNotes = async () => {
  if (selectedProduct) {
    try {
      const response = await fetch(`https://task-backend-tfp7.onrender.com/products/${selectedProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ notes: selectedProduct.notes }), // Update notes field
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct._id ? { ...product, notes: selectedProduct.notes } : product
          )
        );
        // setIsModalOpen(false); // Close modal after saving
      } else {
        console.error("Failed to update notes");
      }
    } catch (error) {
      console.error("Error saving notes:", error);
    }
  }
};

  const toggleDropdown = (rowId) => {
    setOpenDropdownRow((prev) => (prev === rowId ? null : rowId));
  };

  // Fetch the products from the backend when the component mounts
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://task-backend-tfp7.onrender.com/products");
        const data = await response.json();

        // Check if data is an array before setting it
        if (Array.isArray(data.data)) {
          setProducts(data.data); // Set the fetched products to state
        } else {
          console.error("Expected an array, but got:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []); // Empty dependency array means this runs once when the component mounts

  const toggleFilterDropdown = (filterName) => {
    setFilterStates((prev) => ({
      ...prev,
      [filterName]: !prev[filterName],
    }));
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch(`https://task-backend-tfp7.onrender.com/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update the local state after a successful update
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        );
      } else {
        console.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredRows = products.filter((row) => {
    return Object.entries(filters).every(([key, value]) =>
      value ? row[key].toString().toLowerCase().includes(value.toLowerCase()) : true
    );
  });


  const handleEdit = (productId) => {
    console.log("Edit Product with ID:", productId);
    // Implement edit functionality here
  };

  const handleDuplicate = (productId) => {
    console.log("Duplicate Product with ID:", productId);
    // Implement duplication functionality here
  };


  return (
    <div className="p-4">
      {Object.keys(filters).some((key) => filters[key]) ? (
        <div className="bg-sky-200 w-40 rounded-md">
          {Object.entries(filters).map(([key, value]) =>
            value ? (
              <p key={`${key}-${value}`} className="flex items-center justify-between mb-2 px-3 py-1 rounded-lg">
                <span className="text-black font-semibold capitalize">
                  {key}: <br /> <span className="font-normal">{value}</span>
                </span>
                <button
                  className="text-gray-600 hover:text-red-500 ml-2"
                  onClick={() => handleFilterChange(key, "")} // Clear individual filter
                >
                  <FaTimes />
                </button>
              </p>
            ) : null
          )}
        </div>
      ) : (
        <p className="text-sm mb-4 flex">
          Use the <FaFilter className="text-gray-400 mx-2" /> icon next to the table
          headers to apply filters.
        </p>
      )}

      <div className="overflow-x-auto h-96 overflow-y-scroll border rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["date", "entity", "task", "time", "person", "Notes", "Status"].map((column) => (
                <th key={column} className="p-4 text-left">
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  <div className="inline-block ml-2 relative">
                    <button
                      onClick={() => toggleFilterDropdown(column)}
                      className="p-2 rounded-md focus:outline-none"
                    >
                      <FaFilter className={filterStates[column] ? "text-black" : "text-gray-500"} />
                    </button>
                    {filterStates[column] && (
                      <div className="absolute top-full left-0 mt-2 w-40 bg-white border shadow-md rounded-md z-10">
                        
                        {[...new Set(products.map((row) => row[column]))].map((value) => (
                          <button
                            key={value}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => handleFilterChange(column, value)}
                          >
                            {value}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr key={index}>
                <td className="p-4">{row.date}</td>
                <td className="p-4">{row.entity}</td>
                <td className="p-4">{row.task}</td>
                <td className="p-4">{row.time}</td>
                <td className="p-4">{row.person}</td>
                <td className="p-4">
                {row.notes ? row.notes : (
                  <button
                    onClick={() => handleNotesModal(row._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                  >
                    Add Notes
                  </button>
                )}
              </td>
                <td className="p-4">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(row._id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        row.status === "Open" ? "text-red-500" : "text-blue-500"
                      }`}
                    >
                      {row.status}
                    </button>
                    {openDropdownRow === row._id && (
                      <div className="absolute top-full left-0 mt-2 w-44 p-3 bg-white border shadow-lg z-10">
                        <p className="font-bold mb-3">STATUS</p>
                        <div className="flex">

                        <button
                          onClick={() => handleStatusChange(row._id, "Open")}
                          className={`w-full px-4 bg-orange-500 text-white py-2 text-left rounded-t-md ${
                            row.status === "Open"
                          }`}
                        >
                          Open
                        </button>
                        <button
                          onClick={() => handleStatusChange(row._id, "Closed")}
                          className={`w-full px-4 py-2 text-left rounded-b-md ${
                            row.status === "Closed"
                            ? "bg-blue-100 text-blue-500"
                            : "hover:bg-gray-100"
                            }`}
                            >
                          Closed
                        </button>
                          </div>
                      </div>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="relative inline-block">
                  <select
  onChange={(e) => {
    const selectedOption = e.target.value;

    if (selectedOption === "edit") {
      handleEdit(row._id);  // Edit action
    } else if (selectedOption === "duplicate") {
      handleDuplicate(row._id);  // Duplicate action
    } else if (selectedOption === "change-status") {
      // Toggle the status between Open and Closed
      const newStatus = row.status === "Open" ? "Closed" : "Open";
      handleStatusChange(row._id, newStatus); // Change status to Open/Closed
    }
  }}
  className="block w-full bg-slate-200 py-2 border-0 focus:border-0 rounded-md"
>
  <option value="">Option</option>
  <option value="change-status">
    {row.status === "Open" ? "Change to Closed" : "Change to Open"}
  </option>
  <option value="edit">Edit</option>
  <option value="duplicate">Duplicate</option>
</select>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesLogTable;
