import React,{useState,useEffect}  from 'react';
import {ReactComponent as Plus} from '../../../Assets/plus.svg';
import {ReactComponent as Trash} from '../../../Assets/trash.svg';
import {ReactComponent as Edit} from '../../../Assets/edit.svg';
import {Table,Modal,Button,message} from 'antd';
import {getListSV,updateUsage} from '../../../Stores/list_sv/slice';
import {getAllModel,removeModel} from '../../../Stores/model_run/slice';
import {useSelector,useDispatch} from 'react-redux';
import ModalConfigModel from './modalConfigModel';

function Model(props) {
    const dispatch = useDispatch();
    const fetchModel = () => dispatch(getAllModel());
    const DeleteModel = (params) => dispatch(removeModel(params));
    const editUsage = (usage) => dispatch(updateUsage(usage))
    const fetchListSV = () => dispatch(getListSV()); 
    const [showModal,setShowModal] = useState({action:"",show:false});
    const [fillData,setFillData] = useState("");
    const [showDelete,setShowDelete] = useState(false);
    const [remove,setRemove] = useState({name:"",GB: null,server:"",device:""});
    const models = useSelector(state => state.model.data);
    const listSV = useSelector(state => state.listSV.data);
    const checkMemory = ()=>{
        const sv_memory = listSV.find((i)=> {return i.name === remove.server && i.Device == remove.device})
        return sv_memory;
    } 
    const data = models !== "" && models.map((i,index)=>{
        return{
            key: index + 1,
            number: index + 1,
            name: i.name,
            server:i.Server_Run,
            memory:`${i.GB_Model} GB`,
            ip_server: i.IP_SV,
            main: i.Main_SV,
            backup:i.Backup_SV,
            status:<div className="status">{i.Status === 1 && <span className="off" style={{width:"12px",height:"12px"}}></span>}
            {i.Status === 0 && <span className="on" style={{width:"12px",height:"12px"}}></span>}
            {i.Status === 1 ? <p>OFF</p> : <p>ON</p>}</div>,
            device:i.Device,
            start: i.time_start,
            end:i.time_stop,
            action: <div className="action">
                <Edit onClick={()=> {setShowModal({action:"edit",show:true});setFillData(i)}}/>
                <Trash onClick={()=> {setShowDelete(true);setRemove({name:i.name,GB:i.GB_Model,server: i.Server_Run ,device: i.Device})}}/>
                </div>
        }
    })
    const columns = [
        {
            title: 'Number',
            dataIndex: 'number',
            key:"number",
            // width:110,
            sorter: {
                compare: (a, b) => a.number - b.number,
                multiple: 3,
            }
        },
        {
            title: 'Model Server Name',
            dataIndex: 'name',
            key:"name",
        },
        {
            title: 'Server Run',
            dataIndex: 'server',
            key:"server",
        },
        {
            title: 'Memory',
            dataIndex: 'memory',
            key:"memory",
            // width:130,
            sorter: {
                compare: (a, b) => parseInt(a.memory.slice(0,a.memory.indexOf("G")-1)) 
                - parseInt(b.memory.slice(0,b.memory.indexOf("G")-1)),
                multiple: 2,
            }
        },
        {
            title: 'IP_Server',
            dataIndex: 'ip_server',
            key:"ip_server",
            // width:160
        },
        {
            title: 'Main Server',
            dataIndex: 'main',
            key:"main",
            // width:130,
        },
        {
            title: 'Backup Server',
            dataIndex: 'backup',
            key:"backup",
            // width:100,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key:"status",
            // width:100,
            sorter: {
                compare: (a, b) => a.status - b.status,
                multiple: 2,
            }
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key:"device",
            // width:100,
            sorter: {
                compare: (a, b) => a.device - b.device,
                multiple: 2,
            }
        },
        {
            title: 'Time Start',
            dataIndex: 'start',
            key:"start",
            // width:100,
        },
        {
            title: 'Time End',
            dataIndex: 'end',
            key:"end",
            // width:100,
        },
        {
            title: '',
            dataIndex: 'action',
            key:"action",
            // width:80,
        },
    ]

    useEffect(()=>{
        fetchModel();
        fetchListSV();
    },[]);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="wrap-page-model">
            <div className="page-header">
                <p className="content-title">List Config Server</p>
                <button onClick={()=>{setShowModal({action:"new",show:true}); setFillData("")}}>
                    <Plus></Plus>
                    Add Config Model
                </button>
            </div>
            <Table className="content-table"
                columns={columns} pagination={false}
                dataSource={data} scroll={{ y: 360 }}/>
            <ModalConfigModel showModal={showModal}
                setShowModal={setShowModal} fillData={fillData}
            ></ModalConfigModel>
            <Modal
                title="Do you want to delete this config Model?"
                onCancel={()=>setShowDelete(false)}
                visible={showDelete}
                cancelButtonProps ={{ style:{ display: 'none' }} }
                okButtonProps ={{ style:{ display: 'none' }} }
                centered
                footer={<><Button onClick={()=>
                    DeleteModel(remove.name).unwrap().then((originalPromiseResult) => {
                        message.loading({ content: 'Loading...',key: "delete" });
                        editUsage({usage: checkMemory().U_GB - Number(remove.GB),
                            name:remove.server,Device:remove.device}).unwrap().then(()=>{
                                fetchListSV();
                            });
                        setTimeout(() => {
                          message.success({ content: `${originalPromiseResult}`,key:"delete",duration: 5});
                          setShowDelete(false);
                          fetchModel();
                        }, 1000);
                    })
                    .catch((rejectedValueOrSerializedError) => {
                        message.loading({ content: 'Loading...',key: "deleteError" });
                        setTimeout(() => {
                            message.error({ content: `${rejectedValueOrSerializedError}`,key:"deleteError",duration: 5});
                            setShowDelete(false);
                        }, 1000);
                    })
                } key="1" type="primary" ghost>Yes</Button>
                          <Button key="2" onClick={()=>setShowDelete(false)} type="default" danger>No</Button>  </>}
                className="model-delete-server"
            >   

            </Modal>
        </div>
    )
}

export default Model;

