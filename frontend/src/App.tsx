import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Test from './pages/Test';
import Result from './pages/Result';
import AuthCallback from './pages/AuthCallback';
import Tests from './pages/Tests';
import MyResults from './pages/MyResults';
import ResultDetail from './pages/ResultDetail';
import Share from './pages/Share';
import Header from './components/Header'; // Import Header
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider
import './App.css';

function App() {
  return (
    <ThemeProvider> {/* Wrap with ThemeProvider */}
      <div className="min-h-screen bg-background text-foreground"> {/* Apply global background/text colors */}
        <Header /> {/* Add Header */}
        <main className="container mx-auto p-4"> {/* Main content area */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tests" element={<Tests />} />
            <Route path="/test" element={<Test />} />
            <Route path="/result" element={<Result />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/my/results" element={<MyResults />} />
            <Route path="/my/results/:id" element={<ResultDetail />} />
            <Route path="/share/:id" element={<Share />} />
          </Routes>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
