import React,{useState,useEffect} from 'react';
import {Modal, Input,Select,message,TimePicker} from 'antd';
import moment from 'moment';
import {getListSV,updateUsage} from '../../../Stores/list_sv/slice';
import {getAllModel,putModel,postModel} from '../../../Stores/model_run/slice';
import {useSelector,useDispatch} from 'react-redux';

function ModalConfigModel({showModal,setShowModal,fillData}) {
    const { Option } = Select;
    const dispatch = useDispatch();
    const fetchModel = () => dispatch(getAllModel()); 
    const fetchListSV = () => dispatch(getListSV()); 
    const addNewModel = (model) => dispatch(postModel(model));
    const editModel = (model) => dispatch(putModel(model));
    const editUsage = (usage) => dispatch(updateUsage(usage))
    const listSV = useSelector(state => state.listSV.data);
    const models = useSelector(state => state.model.data);
    const [select,setSelect] = useState({status:"",server:""});
    const [time,setTime] = useState({start:"",end:""});

    const checkMemory = ()=>{
        const sv_memory = select.server === "" ? listSV.find((i)=> {return i.name === fillData.Server_Run}):
        listSV.find((i)=> i.name === select.server);
        return sv_memory;
    }

    const onCheck = (name,memory,ip_server,main,backup) =>{
        if(name === ""){
            message.error("Config server name is empty!",5);
            return false;
        } else {
            for(let i of models){
                if(i.name === name && i.name !== fillData.name){
                    message.error("Config server name is exist!",5);
                    return false;
                }
            }
        }
        if(main === ""){
            message.error("Main Server is empty!",5);
            return false;
        }
        if(backup === ""){
            message.error("Backup Server is empty!",5);
            return false;
        }
        if(select.server === "" && showModal.action === "new"){
            message.error("Server Run don't choice!",5);
            return false;
        }
        if(memory === ""){
            message.error("Memory is empty!",5);
            return false;
        } else {
            if(isNaN(memory)){
                message.error("Type of memory is number!",5);
                return false;
            } else if(showModal.action === "new" && checkMemory().GB < checkMemory().U_GB + Number(memory)){
                message.error(`The remaining memory capacity of main server is not enough`,5);
                return false;
            } else if(showModal.action === "edit" && checkMemory().GB < checkMemory().U_GB + (Number(memory) - fillData.GB_Model)){
                message.error(`The remaining memory capacity of main server is not enough`,5);
                return false;
            }
        }
        return true;
    }
     
    const onEdit = () =>{
        const name = document.getElementById("name");
        const memory = document.getElementById("memory");
        const ip_server = document.getElementById("ip_server");
        const main = document.getElementById("main");
        const backup = document.getElementById("backup");
        const check = onCheck(name.value,memory.value,ip_server.value,main.value,backup.value);
        if(check === true && showModal.action ==="edit"){
            editModel({
                name: name.value,
                GB_Model:Number(memory.value),
                Device:0,
                IP_SV: ip_server.value,
                Main_SV: main.value,
                Backup_SV: backup.value,
                Status:select.status === "" ? parseInt(fillData.Status) : parseInt(select.status),
                Server_Run:select.server === "" ? fillData.Server_Run : select.server,
                time_start:time.start === "" ? fillData.time_start : time.start,
                time_stop: time.end === "" ? fillData.time_stop : time.end,
                time_run: fillData.time_run,
                number_run:fillData.number_run
            }).unwrap().then((originalPromiseResult) => {
                message.loading({ content: 'Loading...',key: "edit" });
                if(Number(memory.value) !== fillData.GB_Model){
                    // change memory usage of server when memory of model change
                    editUsage({usage: checkMemory().U_GB + Number(memory.value - fillData.GB_Model),
                        name:select.server === "" ? fillData.Server_Run : select.server}).unwrap().then(()=>{
                            fetchListSV();
                        });
                }
                if(select.server !== ""){
                    // convert memory from old server to new server
                    editUsage({usage: checkMemory().U_GB + Number(memory.value),
                        name:select.server}).unwrap().then(()=>{
                            fetchListSV();
                        });
                    // delete memory of old server when convert    
                    editUsage({usage: listSV.find((i)=> {return i.name === fillData.Server_Run}).U_GB - fillData.GB_Model,
                        name:fillData.Server_Run}).unwrap().then(()=>{
                            fetchListSV();
                        });
                }
                setTimeout(() => {
                  message.success({ content: `${originalPromiseResult}`,key:"edit",duration: 5});
                  fetchModel();

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
            const date = new Date();
            addNewModel({
                name: name.value,
                GB_Model:Number(memory.value),
                Device:0,
                IP_SV: ip_server.value,
                Main_SV: main.value,
                Backup_SV: backup.value,
                Status:select.status === "" ? 0 : parseInt(select.status),
                Server_Run: select.server,
                time_start:time.start === "" ? "00:00:00" : time.start,
                time_stop: time.end === "" ? "00:00:00" : time.end,
                time_run: date.toString(),
                number_run:0
            }).unwrap().then((originalPromiseResult) => {
                message.loading({ content: 'Loading...',key: "new" });
                editUsage({usage: checkMemory().U_GB + Number(memory.value),name:select.server}).unwrap().then(()=>{
                        fetchListSV();
                    });
                setTimeout(() => {
                  message.success({ content: `${originalPromiseResult}`,key:"new",duration: 5});
                  fetchModel();
                  setShowModal(false);
                  setSelect({status:"",server:""});
                  setTime({start:"",end:""});
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

    function onChange(t, timeString,field) {
        if(field === "start"){
            setTime({...time,start:timeString});
        } else {
            setTime({...time,end:timeString});
        }
    }

    function handleChange(value,field) {
        if(field === "status"){
            setSelect({...select,status:value});
        } else {
            setSelect({...select,server:value});
        }
    }

    useEffect(()=>{
        fetchModel();
        fetchListSV()
    },[]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Modal
            title={showModal.action ==="edit" ? `Detail Model Config` : "Add New Model Config"} 
            visible={showModal.show}
            onCancel={()=>setShowModal({...showModal,show:false})}
            cancelButtonProps ={{ style:{ display: 'none' }} }
            okButtonProps ={{ style:{ display: 'none' }} }
            centered
            footer={<button onClick={onEdit} className="save">Save</button>}
            width="800px"
            className="modal-edit-server model"
            key={showModal.show}
        >
            <div key={showModal.show} className="wrap-modal-content" >
                <div className="left">  
                    <div className="filed server">
                        <p>Name Model Config *</p>
                        <Input id="name" defaultValue={showModal.action==="edit" ? fillData.name: ""}></Input>
                    </div>
                    <div className="filed memory">
                        <p>Memory *</p>
                        <Input id="memory" defaultValue={showModal.action==="edit" ? fillData.GB_Model :""}></Input>
                    </div>
                    <div className="filed ip_server">
                        <p>IP_Server *</p>
                        <Input id="ip_server" defaultValue={showModal.action==="edit" ? fillData.IP_SV: ""}></Input>
                    </div>
                    <div className="filed main">
                        <p>Main_Server *</p>
                        <Input id="main" defaultValue={showModal.action==="edit" ? fillData.Main_SV : ""}></Input>
                    </div>
                    <div className="filed backup">
                        <p>Backup_Server *</p>
                        <Input id="backup" defaultValue={showModal.action==="edit" ? fillData.Backup_SV : ""}></Input>
                    </div>
                    <p>* is required</p>
                </div>
                <div className="right">
                    <div className="filed server">
                            <p>Server Run *</p>
                            <Select onChange={(value)=>handleChange(value,"server")} id="server" 
                                    defaultValue={showModal.action==="edit" ? fillData.Server_Run : "Select a server"}>
                               { listSV.map((i,index)=>{
                                    return(
                                        <Option value={i.name} key={index}>{i.name}</Option>
                                    )
                               })}
                            </Select>
                    </div>
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
                        <Select onChange={(value)=>handleChange(value,"status")} id="status" 
                                defaultValue={showModal.action==="edit" ? fillData.Device : "0"}>
                            <Option value="0" key="0">0</Option>
                            <Option value="1" key="1">1</Option>
                            <Option value="1" key="1">2</Option>
                        </Select>
                    </div>
                    <div className="filed start">
                        <p>Time Start *</p>
                        <TimePicker onChange={(time,timeString) => onChange(time,timeString,"start")} id="start" 
                            defaultValue={
                                moment(showModal.action==="edit" ? fillData.time_start:"00:00:00", 'HH:mm:ss')} />
                    </div>
                    <div className="filed end">
                        <p>Time End *</p>
                        <TimePicker onChange={(time,timeString) => onChange(time,timeString,"end")} id="end" 
                            defaultValue={
                                moment(showModal.action==="edit" ? fillData.time_stop:"00:00:00", 'HH:mm:ss')} />
                    </div>
                </div>
            </div>
        </Modal>
    )
}


export default ModalConfigModel;

