import React, { useEffect, useState } from 'react'
import axios from 'axios';
import UserModal from '../../Modals/UserModal';
import { Button } from '@mui/base';
import UserGrid from './UserGrid';
import { useNavigate } from 'react-router-dom';
import AccessForbidden from './AccessForbidden';


export default function User(props) {


    const [user, setUser] = useState({
        name: "",
        email: "",
        password: ""
    })
    const navigate = useNavigate();

    const [usersList, setUsersList] = useState([])
    const [token, setToken] = useState("");




    useEffect(() => {

        getUsersList();

        let token = window.localStorage.getItem("token");
        setToken(token)

        // axios.get("http://127.0.0.1:8000/users/get").then((data) => { console.log(data) })

        return () => {
        };
    }, [user]); // Empty dependency array means the effect only runs once on mount





    const getUsersList = () => {
        let token2 = window.localStorage.getItem("token");
        
        if(token2){
            token2 = JSON.parse(token2)
            token2 = token2['token']
    
            axios.get('http://127.0.0.1:8000/users/get', { headers: { Authorization: `Bearer ${token2}` } }).then((data) => {
                setUsersList(data)
                console.log(usersList);
            }).catch(function (error) {
                if (error) {
                     <AccessForbidden/>
                }
            })
        }
        else{
            navigate("/login")
        }
       
    }

    return (
        <div>
            {/* <button className='btn btn-primary' onClick={() => openModal()}>Add User</button> */}


            <UserGrid token={token} data={usersList}
            />
        </div>
    )
}
