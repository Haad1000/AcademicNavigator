import React, { useState, useEffect } from "react";
import {
  KanbanComponent,
  ColumnsDirective,
  ColumnDirective,
} from "@syncfusion/ej2-react-kanban";
import { Header } from "../components";
import axios from "axios";

// Sample initial Kanban data, replace with your current data
// const initialKanbanData = [
//   {
//     Id: "1",
//     Title: "Task - 1",
//     Status: "Open",
//     description: "Analyze requirements from customer.",
//   },
//   {
//     Id: "2",
//     Title: "Task - 2",
//     Status: "InProgress",
//     description: "Develop backend services.",
//   },
// ];

// Sample initial KanbanGrid data, Will keep this
const kanbanGrid = [
  { headerText: "To Do", keyField: "Open", allowToggle: true },

  { headerText: "In Progress", keyField: "InProgress", allowToggle: true },

  { headerText: "Done", keyField: "Close", allowToggle: true },
];

const Trello = () => {
  const [kanbanData, setKanbanData] = useState([]);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const userID = localStorage.getItem("user_Id");

  const fetchKanbanData = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:4000/todos/get/${userID}`
      );

      setKanbanData(response.data);
    } catch (error) {
      console.error("Error fetching Kanban data: ", error);
    }
  };

  useEffect(() => {
    fetchKanbanData();
  }, [userID]);

  const [newTask, setNewTask] = useState({
    Title: "",
    description: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  // const addNewTask = (e) => {
  //   e.preventDefault(); // Prevent default form behavior
  const addNewTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:4000/todos/add/${userID}`,
        {
          Title: newTask.Title,
          description: newTask.description,
        }
      );

      if (response.status === 201) {
        fetchKanbanData();
        setNewTask({
          Title: "",
          description: "",
        });
      }
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log(taskId);
      const response = await axios.delete(`http://127.0.0.1:4000/todos/delete/${taskId}`);
      if (response.status === 200) {
        fetchKanbanData(); // Re-fetch to ensure synchronization
      } else {
        console.error("Failed to delete task:", response.status);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="To-Do Board" />

      <form
        onSubmit={addNewTask}
        className="flex flex-col gap-4 p-5 pb-8 bg-white rounded-xl shadow-lg w-full"
      >
        <div className="flex flex-col">
          <label htmlFor="Title" className="mb-2 text-gray-600 text-sm">
            Task Title
          </label>
          <input
            type="text"
            id="Title"
            name="Title"
            placeholder="Task Title"
            value={newTask.Title}
            onChange={handleInputChange}
            required
            className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="description" className="mb-2 text-gray-600 text-sm">
            Task Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Task description"
            value={newTask.description}
            onChange={handleInputChange}
            required
            className="p-2 h-28 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600 transition duration-150 ease-in-out"
        >
          Add Task
        </button>
      </form>

      <KanbanComponent
        id="kanban"
        dataSource={kanbanData}
        cardSettings={{ contentField: "description", headerField: "Title" }}
        keyField="Status"
        dialogSettings={{ showDelete: true, }}
        removeUrl="http://127.0.0.1:4000/todos/delete"      
        dialogOpen={(e) => {
          if (e.data && e.data.hasOwnProperty("Id")) {
            const taskId = e.data.Id;
            console.log("Task ID when dialog opens:", taskId);
            setTaskIdToDelete(taskId); // Store the task ID in state
          }
        }}
        actionComplete={(e) => {
          if (e.requestType === "cardRemoved" && taskIdToDelete) {
            deleteTask(taskIdToDelete); // Use the stored task ID for deletion
          }
        }}
      >
        <ColumnsDirective>
          {kanbanGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
      </KanbanComponent>
    </div>
  );
};

export default Trello;
