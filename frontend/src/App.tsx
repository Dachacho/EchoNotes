import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
