import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Summarize from "./pages/Summarize";
import Signup from "./pages/Signup";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/summarize" Component={Summarize} />
          <Route path="/signup" Component={Signup} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
