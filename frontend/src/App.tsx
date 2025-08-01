import { Routes, Route, BrowserRouter } from "react-router-dom";

import "./App.css";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "./Dashboard";
import Workspace from "./Workspace";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/workspace/:id" element={<Workspace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
