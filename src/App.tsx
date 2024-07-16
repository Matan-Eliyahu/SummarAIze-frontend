import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home/Home";
import Summarize from "./pages/Summarize/Summarize";
import Signup from "./pages/Signup/Signup";
import Results from "./pages/Results/Results";
import { useAuth } from "./hooks/useAuth";
import Header from "./components/Header/Header";
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
        <Route path="/" element={<Navigate to="summarize" />} />
        <Route path="/summarize" Component={Summarize} />
        <Route path="/summary" Component={Results} />
        <Route path="/*" element={<Navigate to="summarize" />} />
      </Routes>
    </Router>
  );
}

export default App;
