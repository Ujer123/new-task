"use client";
import { useState, useEffect } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import { CiCirclePlus } from "react-icons/ci";

const SalesLogTable = ({openModal}) => {
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
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
const [selectedProduct, setSelectedProduct] = useState(null); // State for the product being edited
const [noteInput, setNoteInput] = useState(""); 

const handleNotesModal = (productId) => {
  const product = products.find((prod) => prod._id === productId);
  setSelectedProduct(product);
  setNoteInput(product?.notes || ""); // Pre-fill with existing notes
  setIsModalOpen(true); // Open the modal
};


const handleSaveNotes = async () => {
  if (selectedProduct) {
    try {
      const response = await fetch(
        `https://task-backend-tfp7.onrender.com/products/${selectedProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: noteInput }),
        }
      );

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === selectedProduct._id
              ? { ...product, notes: noteInput }
              : product
          )
        );
        setIsModalOpen(false); // Close modal after saving
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

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`https://task-backend-tfp7.onrender.com/products/${productId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        // Remove the deleted product from the local state
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product._id !== productId)
        );
      } else {
        console.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const response = await fetch(`https://task-backend-tfp7.onrender.com/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId ? { ...product, status: newStatus } : product
          )
        );
        setOpenDropdownRow(null); // Close the dropdown after updating
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


  const handleEdit = (row) => {
    openModal(row); // Pass the entire row data to the modal
  };

  const handleDuplicate = async (productId) => {
    console.log("Duplicate Product with ID:", productId);

    try {
        // Fetch the product data using its ID
        const response = await fetch(`https://task-backend-tfp7.onrender.com/products/${productId}`);

        // Check if the response is OK (status code 200-299)
        if (!response.ok) {
            console.error(`Failed to fetch product: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch product: ${response.statusText}`);
        }

        // Attempt to parse JSON response
        const productData = await response.json();

        // Log the productData to verify it's being fetched correctly
        console.log('Fetched product data:', productData);

        // Make a copy of the product data and remove the ID to avoid conflict
        const newProduct = { ...productData, _id: undefined }; // Remove ID

        // Create a new product with the copied data
        const createResponse = await fetch('https://task-backend-tfp7.onrender.com/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
        });

        // Check if the creation request was successful
        if (!createResponse.ok) {
            console.error(`Failed to create product: ${createResponse.status} ${createResponse.statusText}`);
            throw new Error(`Failed to create product: ${createResponse.statusText}`);
        }

        const result = await createResponse.json();

        console.log('Product duplicated successfully:', result);
        alert('Product duplicated successfully!');
    } catch (error) {
        console.error('Error in duplication:', error);
        alert('An error occurred while duplicating the product.');
    }
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
                    className="flex border border-black text-sm font-bold px-4 py-2 rounded-sm ms-5"
                  >
                    <span className="flex text-blue-700 pe-2"><CiCirclePlus size={18}/></span> Add Notes
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
      const newStatus = row.status === "Open" ? "Closed" : "Open";
      handleStatusChange(row._id, newStatus); // Change status to Open/Closed
    }else if (selectedOption === "delete") {
      handleDelete(row._id);  // Delete action
    }
  }}
  value={row.status} 
  className="block w-full bg-slate-200 py-2 border-0 focus:border-0 rounded-md"
>
  <option value="">Option</option>
  <option value="change-status">
    {row.status === "Open" ? "Change to Closed" : "Change to Open"}
  </option>
  <option value="edit">Edit</option>
  <option value="duplicate">Duplicate</option>
  <option value="delete">Delete</option>
</select>

                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {isModalOpen && (
        <div className="modal fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="modal-content w-56 bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold mb-4">
              Add Notes for {selectedProduct?.name}
            </h2>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              rows={5}
              className="border w-full p-2 mb-4"
            />
            <div className="modal-actions flex justify-end gap-2">
              <button
                onClick={handleSaveNotes}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default SalesLogTable;
