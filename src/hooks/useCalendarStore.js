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
        console.log('1. Starting to save event:', calendarEvent);
        
        if(calendarEvent.id){
            console.log('2. Updating existing event with id:', calendarEvent.id);
            await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent);
            dispatch(onUpdateEvent({...calendarEvent, user})); 
            return;
        }
        
        console.log('2. Creating new event');
        console.log('3. Making POST request to /events');
        
        // Make the request and store the full response
        const response = await calendarApi.post('/events', calendarEvent);
        
        console.log('4. Full response object:', response);
        console.log('5. Response data:', response.data);
        console.log('6. Response status:', response.status);
        console.log('7. Response headers:', response.headers);
        
        // Check if response.data exists
        if (!response.data) {
            console.error('8. ERROR: response.data is undefined!');
            console.log('9. Full response:', JSON.stringify(response, null, 2));
            Swal.fire('Error', 'El servidor no devolvió datos', 'error');
            return;
        }
        
        console.log('8. Response.data type:', typeof response.data);
        console.log('9. Response.data keys:', Object.keys(response.data));
        
        // Try to find the ID in different places
        let eventId = null;
        let eventData = null;
        
        // Case 1: response.data.event exists
        if (response.data.event) {
            console.log('10. Found response.data.event');
            eventData = response.data.event;
            eventId = eventData._id || eventData.id;
            console.log('11. eventData:', eventData);
        }
        // Case 2: response.data itself has _id or id
        else if (response.data._id || response.data.id) {
            console.log('10. response.data has direct ID');
            eventData = response.data;
            eventId = response.data._id || response.data.id;
        }
        // Case 3: response.data is an array? (maybe multiple events)
        else if (Array.isArray(response.data)) {
            console.log('10. response.data is an array');
            eventData = response.data[0];
            eventId = eventData?._id || eventData?.id;
        }
        
        console.log('12. Extracted eventId:', eventId);
        console.log('13. Extracted eventData:', eventData);
        
        if (!eventId) {
            console.error('14. ERROR: Could not find ID in response');
            console.log('15. Full response.data:', JSON.stringify(response.data, null, 2));
            Swal.fire('Error', 'No se pudo obtener el ID del evento', 'error');
            return;
        }
        
        const newEvent = {
            ...calendarEvent,
            id: eventId,
            user
        };
        
        console.log('16. Dispatching new event:', newEvent);
        dispatch(onAddNewEvent(newEvent));
        
    }catch(error) {
        console.log('17. CATCH - Error occurred:');
        console.log('18. Error object:', error);
        console.log('19. Error response:', error.response);
        console.log('20. Error message:', error.message);
        console.log('21. Error stack:', error.stack);
        
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log('22. Error response data:', error.response.data);
            console.log('23. Error response status:', error.response.status);
            console.log('24. Error response headers:', error.response.headers);
            Swal.fire('Error', error.response.data?.msg || 'Error del servidor', 'error');
        } else if (error.request) {
            // The request was made but no response was received
            console.log('25. Error request:', error.request);
            Swal.fire('Error', 'No se recibió respuesta del servidor', 'error');
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('26. Error message:', error.message);
            Swal.fire('Error', error.message, 'error');
        }
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