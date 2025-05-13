import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import VoiceAgent from "./pages/VoiceAgent";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/voice" element={<VoiceAgent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
