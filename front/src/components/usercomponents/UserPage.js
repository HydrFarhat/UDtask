import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { MdEmail } from 'react-icons/md';
import { BiSolidUser } from 'react-icons/bi'
import axios from 'axios';
import UserModal from '../../Modals/UserModal';
import { useNavigate } from 'react-router-dom';

export default function UserPage(props) {

    const [user, setUser] = useState({

        name: "",
        email: "",
        password: "",

    })

    const navigate = useNavigate();
    const [editUser, setEditUser] = useState(false)
    const [showModal, setShowModal] = useState(false);



    const changeProperty = (property, value) => {
        setUser({ ...JSON.parse(JSON.stringify(user)), [property]: value });
        console.log(user);
    };

    const openModal = () => {
        setShowModal(!showModal);
        console.log(showModal);
    };


    const closeModal = () => {
        setShowModal(false);

            let user = window.localStorage.getItem("user");
                setUser(JSON.parse(user))
        setEditUser(false)
    };

    


    useEffect(() => {

            let token2 = window.localStorage.getItem("token");
            
            if(token2){
                token2 = JSON.parse(token2)
                token2 = token2['token']
        
                axios.get('http://127.0.0.1:8000/users/current', { headers: { Authorization: `Bearer ${token2}` } }).then((data) => {
                    setUser(data.data)    
                window.localStorage.setItem("user", JSON.stringify(data.data));

                }).catch(function (error) {
                    if (error) {
                        navigate("/login")

                    }
                })
            }
            else{
                navigate("/login")
            }
           
        



        // axios.get("http://127.0.0.1:8000/users/get").then((data) => { console.log(data) })
        return () => {
            
        };
    }, []); // Empty dependency array means the effect only runs once on mount

    return (
        <div>
            <div style={{ backgroundColor: "#242f30" }} className="card">
                <div className="card-img">
                    <img src="https://dl.dropbox.com/s/u3j25jx9tkaruap/Webp.net-resizeimage.jpg?raw=1" />
                </div>
                <div className="desc">
                    <BiSolidUser style={{ width: "23px", height: "23px", marginTop: "5px", color: "white" }} />
                    <h6 className="primary-text">{user.name}</h6>
                </div>


                <div className="desc">
                    <MdEmail style={{ width: "23px", height: "23px", color: "white" }} />
                    <h6 className="primary-text">{user.email}</h6>
                </div>

                <div className="details">
                    <button onClick={()=>openModal()} className='btn btn-primary'> Edit</button>

                </div>
            </div>

            {
                showModal && <UserModal
                    changeProperty={changeProperty}
                    show={showModal}
                    user={user}
                    close={closeModal}
                />
            }


            {/* 
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                        <div className="our-team">
                            <div className="picture">
                                <img className="img-fluid" src="https://picsum.photos/130/130?image=1027" />
                            </div>
                            <div className="team-content">
                               
                                <div style={{justifyContent:"center"}} className='d-flex  '>
                                <BiSolidUser style={{width:"23px",height:"23px",marginTop:"5px"}}/>
                                <h3 style={{fontWeight:600,marginLeft:"10px"}}  className="name">{user.name}</h3>
                                </div>
                                <div style={{justifyContent:"center"}} className='d-flex  '>
                                <MdEmail style={{width:"23px",height:"23px"}}/>

                                <h4 style={{fontWeight:600,fontSize:"20px",marginLeft:"10px"}} className="title">{user.email}</h4>
                                </div>
                            </div>
                            <ul className="social">
                                <li><a href="https://codepen.io/collection/XdWJOQ/" className="fa fa-facebook" aria-hidden="true"></a></li>
                                <li><a href="https://codepen.io/collection/XdWJOQ/" className="fa fa-twitter" aria-hidden="true"></a></li>
                                <li><a href="https://codepen.io/collection/XdWJOQ/" className="fa fa-google-plus" aria-hidden="true"></a></li>
                                <li><a href="https://codepen.io/collection/XdWJOQ/" className="fa fa-linkedin" aria-hidden="true"></a></li>
                            </ul>
                        </div>
                    </div>
       
                </div>
            </div> */}

        </div>
    )
}
