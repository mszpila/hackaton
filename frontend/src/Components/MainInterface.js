import FullCalendar from '@fullcalendar/react' // must go before plugins
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import './MainInterface.css'
function MainInterface() {
    return ( 
        <div id="main-interface">
            <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        initialView="dayGridMonth"
        events={[
          { title: 'event 1', start: '2022-12-02T10:00:00', end: '2022-12-02T12:00:00' },
          { title: 'event 2', date: '2022-12-02' }
        ]}
        headerToolbar={{
          center: 'dayGridMonth,timeGridWeek',
        }}
      /> 
        </div>
     );
}

export default MainInterface;