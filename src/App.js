import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Invoices from "./scenes/invoices";
import Contacts from "./scenes/contacts";
import Bar from "./scenes/bar";
import Form from "./scenes/schemeform";
import Line from "./scenes/line";
import Pie from "./scenes/pie";
import FAQ from "./scenes/faq";
import Geography from "./scenes/geography";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Calendar from "./scenes/calendar/calendar";
import Login from "./scenes/login";
import { baseurl } from "../src/api";
import axios from "axios";
import { ToastContainer ,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const navigate = useNavigate();

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (email, password) => {
    const requestData = {
      email: email,
      password: password,
    };

    try {
      const response = await axios.post(`${baseurl}/api/auth/login`, requestData);
      const token = response.data.token;
      toast.success('Successfully Logged');

      localStorage.setItem('token', token);

      setEmail('');
      setPassword('');
      setIsLoggedIn(true)
      navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Wrong Credentials');
    }
  }

  const handleRegistration = async (email, phone, organization, password) => {
    // console.log(email, phone, organization, password, 'requestdata')
    const body = { email, phone, organization, password }
    // console.log(body)
    try {
      const response = await axios.post(`${baseurl}/api/auth/register`, body);

      toast.success('Registered Successfully');

      // localStorage.setItem('token', token);

      // setEmail('');
      // setPhone('');
      // setOrganization('');
      // setPassword('');
      // setIsLoggedIn(true);
      // navigate('/dashboard');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Registration Failed');
    }
  }



  if (!isLoggedIn) {
    console.log('cliked')
    return (

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Login handleLogin={handleLogin} handleRegistration={handleRegistration} />
      </ThemeProvider>
    );
  }

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main className="content">
              <Topbar setIsSidebar={setIsSidebar} />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/team" element={<Team />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/form" element={<Form />} />
                <Route path="/bar" element={<Bar />} />
                <Route path="/pie" element={<Pie />} />
                <Route path="/line" element={<Line />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/geography" element={<Geography />} />
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
export default App;
