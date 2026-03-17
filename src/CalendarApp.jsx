import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./router";
import { Provider } from "react-redux";
import { store } from "./store";
import { useEffect } from "react";

export const CalendarApp = () => {

useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('App mounted - token exists:', !!token);
}, []);

  return (
    <>
    <Provider store={ store }>
       <BrowserRouter>
          <AppRouter />
      </BrowserRouter>
    </Provider>
    </>
  )
}