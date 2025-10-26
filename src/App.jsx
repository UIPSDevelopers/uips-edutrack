import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";


function App() {
  return (
    <Router>
      <main>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
