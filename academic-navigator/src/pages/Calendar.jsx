import React, { useState } from 'react';
import { ScheduleComponent, Day, Week, WorkWeek, Month, Agenda, Inject, Resize, DragAndDrop } from '@syncfusion/ej2-react-schedule';

// import { scheduleData } from '../data/dummy';
import { Header } from '../components';

const scheduleData = [
  {
    Id: 1,
    Subject: '319 Demo',
    Location: 'Space Center USA',
    StartTime: '2024-05-09T18:30:00.000Z',
    EndTime: '2024-05-09T19:00:00.000Z',
  },
  {
    Id: 2,
    Subject: 'Blah',
    Location: 'Newyork City',
    StartTime: '2024-05-09T12:30:00.000Z',
    EndTime: '2024-05-09T14:30:00.000Z',
  },
  {
    Id: 3,
    Subject: 'I am DONE',
    Location: 'Space Center USA',
    StartTime: '2024-05-09T20:00:00.000Z',
    EndTime: '2024-05-09T21:00:00.000Z',
  }
]

const Calendar = () => {
  return (
    <div className='m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl'>
      <Header category='App' title='Calendar' />
      <ScheduleComponent
      height='650px'
      eventSettings={{ dataSource: scheduleData }}>
        <Inject services={[Day, Week, WorkWeek, Month, Agenda, Resize, DragAndDrop]} />
      </ScheduleComponent>
    </div>
  )
}

export default Calendar