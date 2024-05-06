import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Navbar from "./components/common/Navbar.jsx"

function App() {
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex-col flex font-inter">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact  />} /> */}
      </Routes>
    </div>
  );
}

export default App;
