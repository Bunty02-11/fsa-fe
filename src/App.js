import { useState, useEffect } from "react";
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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-js-loader";

function App() {
  const navigate = useNavigate();

  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // Set isLoggedIn based on token presence (truthy or falsy)
    setIsAuthenticated(!!token);
  }

  // Call checkLoginStatus on component mount to handle initial state
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLogin = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseurl}/api/auth/login`, { email, password });
      const token = response.data.token.token;
      localStorage.setItem("token", token);
      setIsLoggedIn(true);
      navigate("/dashboard", { replace: true });
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (email, phone, organization, password) => {
    const body = { email, phone, organization, password };
    setLoading(true);
    try {
      const response = await axios.post(`${baseurl}/api/auth/register`, body);
      toast.success('Registered Successfully');
      setEmail('');
      setPhone('');
      setOrganization('');
      setPassword('');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Registration Failed');
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  return (
    <>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ToastContainer />
          {!isLoggedIn ? (
            <>
              <Login handleLogin={handleLogin} handleRegistration={handleRegistration} />
              {loading && (
                <div className="loader-container">
                  <Loader type="box-rectangular" bgColor={"#43ce9e"} color={'#FFFFFF'} title={"Loading"} size={100} />
                </div>
              )}
            </>
          ) : (
            <div className="app">
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} handleLogout={handleLogout} />
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
          )}
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  );
}
export default App;
