import { Outdent } from 'lucide-react'
import React from 'react'
import { Outlet  , Navigate} from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider.jsx'


const GuestLayout = () => {

  const { userToken} = useStateContext();

  if ( userToken ) {
    return <Navigate to="/" />
  }

  return (
    <div>

      <Outlet />

    </div>
  )
}

export default GuestLayout
