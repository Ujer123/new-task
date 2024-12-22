import { useState, useEffect } from "react";

export default function NewTaskModal({ isOpen, onClose, existingTask, onSave }) {
  // If `existingTask` is provided, it's an update; otherwise, it's a new task.
  const isUpdate = !!existingTask;

  const [taskData, setTaskData] = useState(() => {
    // Initialize time fields to prevent undefined issues
    const defaultTime = { hours: "12", minutes: "00", period: "AM" };
    const time = existingTask?.time || defaultTime;

    return {
      entity: existingTask?.entity || "",
      date: existingTask?.date || "",
      time: {
        hours: String(time.hours), // Ensure it's a string
        minutes: String(time.minutes), // Ensure it's a string
        period: String(time.period), // Ensure it's a string
      },
      task: existingTask?.task || "Call",
      person: existingTask?.person || "",
      notes: existingTask?.notes || "",
      status: existingTask?.status || "Open",
    };
  });


  useEffect(() => {
    if (existingTask) {
      const time = existingTask.time || { hours: "12", minutes: "00", period: "AM" };
      setTaskData({
        entity: existingTask.entity || "",
        date: existingTask.date || "",
        time: {
          hours: String(time.hours),
          minutes: String(time.minutes),
          period: String(time.period),
        },
        task: existingTask.task || "Call",
        person: existingTask.person || "",
        notes: existingTask.notes || "",
        status: existingTask.status || "Open",
      });
    }
  }, [existingTask]);


  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({
      ...prev,
      [name]: value || "", // Directly assign the value
    }));
  };
  

  const handleTimeChange = (field, value) => {
    setTaskData((prev) => ({
      ...prev,
      time: {
        ...prev.time,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isUpdate
        ? `https://task-backend-tfp7.onrender.com/products/${existingTask.id}` // PUT URL
        : "https://task-backend-tfp7.onrender.com/products"; // POST URL
      const method = isUpdate ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          entity: taskData.entity,
          date: taskData.date,
          time: `${taskData.time.hours} ${taskData.time.period}`,
          task: taskData.task,
          person: taskData.person,
          notes: taskData.notes || "",
          status: taskData.status,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(isUpdate ? "Task updated successfully!" : "Task created successfully!");
        if (typeof onSave === 'function') {
          onSave(result); // Callback to refresh parent component or close modal
        } else {
          console.error("onSave is not a function");
        }
        onClose();
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error("Error submitting task:", error);
      alert("An error occurred while submitting the task.");
    }
  }; 

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-[500px] rounded-lg shadow-lg p-6">
        <header className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold">{isUpdate ? "Edit Task" : "New Task"}</h2>
          <div className="flex space-x-2 bg-slate-200">
  <button
    className={`bg-orange-500 text-white py-2 px-4 ${taskData.status === "Open" ? "font-bold" : ""}`}
    onClick={() => setTaskData({ ...taskData, status: "Open" })}
  >
    Open
  </button>
  <button
    className={`py-2 px-4 ${taskData.status === "Close" ? "font-bold" : ""}`}
    onClick={() => setTaskData({ ...taskData, status: "Close" })}
  >
    Close
  </button>
</div>


        </header>

        {/* Task Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
         
            {/* Entity Name */}
            <input
              type="text"
              name="entity"
              value={taskData.entity}
              onChange={handleInputChange}
              placeholder="Entity name"
              className="w-full border px-3 py-3 bg-slate-100 placeholder:text-black focus:ring focus:ring-sky-300"
            />

            {/* Date & Time */}
            <div className="flex space-x-4">
              <input
                type="date"
                name="date"
                value={taskData.date || ""}
                onChange={handleInputChange}
                className="flex-1 border px-3 py-3 focus:ring focus:ring-sky-300"
              />
              <div className="flex items-center space-x-2 bg-gray-100 p-2 rounded-md shadow-md">
                <select
                  name="hours"
                  value={taskData.time.hours || "12"}
                  onChange={(e) => handleTimeChange("hours", e.target.value)}
                  className="border-none bg-transparent text-center appearance-none focus:outline-none"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={String(i + 1).padStart(2, "0")}>
                      {String(i + 1).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <span>:</span>
                <select
                  name="minutes"
                  value={taskData.time.minutes || "00"}
                  onChange={(e) => handleTimeChange("minutes", e.target.value)}
                  className="border-none bg-transparent text-center appearance-none focus:outline-none"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, "0")}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
                <select
                  name="period"
                  value={taskData.time.period || "AM"}
                  onChange={(e) => handleTimeChange("period", e.target.value)}
                  className="border-none bg-transparent text-center appearance-none focus:outline-none"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              </div>
            </div>

            {/* Task Type */}
            <select
  name="task"
  value={taskData.task}
  onChange={handleInputChange}
  className="w-full border rounded-md px-3 py-3 focus:ring focus:ring-sky-300"
>
  <option value="Call">🕻 Call</option>
  <option value="Meeting">📅 Meeting</option>
  <option value="Video Call">✉️ Video Call</option>
</select>



            {/* person Person */}
            <input
              type="text"
              name="person"
              value={taskData.person}
              onChange={handleInputChange}
              placeholder="person person"
              className="w-full border bg-slate-100 placeholder:text-black px-3 text-sm py-3 focus:ring focus:ring-sky-300"
            />

            {/* Notes */}
            <textarea
              name="notes"
              value={taskData.notes || ""}
              onChange={handleInputChange}
              placeholder="Note (optional)"
              className="w-full border bg-slate-100 placeholder:text-black px-3 text-sm py-3 focus:ring focus:ring-sky-300"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              className="px-4 py-2 text-black rounded-md hover:bg-gray-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-4 px-10 bg-blue-800 text-white hover:bg-blue-700"
            >
              {isUpdate ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
