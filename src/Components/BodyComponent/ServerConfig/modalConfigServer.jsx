import React,{useState,useEffect} from 'react';
import {Modal, Input,Select,message} from 'antd';
import {getListSV,postListSV,putListSV} from '../../../Stores/list_sv/slice';
import {useSelector,useDispatch} from 'react-redux';

function ModelConfigServer({showModal,setShowModal,fillData}) {
    const { Option } = Select;
    const dispatch = useDispatch();
    const fetchListSV = () => dispatch(getListSV()); 
    const addNewServer = (server) => dispatch(postListSV(server));
    const editServer = (server) => dispatch(putListSV(server));
    const listSV = useSelector(state => state.listSV.data);
    const [select,setSelect] = useState({status:"undefined",device:"undefined"});
    const onCheck = (server,memory,path,usage) =>{
        if(server === ""){
            message.error("Config server name is empty!",5);
            return false;
        } else {
            for(let i of listSV){
                if(i.name === server && i.name !== fillData.name){
                    message.error("Config server name is exist!",5);
                    return false;
                }
            }
        }
        if(memory === ""){
            message.error("Memory is empty!",5);
            return false;
        } else {
            if(isNaN(memory)){
                message.error("Type of memory is number!",5);
                return false;
            }
        }
        if(path === ""){
            message.error("Path is empty!",5);
            return false;
        }
        if(usage === ""){
            message.error("Usage is empty!",5);
            return false;
        }else {
            if(isNaN(usage)){
                message.error("Type of usage is number!",5);
                return false;
            }
        }
        return true;
    }
     
    const onEdit = () =>{
        const server = document.getElementById("server");
        const memory = document.getElementById("memory");
        const path = document.getElementById("path");
        const usage = document.getElementById("usage");
        const check = onCheck(server.value,memory.value,path.value,usage.value);
        if(check === true && showModal.action ==="edit"){
            editServer({
                name: server.value,
                Device:select.device === "undefined" ? parseInt(fillData.Device) : parseInt(select.device),
                GB: parseFloat(memory.value),
                Path: path.value,
                U_GB: parseFloat(usage.value),
                Status:select.status === "undefined" ? parseInt(fillData.Status) : parseInt(select.status),
            }).unwrap().then((originalPromiseResult) => {
                message.loading({ content: 'Loading...',key: "edit" });
                setTimeout(() => {
                  message.success({ content: `${originalPromiseResult}`,key:"edit",duration: 5});
                  fetchListSV();
                  setShowModal(false);
                }, 1000);
            })
            .catch((rejectedValueOrSerializedError) => {
                message.loading({ content: 'Loading...',key: "editError" });
                setTimeout(() => {
                    message.error({ content: `${rejectedValueOrSerializedError}`,key:"editError",duration: 5});
                }, 1000);
            })
        } else if(check === true && showModal.action ==="new"){
            addNewServer({
                name: server.value,
                Device:select.device === "undefined" ? 0 : parseInt(select.device),
                GB: parseFloat(memory.value),
                Path: path.value,
                U_GB: parseFloat(usage.value),
                Status:select.status === "undefined" ? 0 : parseInt(select.status),
            }).unwrap().then((originalPromiseResult) => {
                message.loading({ content: 'Loading...',key: "new" });
                setTimeout(() => {
                  message.success({ content: `${originalPromiseResult}`,key:"new",duration: 5});
                  fetchListSV();
                  setShowModal(false);
                }, 1000);
            })
            .catch((rejectedValueOrSerializedError) => {
                message.loading({ content: 'Loading...',key: "newError" });
                setTimeout(() => {
                    message.error({ content: `${rejectedValueOrSerializedError}`,key:"newError",duration: 5});
                }, 1000);
            });
        }
    }

    function handleChange(value,field) {
        if(field === "status"){
            setSelect({...select,status:value});
        } else {
            setSelect({...select,device:value});
        }
    }

    useEffect(()=>{
        fetchListSV();
    },[]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal
                title={showModal.action ==="edit" ? `Detail Server Config` : "Add New Server Config"} 
                visible={showModal.show}
                onCancel={()=>setShowModal({...showModal,show:false})}
                cancelButtonProps ={{ style:{ display: 'none' }} }
                okButtonProps ={{ style:{ display: 'none' }} }
                centered
                footer={<button onClick={onEdit} className="save">Save</button>}
                width="800px"
                className="modal-edit-server"
                key={showModal.show}
            >
                <div key={showModal.show} className="wrap-modal-content">
                    <div className="left">  
                        <div className="filed server">
                            <p>Name Server Config *</p>
                            <Input id="server" defaultValue={showModal.action==="edit" ? fillData.name: ""}></Input>
                        </div>
                        <div className="filed memory">
                            <p>Memory *</p>
                            <Input id="memory" defaultValue={showModal.action==="edit" ? fillData.GB :""}></Input>
                        </div>
                        <div className="filed path">
                            <p>Path *</p>
                            <Input id="path" defaultValue={showModal.action==="edit" ? fillData.Path: ""}></Input>
                        </div>
                        <div className="filed usage">
                            <p>Usage *</p>
                            <Input id="usage" defaultValue={showModal.action==="edit" ? fillData.U_GB : ""}></Input>
                        </div>
                        <p>* is required</p>
                    </div>
                    <div className="right">
                        <div className="filed status">
                            <p>Status</p>
                            <Select onChange={(value)=>handleChange(value,"status")} id="status" 
                                    defaultValue={showModal.action==="edit" ? fillData.Status : "0"}>
                                <Option value="0" key="0">0</Option>
                                <Option value="1" key="1">1</Option>
                            </Select>
                        </div>
                    
                        <div className="filed device">
                            <p>Device</p>
                            <Select onChange={(value)=>handleChange(value,"device")} id="device" 
                                    defaultValue={showModal.action==="edit" ? fillData.Device : "0"}>
                                <Option value="0" key="0">0</Option>
                                <Option value="1" key="1">1</Option>
                            </Select>
                        </div>
                    </div>
                </div>
            </Modal>
    )
}

export default ModelConfigServer;

