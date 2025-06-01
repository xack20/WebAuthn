// src/components/WelcomePage.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is logged in
    const userInfo = localStorage.getItem('user');
    if (!userInfo) {
      navigate('/login');
    } else {
      setUser(JSON.parse(userInfo));
    }
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };
  
  if (!user) return null;
  
  return (
    <div className="black-80 tc">
      <h1>Welcome</h1>
      <h2>{user.username}</h2>
      <p>You've successfully authenticated with WebAuthn!</p>
      <button 
        className="ba bw1 mv2 f6 no-underline br-pill ph3 pv2 dib white b--purple bg-purple"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default WelcomePage;
