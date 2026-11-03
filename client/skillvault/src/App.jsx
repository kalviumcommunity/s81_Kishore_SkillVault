import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Components/Home";
import GetStarted from "./Components/Getstarted";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import Profile from "./Components/Profile";
import Courses from "./Components/Courses";
import Dashboard from "./Components/Dashboard";
import IntroToReact from "./Components/IntroToReact";

function Navigation() {
  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link to="/" className="text-2xl font-bold tracking-tight text-blue-400 hover:text-blue-300">
        SkillVault
      </Link>
      <div className="flex space-x-6 text-sm font-medium">
        <Link to="/" className="hover:text-blue-400 transition">Home</Link>
        <Link to="/courses" className="hover:text-blue-400 transition">Courses</Link>
        <Link to="/dashboard" className="hover:text-blue-400 transition">Dashboard</Link>
        <Link to="/profile" className="hover:text-blue-400 transition">Profile</Link>
        <Link to="/login" className="hover:text-blue-400 transition">Login</Link>
        <Link to="/signup" className="bg-blue-600 px-3 py-1.5 rounded hover:bg-blue-700 transition">Sign Up</Link>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/getstarted" element={<GetStarted />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/introtoreact" element={<IntroToReact />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
