import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import Result from './pages/Result';
import AuthCallback from './pages/AuthCallback';
import Tests from './pages/Tests';
import MyResults from './pages/MyResults';
import ResultDetail from './pages/ResultDetail';
import Share from './pages/Share'; // Import Share page
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tests" element={<Tests />} />
      <Route path="/test" element={<Test />} />
      <Route path="/result" element={<Result />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/my/results" element={<MyResults />} />
      <Route path="/my/results/:id" element={<ResultDetail />} />
      <Route path="/share/:id" element={<Share />} /> {/* Add Share route */}
    </Routes>
  );
}

export default App;