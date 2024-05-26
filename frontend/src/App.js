import "./styles.css";
import styled from "styled-components";
import { CssBaseline } from "@mui/material";
import ForceGraph from "./components/ForceGraph";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { Navigate } from "react-router-dom";
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import {useAuthContext} from './hooks/useAuthContext';

const Main = styled("main")`
  display: flex;
  height: 100vh;
`;

export default function App() {
  const {user} = useAuthContext();

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={!user ? <Signup/> : <Navigate to="/"/>} />
          <Route path="/login" element={!user ? <Login/> : <Navigate to="/"/>} />
          <Route path="/force" element={<ForceGraph />} />
        </Routes>
      </div>
    </Router>
  );
}