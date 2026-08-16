import {useAuth} from '../hooks/useAuth';
import Loading from '../../loading/Loading';
import { Navigate } from 'react-router';

const Protected = ({children}) => {
  const {user, loading} = useAuth();

  if (loading) {
    return <main>loading...</main>;
    }

  if(!user){ 

    return <Navigate to='/login'/>
  }

  return (
    children
  )
}

export default Protected
