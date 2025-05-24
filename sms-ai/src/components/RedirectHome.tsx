import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RedirectHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      // First time visit
      localStorage.setItem('hasVisitedBefore', 'true');
      navigate('/landing');
    } else {
      // Returning user
      navigate('/dashboard');
    }
  }, [navigate]);

  return null;
} 