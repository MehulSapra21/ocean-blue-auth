import { useState } from 'react';
import { supabase } from './supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isLogin) {
        // MANUAL LOGIN: Search the table for a matching email AND password
        const { data, error } = await supabase
          .from('app_users')
          .select('*')
          .eq('email', email)
          .eq('password', password)
          .single(); // Expect exactly one match

        if (error || !data) {
          throw new Error('Invalid email or password.');
        }

        // Save the user's email to the browser to "remember" them
        localStorage.setItem('currentUser', data.email);
        navigate('/dashboard'); 

      } else {
        // MANUAL SIGNUP: Insert the new email and password into the table
        const { data, error } = await supabase
          .from('app_users')
          .insert([{ email: email, password: password }])
          .select();

        if (error) {
          // Handle the "unique" email constraint error nicely
          if (error.code === '23505') throw new Error('Email already exists!');
          throw error;
        }

        // Save the user's email to the browser and login
        localStorage.setItem('currentUser', email);
        navigate('/dashboard');
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h2 className="ocean-blue-text">{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {errorMsg && <p className="error-text">{errorMsg}</p>}
        
        <form onSubmit={handleAuth}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>
        
        <p className="toggle-text">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span className="ocean-blue-text" onClick={() => setIsLogin(!isLogin)} style={{cursor: 'pointer', fontWeight: 'bold'}}>
            {isLogin ? 'Sign up' : 'Login'}
          </span>
        </p>
      </div>
    </div>
  );
}