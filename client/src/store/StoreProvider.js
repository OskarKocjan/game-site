import React, { createContext, useState, useEffect} from 'react';
import axios from "axios"

export const StoreContext = createContext(null);


const StoreProvider = ({children}) => {

    const [userData, setUserData] = useState({})
    const [userJWT, setUserJWT] = useState(null)
    
    useEffect(() => {
        const token = localStorage.getItem("token")
        if(token){
            axios.get('http://localhost:8080/check/auth',{
            headers:{
                "authorization":`Bearer ${token}`,
            }
            }).then(response => {
                console.log(response.data)
                setUserData({
                    auth:true, 
                    nick:(response.data.nick || ""), 
                    description:(response.data.description || ""),
                    isLogged:true
                })

            }).catch(error => {
                console.log(error)
                setUserData({auth:false, nick:"", isLogged:false} )
            })

            setUserJWT(token)
        }
        
    }, [userJWT])


    return(
        <StoreContext.Provider value={
            {
                userData,
                setUserData,
                userJWT,
                setUserJWT
            }
        }>
            {children}
        </StoreContext.Provider>
    )
}


export default StoreProvider;