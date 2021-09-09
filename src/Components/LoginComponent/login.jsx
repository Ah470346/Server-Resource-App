import React from 'react';
import {useDispatch} from "react-redux";
import { Row, Col,message } from 'antd';
import VBPO from '../../Assets/VBPO.png';
import {postAuth} from '../../Stores/auth/slice';
import {addPermission} from '../../Stores/permission/slice';

function Login(props) {
    const dispatch = useDispatch();
    const onLogin = (user) => dispatch(postAuth(user));
    const onPermission = (permission) => dispatch(addPermission(permission));
    const handleSubmit  = (e) =>{
        e.preventDefault();
        const username = document.getElementById("username");
        const password = document.getElementById("password");
        const button = document.getElementById("submit");
        onLogin({username:username.value,password:password.value})
        .unwrap()
        .then(async (originalPromiseResult) => {
            message.loading({ content: 'Loading...', key:"login" });
            localStorage.setItem("permission","home");
            username.style.pointerEvents = "none";
            password.style.pointerEvents = "none";
            button.style.pointerEvents = "none";
            setTimeout(() => {
                message.success({ content: originalPromiseResult,key: "login", duration: 5 });
                username.style.pointerEvents = "auto";
                password.style.pointerEvents = "auto";
                button.style.pointerEvents = "auto";
                onPermission("home");
            }, 1500);
        })
        .catch((rejectedValueOrSerializedError) => {
            message.loading({ content: 'Loading...', key:"errLogin" });
            username.style.pointerEvents = "none";
            password.style.pointerEvents = "none";
            button.style.pointerEvents = "none";
            setTimeout(() => {
                message.error({ content: rejectedValueOrSerializedError,key: "errLogin", duration: 5 });
                password.value = "";
                username.style.pointerEvents = "auto";
                password.style.pointerEvents = "auto";
                button.style.pointerEvents = "auto";
            }, 1500);
        })
    }
    return (
        <div className="wrap-login">
            <Row className="login" justify="center" style={{width:"100%",height:"100%"}}>
                <Col span={8} xs={24} sm={16} md={12} lg={10} xl={8} xxl={6}>
                    <form onSubmit={handleSubmit} className="form-login">
                        <div className="logo">
                            <img src={VBPO} alt="" />
                        </div>
                        <div className="sign-in">
                            <p>SIGN IN</p>
                        </div>
                        <div className="input username">
                            <input 
                                title="Please fill out this field"
                                onInvalid={(e)=> {e.target.setCustomValidity("Please fill out this field")}} 
                                onInput={(e)=> {e.target.setCustomValidity('')}}
                                type="text" name="username" id="username" required/>
                            <label htmlFor="username">
                                <p>USERNAME</p>
                                <svg xmlns="http://www.w3.org/2000/svg"   
                                    viewBox="0 0 24 24" fill="none" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" strokeLinejoin="round" 
                                    className="feather feather-user">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                </label>
                            <span></span>
                        </div>
                        <div className="input password">
                            <input 
                                title="Please fill out this field"
                                onInvalid={(e)=> {e.target.setCustomValidity("Please fill out this field")}} 
                                onInput={(e)=> {e.target.setCustomValidity('')}}
                                type="password" name="password" id="password" required/>
                            <label htmlFor="password">
                                <p>PASSWORD</p>
                                <svg xmlns="http://www.w3.org/2000/svg" 
                                    viewBox="0 0 24 24" fill="none" 
                                    strokeWidth="2" 
                                    strokeLinecap="round" strokeLinejoin="round" 
                                    className="feather feather-lock"><rect x="3" y="11" 
                                    width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                            </label>
                            <span></span>    
                        </div>
                        <div className="btn-login">
                            <button id="submit" type="submit">SIGN IN</button>
                        </div>
                    </form>
                </Col>
            </Row>
        </div>
    );
}

export default Login;