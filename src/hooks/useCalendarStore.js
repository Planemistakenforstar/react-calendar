import { useSelector } from "react-redux";
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent, onLoadEvents } from "../store";
import { useDispatch } from "react-redux";
import calendarApi from "../api/calendarApi";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {
     const {events, activeEvent} = useSelector( state => state.calendar);
     const dispatch = useDispatch();
     const { user } = useSelector(state => state.auth); 

     const setActiveEvent = ( calendarEvent )=>{
          dispatch ( onSetActiveEvent(calendarEvent) );
     }

     const startSavingEvent = async(calendarEvent) => {
          try{
               if(calendarEvent.id){
                    // update
                    await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
                    dispatch(onUpdateEvent({...calendarEvent, user})); 
                    return;
               }
               //create
               const {data} = await calendarApi.post('/events', calendarEvent);
               dispatch(onAddNewEvent({...calendarEvent, id: data.event.id, user}));
               //
          }catch(error){
               console.log(error);
               Swal.fire('Error al guardar', error.response.data.msg, 'error');
          }
     }

     const startdeletingEvent = async() =>{
          // llegar al backend
           try{
               // delete
               await calendarApi.delete(`/events/${activeEvent.id}`);
                 // Only dispatch the Redux action if the API call succeeds
               dispatch(onDeleteEvent());
          }catch(error){
               console.log(error);
               Swal.fire('Error al eliminar', error.response.data.msg, 'error');
          }
     }

     const startLoadingEvents = async()=>{

          try{
               const { data } = await calendarApi.get('/events');
               const events = convertEventsToDateEvents(data.events);
               dispatch(onLoadEvents(events));
          }catch(error){
               console.log(error);
               //
          }
     }
   return {
          // Properties
        activeEvent,
        events,
        hasEventSelected : !!activeEvent,
        //methods
        setActiveEvent,
        startSavingEvent,
        startdeletingEvent,
        startLoadingEvents
   }
}