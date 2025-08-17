import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
}

export default App;