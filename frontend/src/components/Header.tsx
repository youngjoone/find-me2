import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme
import { Button } from './ui/Button'; // Import Button

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex items-center justify-between p-4 border-b border-border bg-background text-foreground">
      <Link to="/" className="text-2xl font-bold">
        find-me
      </Link>
      <nav className="flex items-center space-x-4">
        <Link to="/tests" className="hover:text-primary">테스트</Link>
        <Link to="/my/results" className="hover:text-primary">내 결과</Link>
        <Button variant="ghost" size="sm" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </Button>
      </nav>
    </header>
  );
};

export default Header;
