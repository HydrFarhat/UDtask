import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from "axios"
import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function LoginForm() {

    const [user, setUser] = useState({})

    const navigate = useNavigate();

    const changeProperty = (property, value) => {
        setUser({ ...user, [property]: value });
        console.log(user);
    };

    const handleLogin = (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append('email', user.email);
        formData.append('password', user.password);
        axios.post("http://127.0.0.1:8000/login",
            formData
        ).then((data)=>{
            window.localStorage.setItem("token", JSON.stringify(data.data));
            navigate('/users');

            
        }).catch(function (error) {
            if (error) {
                console.log(error);
                alert(`${error.response.data.error}`)
            }
        })

    }

    return (

        <div style={{ textAlign: "center",margin:"auto" ,marginTop:"40px"}} className=' forms '>

            <div  style={{ backgroundColor: "#0889e5",height:"-webkit-fill-available",width:"inherit",borderRadius:" 6px 6px 6px 6px" }}>
                <h4 style={{marginTop:"3px",color:"white",fontWeight:600}} > User Login</h4>
                
            </div>

            <div>
                <Form >



                    <Form.Group className="mb-3" controlId="formBasicEmail">

                        <Form.Label className='primary-text2'>Email address</Form.Label>
                        <Form.Control onChange={(e) => changeProperty('email', e.target.value)} type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label className='primary-text2'>Password</Form.Label>
                        <Form.Control onChange={(e) => changeProperty('password', e.target.value)} type="password" placeholder="Password" />
                    </Form.Group>
                    <Button style={{marginBottom:"10px"}} onClick={(e) => handleLogin(e)} variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>


        </div>

    );
}

export default LoginForm;