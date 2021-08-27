import React,{useState} from 'react';
import VBPO from '../../Assets/VBPO.png';
import {ReactComponent as HomeIcon} from '../../Assets/Home.svg';
import {ReactComponent as ServerIcon} from '../../Assets/server.svg';
import {ReactComponent as LayerIcon} from '../../Assets/layers.svg';
import Logout from '../../Assets/logout.svg';
import { Row, Col } from 'antd';
import {useDispatch} from "react-redux";
import Home from './Home/Home';
import Server from './ServerConfig/Server';
import Model from './ModelConfig/Model';
import {addPermission} from '../../Stores/permission/slice';

function Main(props) {
    const [homePage,setHomPage] = useState("Home");
    const dispatch = useDispatch();
    const onPermission = (permission) => dispatch(addPermission(permission)); 
    const onChangePageHome = () =>{
        setHomPage("Home");
        const tabHome = document.querySelector(".tab.home");
        const tabServer = document.querySelector(".tab.server");
        const tabModel = document.querySelector(".tab.model");
        tabHome.classList.add("active");
        tabServer.classList.remove("active");
        tabModel.classList.remove("active")
    }

    const onChangePageServer = () =>{
        setHomPage("Server");
        const tabHome = document.querySelector(".tab.home");
        const tabServer = document.querySelector(".tab.server");
        const tabModel = document.querySelector(".tab.model");
        tabHome.classList.remove("active");
        tabServer.classList.add("active");
        tabModel.classList.remove("active")
    }

    const onChangePageModel = () =>{
        setHomPage("Model");
        const tabHome = document.querySelector(".tab.home");
        const tabServer = document.querySelector(".tab.server");
        const tabModel = document.querySelector(".tab.model");
        tabHome.classList.remove("active");
        tabServer.classList.remove("active");
        tabModel.classList.add("active")
    }

    const columns = [
    {
        title: 'Number',
        dataIndex: 'number',
        key:"number",
        sorter: {
            compare: (a, b) => a.number - b.number,
            multiple: 3,
        }
    },
    {
        title: 'Server Name',
        dataIndex: 'server',
        key:"server",
    },
    {
        title: 'Memory',
        dataIndex: 'memory',
        key:"memory",
        sorter: {
        compare: (a, b) => parseInt(a.memory.slice(0,a.memory.indexOf("G")-1)) 
        - parseInt(b.memory.slice(0,b.memory.indexOf("G")-1)),
        multiple: 2,
        },
    },
    {
        title: 'Device',
        dataIndex: 'device',
        key:"device",
        sorter: {
        compare: (a, b) => a.device - b.device,
        multiple: 1,
        },
    },
    {
        title: 'File',
        dataIndex: 'file',
        key:"file"
    },
    ];
    const columnsDetail = [
        {
            title: 'Number',
            dataIndex: 'number',
            key:"number",
            width:110,
            sorter: {
                compare: (a, b) => a.number - b.number,
                multiple: 3,
            }
        },
        {
            title: 'File Name',
            dataIndex: 'file',
            key:"file",
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key:"status",
            width:110
        },
        {
            title: 'Number of run',
            dataIndex: 'run',
            key:"run",
            sorter: {
            compare: (a, b) => a.device - b.device,
            multiple: 1,
            },
        },
        {
            title: 'The lastest time run',
            dataIndex: 'last',
            width:250,
            key:"last"
        },
    ]
    return (
        <div className="wrap-home">
            <div className="header">
                <img src={VBPO} alt="" />
                <div onClick={()=>{
                    localStorage.setItem("permission","login");
                    onPermission("login");
                }} className="logout">
                    <img src={Logout} alt="" />
                    <p>Logout</p>
                </div>
            </div>
            <Row className="body">
                <Col className="sidebar" span={4}>
                    <ul className="tabs">
                        <li onClick={onChangePageHome} className="tab home active">
                            <HomeIcon></HomeIcon>
                            <p>Home</p>    
                        </li>
                        <li onClick={onChangePageServer} className="tab server">
                            <ServerIcon></ServerIcon>
                            <p>Config Server</p>
                        </li>
                        <li onClick={onChangePageModel} className="tab model">
                            <LayerIcon></LayerIcon>
                            <p>Config Model</p>
                        </li>
                        <span></span>
                    </ul>
                </Col>
                <Col className="content" span={20}>
                    { homePage === "Home" && <Home columns={columns} columnsDetail={columnsDetail}></Home>}
                    { homePage === "Server" && <Server/>}
                    { homePage === "Model" && <Model/>}
                </Col>
            </Row>
        </div>
    );
}

export default Main;