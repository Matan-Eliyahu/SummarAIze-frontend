import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Signup from "./pages/Signup/Signup";
import File from "./pages/File/File";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header/Header";
import Settings from "./pages/Settings/Settings";
import Account from "./pages/Account/Account";
import { StoreProvider } from "./context/StoreContext";

function App() {
  const { auth } = useAuth();

  if (!auth) {
    return (
      <Router>
        <Routes>
          <Route path="/" Component={Login} />
          <Route path="/signup" Component={Signup} />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <StoreProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="dashboard" />} />
          <Route path="/dashboard" Component={Dashboard} />
          <Route path="/dashboard/settings" Component={Settings} />
          <Route path="/dashboard/account" Component={Account} />
          <Route path="/dashboard/:fileName" Component={File} />
          <Route path="/*" element={<Navigate to="dashboard" />} />
        </Routes>
      </StoreProvider>
    </Router>
  );
}

export default App;
