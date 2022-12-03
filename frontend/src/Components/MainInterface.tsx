import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './MainInterface.css'
import { FC } from 'react';
import { TypeEvents } from '../App';

interface IMainInterface {
    events : TypeEvents[];
    
}

const MainInterface:FC<IMainInterface> = ( { events }) => {
    return ( 
        <div id="main-interface">
            <FullCalendar
                plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                initialView= "timeGridWeek"
                events={events}
                headerToolbar={{
                center: 'dayGridMonth,timeGridWeek',
                }}
            /> 


        </div>
     );
}

export default MainInterface;