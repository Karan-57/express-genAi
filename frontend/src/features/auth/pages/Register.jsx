import '../auth.form.scss'

import { useNavigate, Link } from 'react-router';
import Loading from '../../loading/Loading';
import {useAuth} from '../hooks/useAuth';
import { useState } from 'react';


const Register = () => {
  const {handleRegister, loading} = useAuth();
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e)=>{
    e.preventDefault();
    setError("");
    try{
    await handleRegister({email, username, password});
    navigate('/');
    }catch(err){
      setError(err.response?.data?.message || "register failed");
    }
  };

  if(loading){
    return(
      <main>
        <Loading/>
      </main>
    )
  }

  return (
    <main>
      <div className="form-container">
        <h1>Register</h1>
        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
            onChange={(e)=>{
              setUsername(e.target.value);
            }}
            type="text" id="username" name="username" placeholder="Enter username" />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
            onChange={(e)=>{
              setEmail(e.target.value);
            }}
            type="email" id="email" name="email" placeholder="Enter email address" />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
            onChange={(e)=>{
              setPassword(e.target.value);
            }}
            type="password" id="password" name="password" placeholder="Enter password" />
          </div>

          {error && (
            <p style={{color: "#ef4444"}}>
                {error}
            </p>
          )}

          <button className="button primary-button" >Register</button>
        </form>
        <p>Already have an account? <Link to={'/login'}>Login</Link></p>
      </div>
    </main>
  )
}

export default Register
