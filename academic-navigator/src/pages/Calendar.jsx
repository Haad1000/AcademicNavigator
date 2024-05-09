import React, { useState, useEffect } from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';
import { Header } from '../components';
import axios from 'axios';

// const scheduleData = [
//   {
//     Id: 1,
//     Subject: '319 Demo',
//     Location: 'Space Center USA',
//     StartTime: '2024-05-09T18:30:00.000Z',
//     EndTime: '2024-05-09T19:00:00.000Z',
//   },
//   {
//     Id: 2,
//     Subject: 'Blah',
//     Location: 'Newyork City',
//     StartTime: '2024-05-09T12:30:00.000Z',
//     EndTime: '2024-05-09T14:30:00.000Z',
//   },
//   {
//     Id: 3,
//     Subject: 'I am DONE',
//     Location: 'Space Center USA',
//     StartTime: '2024-05-09T20:00:00.000Z',
//     EndTime: '2024-05-09T21:00:00.000Z',
//   }
// ]

const Calendar = () => {
  const [scheduleData, setScheduleData] = useState([]);
  const [newEvent, setNewEvent] = useState({
    Subject: '',
    Location: '',
    StartTime: '',
    EndTime: '',
  });
  const userID = localStorage.getItem("user_Id");

  const fetchCalendarData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:4000/events/${userID}`);
      setScheduleData(response.data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    }
  };

  useEffect(() => {
    fetchCalendarData(); // Fetch calendar data when the component mounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const addNewEvent = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `http://127.0.0.1:4000/events/add/${userID}`,
        newEvent // POST request data
      );

      if (response.status === 201) {
        fetchCalendarData(); // Refresh calendar data after adding new event
        setNewEvent({
          Subject: '',
          Location: '',
          StartTime: '',
          EndTime: '',
        }); // Reset form after successful submission
      }
    } catch (error) {
      console.error('Error adding new event:', error);
    }
  };

  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category='App' title='Calendar' />
      <ScheduleComponent
      height='650px'
      eventSettings={{ dataSource: scheduleData }}>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
      <form onSubmit={addNewEvent} className='mt-10'>
        <h3 className='text-lg font-semibold'>Add New Event</h3>
        
        <div className='flex flex-col my-2'>
          <label htmlFor='Subject' className='mb-2'>Subject</label>
          <input
            type='text'
            id='Subject'
            name='Subject'
            value={newEvent.Subject}
            onChange={handleInputChange}
            required
            className='p-2 border border-gray-300 rounded-md'
          />
        </div>
        
        <div className='flex flex-col my-2'>
          <label htmlFor='Location' className='mb-2'>Location</label>
          <input
            type='text'
            id='Location'
            name='Location'
            value={newEvent.Location}
            onChange={handleInputChange}
            required
            className='p-2 border border-gray-300 rounded-md'
          />
        </div>
        
        <div className='flex flex-col my-2'>
          <label htmlFor='StartTime' className='mb-2'>Start Time (ISO Format)</label>
          <input
            type='datetime-local'
            id='StartTime'
            name='StartTime'
            value={newEvent.StartTime}
            onChange={handleInputChange}
            required
            className='p-2 border border-gray-300 rounded-md'
          />
        </div>
        
        <div className='flex flex-col my-2'>
          <label htmlFor='EndTime' className='mb-2'>End Time (ISO Format)</label>
          <input
            type='datetime-local'
            id='EndTime'
            name='EndTime'
            value={newEvent.EndTime}
            onChange={handleInputChange}
            required
            className='p-2 border border-gray-300 rounded-md'
          />
        </div>

        <button
          type='submit'
          className='bg-blue-500 text-white p-2 rounded-md shadow-md hover:bg-blue-600'
        >
          Add Event
        </button>
      </form>
    </div>
  )
}

export default Calendar