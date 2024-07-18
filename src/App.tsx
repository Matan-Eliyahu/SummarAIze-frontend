import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./pages/Signup/Signup";
import Results from "./pages/Results/Results";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header/Header";
import Settings from "./pages/Settings/Settings";
function App() {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/signup" Component={Signup} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" />} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/settings" Component={Settings} />
        <Route path="/summary" Component={Results} />
        <Route path="/*" element={<Navigate to="dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;
