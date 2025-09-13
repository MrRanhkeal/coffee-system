



import React, { useState } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'
import './Calendar.css'

function CustomCalendar() {
    const [date, setDate] = useState(new Date())

    const onChange = (newDate) => {
        setDate(newDate)
    }

    return (
        <div className="calendar-container">
            <Calendar
                onChange={onChange}
                value={date}
                className="custom-calendar"
                tileClassName="calendar-tile"
                height="400px"
            />
            {/* Calendar styles */}
        </div>
    )
}

export default CustomCalendar;

// import React, { useState } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css'; // Imports default styling

// function CustomCalendar() {
//     // The 'value' state will hold the selected date.
//     // We initialize it with the current date.
//     const [value, onChange] = useState(new Date());

//     return (
//         <div>
//             <h1>My Calendar</h1>
//             <Calendar
//                 onChange={onChange} // A function that is called when the user clicks a date
//                 value={value}      // The currently selected date
//             />
//             <p>
//                 <b>Selected Date:</b> {value.toDateString()}
//             </p>
//         </div>
//     );
// }

// export default CustomCalendar;