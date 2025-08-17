import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import Result from './pages/Result';
import AuthCallback from './pages/AuthCallback'; // Import AuthCallback page
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
      <Route path="/result" element={<Result />} />
      <Route path="/auth/callback" element={<AuthCallback />} /> // Add AuthCallback route
    </Routes>
  );
}

export default App;