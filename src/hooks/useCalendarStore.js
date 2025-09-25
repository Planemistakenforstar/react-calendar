import { useSelector } from "react-redux";
import { onSetActiveEvent } from "../store";
import { useDispatch } from "react-redux";

export const useCalendarStore = () => {
    const {events, activeEvent} = useSelector( state => state.calendar);
     const dispatch = useDispatch();

     const setActiveEvent = ( calendarEvent )=>{
          dispatch (onSetActiveEvent(calendarEvent));
     }


   return {
        activeEvent,
        events,
        setActiveEvent
   }
}