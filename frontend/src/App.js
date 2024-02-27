import "./styles.css";
import styled from "styled-components";
import { CssBaseline } from "@mui/material";
import ForceGraph from "./components/ForceGraph";
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';

const Main = styled("main")`
  display: flex;
  height: 100vh;
`;

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/force" element={<ForceGraph />} />
        </Routes>
      </div>
    </Router>
  );
}