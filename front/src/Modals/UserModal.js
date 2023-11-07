import React, { useState,useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
export default function UserModal(props) {

    const [user,setUser] = useState({})
    const navigate = useNavigate()
    const changeProperty = (property, value) => {
        setUser({ ...JSON.parse(JSON.stringify(user)), [property]: value });
        console.log(user);
    };
    useEffect(() => {
        let user = window.localStorage.getItem("user");
        // JSON.parse(JSON.stringify(objectToClone))
        setUser(JSON.parse(user))
        console.log(JSON.parse(user));
        // axios.get("http://127.0.0.1:8000/users/get").then((data) => { console.log(data) })
        return () => {
            
        };
    }, []); // Empty dependency array means the effect only runs once on mount

    const editUserFunction = () => {

        let formData = new FormData();
        formData.append('name', user.name);
        formData.append('email', user.email);
        formData.append('password',user.password)
        let token2 = window.localStorage.getItem("token");
        token2 = JSON.parse(token2)
            token2 = token2['token']
      

        axios
            .post(
                `http://127.0.0.1:8000/user/update`,
                    formData,
                    {headers:{Authorization:`Bearer ${token2}`}}
            )
            .then((data) => {
                console.log(data.data.result);
                console.log(JSON.stringify(data.data.result));
                    console.log(data.data.result.email);
                    console.log(user.email);
                    let localuser = window.localStorage.getItem("user")
                if(data.data.result.email!==localuser.email){
                    localStorage.removeItem('user')
                    localStorage.removeItem('token')
                    navigate("/login")
                    alert("You changed the email You must login again")
                }
                
                window.localStorage.setItem("user",JSON.stringify(data.data.result))
            }).catch(function (error) {
                if (error) {
                    console.log(error);
                    alert(`${error.response.data.error}`)
                }
            }).then(props.close);
    };

    return (


        
        <>
            <Modal show={props.show} size="lg" >
                <Modal.Header style={{background:"#1384f9"}} closeButton onHide={props.close} >
                    <Modal.Title style={{color:"white",fontWeight:"600"}}>User Edit</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className='row'>
                            <Form.Group className="mb-3 col-6">
                                <Form.Label style={{fontSize:"18px",fontWeight:"600"}}>Full Name </Form.Label>
                                <Form.Control
                                    type="text"
                                    autoFocus
                                    placeholder=' Example:Haydar Farhat'
                                    onChange={(e)=>changeProperty('name',e.target.value)}
                                    value={user.name}
                                    />
                            </Form.Group>
                            <Form.Group className="mb-3 col-6">
                                <Form.Label style={{fontSize:"18px",fontWeight:"600"}}> Email </Form.Label>
                                <Form.Control
                                    type="email"
                                    autoFocus
                                    placeholder=' Example:Haydar@gmail.com'
                                    onChange={(e)=>changeProperty('email',e.target.value)}
                                    value={user.email}


                                />
                            </Form.Group>
                        </div>

                    

                        <div className='row'>
                            {/* <Form.Group className="mb-3 col-6">
                                <Form.Label style={{fontSize:"18px",fontWeight:"600"}}>Password </Form.Label>
                                <Form.Control
                                    type="password"
                                    autoFocus
                                    placeholder='Dont Tell Your Password to any one'
                                    onChange={(e)=>props.changeProperty('password',e.target.value)}
                                    value={props.user.password}
                                />
                            </Form.Group> */}

                            <Form.Group className="mb-3 col-6">
                                <Form.Label style={{fontSize:"18px",fontWeight:"600"}}>New Password </Form.Label>
                                <Form.Control
                                    type="password"
                                    autoFocus
                                    placeholder='Dont Tell Your Password to any one'
                                    onChange={(e)=>changeProperty('password',e.target.value)}
                                    autoComplete="new-password"
                                />
                            </Form.Group>
                        </div>


                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.close}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={editUserFunction}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
      
    )
}
