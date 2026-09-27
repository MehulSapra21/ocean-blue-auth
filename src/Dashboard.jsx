import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check our manual localStorage to see if a user is logged in
    const storedUser = localStorage.getItem('currentUser');
    
    if (!storedUser) {
      navigate('/'); // Kick back to login if not found
    } else {
      setUserEmail(storedUser);
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear the manual local storage on logout
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  if (!userEmail) return null; 

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <h2 className="ocean-blue-text">Dashboard</h2>
        <button onClick={handleLogout} className="btn logout-btn">Logout</button>
      </nav>
      <div className="dashboard-content">
        <h1>Welcome Back!</h1>
        <p>Logged in via custom table as: <span className="ocean-blue-text">{userEmail}</span></p>
      </div>
    </div>
  );
}