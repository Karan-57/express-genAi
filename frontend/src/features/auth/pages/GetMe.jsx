import '../../../styles/button.style.scss'

import { useContext } from 'react';
import Loading from '../../loading/Loading';
import {useAuth} from '../hooks/useAuth'
import {AuthContext} from '../auth.context'
const GetMe = () => {
  const context = useContext(AuthContext);
  const [user] = context;


  const {loading, handleGetme } = useAuth();
  
  const submitHandler = async()=>{
    await handleGetme();
  }

  if(loading){
    return (
        <main>
            <Loading/>
        </main>
    )
  }

  return (
    <main>
        {user
        ?
        <div className='user-container'>
          <h1>{user.username}</h1>
          <h3>{user.email}</h3>
          <h4>{user.id}</h4>
        </div>
        :
        <button onClick={()=>{
          submitHandler();
        }}>Get Me</button>}
    </main>
  )
}

export default GetMe
