import React  , {createContext, useContext, useState} from 'react'
// import { surveys } from '../assets/surveys';


const stateContext = createContext({
  currentUser : {},
  userToken : null,
  setCurrentUser : () => {},
  setUserToken : () => {},
  surveysList : [],
  setSurveysList : () => {},
});



export const ContextProvider = ({children}) => {

  const [currentUser, setCurrentUser] = useState(() => {
    const storedUser = localStorage.getItem('currentUser');
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('userToken') || null;
  });

  const [surveysList , setSurveysList] = useState([]);

  return (
    <stateContext.Provider value={{
      currentUser , setCurrentUser,
      userToken , setUserToken,
      surveysList, setSurveysList
    }}>
      {children}
    </stateContext.Provider>
  )
}


// export default useStateContext = () => useContext(stateContext);
export const useStateContext = () => useContext(stateContext);

