import React, { useState } from 'react';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from '@syncfusion/ej2-react-kanban';
import { kanbanGrid } from '../data/dummy';
import { Header } from '../components';

// Sample initial Kanban data, replace with your current data
const initialKanbanData = [
  {
    Id: '1',
    Title: 'Task - 1',
    Status: 'Open',
    Summary: 'Analyze requirements from customer.',
  },
  {
    Id: '2',
    Title: 'Task - 2',
    Status: 'InProgress',
    Summary: 'Develop backend services.',
  },
];

const Trello = () => {
  const [kanbanData, setKanbanData] = useState(initialKanbanData);

  const [newTask, setNewTask] = useState({
    Title: '',
    Summary: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const addNewTask = (e) => {
    e.preventDefault(); // Prevent default form behavior

    // Generating a unique ID for the task
    const generatedId = (kanbanData.length + 1).toString();
    const taskWithId = {
      Id: generatedId,
      ...newTask,
      Status: 'Open', // Status is always "Open" for new tasks
    };

    setKanbanData((prev) => [...prev, taskWithId]); // Add to Kanban data
    setNewTask({
      Title: '',
      Summary: '',
    }); // Resetting form fields
  };

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="App" title="To-Do Board" />

      <form onSubmit={addNewTask} className="flex flex-col gap-4">
        <input
          type="text"
          name="Title"
          placeholder="Task Title"
          value={newTask.Title}
          onChange={handleInputChange}
          required
        />
        <textarea
          name="Summary"
          placeholder="Task Summary"
          value={newTask.Summary}
          onChange={handleInputChange}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add Task
        </button>
      </form>

      <KanbanComponent
        id="kanban"
        dataSource={kanbanData}
        cardSettings={{ contentField: 'Summary', headerField: 'Title' }}
        keyField="Status"
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
