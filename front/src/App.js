import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Sidebar from "./components/sidebar/SideBar";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Navbar from "./components/navbar/Navbar";
import axios from 'axios'
import UserGrid from "./components/usercomponents/UserGrid";
import UserPage from "./components/usercomponents/UserPage";
import User from "./components/usercomponents/User";
import LoginForm from "./components/login/LoginForm";
import RegisterForm from "./components/Register/RegisterForm";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [showRegister, setShowRegister] = useState(false)


  useEffect(() => {
    // axios.get("http://127.0.0.1:8000/users/get").then((data) => { console.log(data) })
    return () => {
    };
  }, []); // Empty dependency array means the effect only runs once on mount


  // const addUser = () => {
  //   axios.post("http://127.0.0.1:8000/users/store", 
  //    user
  //   ,
  //   ).then((data) => { console.log(data) })
  // }


  
 

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content page">
            <Navbar  setIsSidebar={setIsSidebar} />

            <Routes>
            <Route path="/users" element={<User   showRegister={showRegister} />} />
            <Route path="/user" element={<UserPage/>} />
            <Route path="/login" element={<LoginForm  />} />
            <Route path="/register" element={<RegisterForm  />} />


            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
