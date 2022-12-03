import FullCalendar from '@fullcalendar/react'; // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './MainInterface.css';
import { FC, useState } from 'react';
import { TypeEvents } from '../App';

// interface IMainInterface {
//     events : TypeEvents[];
//
// }

const MainInterface: FC = () => {
  const [events, setEvents] = useState<TypeEvents[]>([
    { title: 'event 1', start: '2022-12-02T10:00:00', end: '2022-12-02T12:00:00' },
    { title: 'event 2', date: '2022-12-02' },
  ]);

  return (
    <div id='main-interface'>
      <FullCalendar
        plugins={ [dayGridPlugin, timeGridPlugin, interactionPlugin] }
        initialView='timeGridWeek'
        events={ events }
        headerToolbar={ {
          center: 'dayGridMonth,timeGridWeek',
        } }
        /> 


        </div>
     );
}

export default MainInterface;