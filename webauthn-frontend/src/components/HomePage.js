// src/components/HomePage.js
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="measure center">
      <h1 className="f2 f1-l fw2 mb0 lh-title">WebAuthn Example</h1>
      <div className="mv2">
        <h2 className="fw1 f3 mt3 mb4 mr2 dib">New User:</h2>
        <Link className="ba bw1 f6 no-underline br-pill ph3 pv2 mb2 dib white bg-hot-pink" to="/register">Register</Link>
      </div>
      <div className="mv2">
        <h2 className="fw1 f3 mt3 mb4 mr2 dib">Existing Users:</h2>
        <Link className="ba bw1 f6 no-underline br-pill ph3 pv2 mb2 dib white bg-purple" to="/login">Sign In</Link>
      </div>
    </div>
  );
};

export default HomePage;
