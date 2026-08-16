import '../auth.form.scss'

import { useNavigate,Link } from 'react-router';
import { useState } from 'react';
import {useAuth} from '../hooks/useAuth';
import Loading from '../../loading/Loading';

const Login = () => {

  const {loading, handleLogin} =  useAuth();

  const [email, setemail] = useState("second");
  const [password, setPassword]  = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const submitHandler = async (e)=>{
    e.preventDefault();

    setError("");

    try{
      await handleLogin({email, password});
      navigate('/');
    }catch(err){
      setError(err.response?.data?.message || "Login failed");
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
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
            onChange={(e)=>{
              setemail(e.target.value);
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

          <button className="button primary-button" >Login</button>
        </form>
        <p>Do not have an account? <Link to={'/register'}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login
