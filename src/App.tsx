import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Summarize from "./pages/Summarize";
import Signup from "./pages/Signup";
import Summary from "./pages/Summary";
import { useAuth } from "./hooks/useAuth";
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
      <Routes>
        <Route path="/" element={<Navigate to="summarize" />} />
        <Route path="/summarize" Component={Summarize} />
        <Route path="/summary" Component={Summary} />
        <Route path="/*" element={<Navigate to="summarize" />} />
      </Routes>
    </Router>
  );
}

export default App;
