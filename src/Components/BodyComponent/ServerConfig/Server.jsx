import React,{useState,useEffect}  from 'react';
import {ReactComponent as Plus} from '../../../Assets/plus.svg';
import {ReactComponent as Trash} from '../../../Assets/trash.svg';
import {ReactComponent as Edit} from '../../../Assets/edit.svg';
import {Table,Modal,Button,message} from 'antd';
import {getListSV,removeListSV} from '../../../Stores/list_sv/slice';
import {useSelector,useDispatch} from 'react-redux';
import ModalConfigServer from "./modalConfigServer";

function Server(props) {
    const dispatch = useDispatch();
    const fetchListSV = () => dispatch(getListSV());
    const DeleteSV = (params) => dispatch(removeListSV(params));
    const listSV = useSelector(state => state.listSV.data);
    const [showModal,setShowModal] = useState({action:"",show:false});
    const [fillData,setFillData] = useState("");
    const [showDelete,setShowDelete] = useState(false);
    const [remove,setRemove] = useState("");
    const data = listSV !== "" && listSV.map((i,index)=>{
        return {
            key: index + 1,
            number: index + 1,
            name: i.name,
            memory:`${i.GB} GB`,
            path: i.Path,
            usage:`${i.U_GB} GB`,
            status:<div className="status">{i.Status === 1 && <span className="off" style={{width:"12px",height:"12px"}}></span>}
            {i.Status === 0 && <span className="on" style={{width:"12px",height:"12px"}}></span>}
            {i.Status === 1 ? <p>OFF</p> : <p>ON</p>}</div>,
            device:i.Device,
            action: <div className="action">
                <Edit onClick={()=> {setShowModal({action:"edit",show:true});setFillData(i)}}/>
                <Trash onClick={()=> {setShowDelete(true);setRemove(i.name)}}/>
                </div>
        }
    })
    const columns = [
        {
            title: 'Number',
            dataIndex: 'number',
            key:"number",
            width:"10%",
            sorter: {
                compare: (a, b) => a.number - b.number,
                multiple: 3,
            }
        },
        {
            title: 'Config Server Name',
            dataIndex: 'name',
            key:"name",
        },
        {
            title: 'Memory',
            dataIndex: 'memory',
            key:"memory",
            width:"12%",
            sorter: {
                compare:(a, b) => parseInt(a.memory.slice(0,a.memory.indexOf("G")-1)) 
                - parseInt(b.memory.slice(0,b.memory.indexOf("G")-1)),
                multiple: 2,
            }
        },
        {
            title: 'Path',
            dataIndex: 'path',
            key:"path",
            width:"12%"
        },
        {
            title: 'Usage',
            dataIndex: 'usage',
            key:"usage",
            width:"12%",
            sorter: {
                compare: (a, b) => parseInt(a.usage.slice(0,a.usage.indexOf("G")-1)) 
                - parseInt(b.usage.slice(0,b.usage.indexOf("G")-1)),
                multiple: 2,
            }
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key:"status",
            width:"10%",
            sorter: {
                compare: (a, b) => a.status - b.status,
                multiple: 2,
            }  
        },
        {
            title: 'Device',
            dataIndex: 'device',
            key:"device",
            width:"10%",
            sorter: {
                compare: (a, b) => a.device - b.device,
                multiple: 2,
            }
        },
        {
            title: '',
            dataIndex: 'action',
            key:"action",
            width:"10%",
        },
    ]

    useEffect(()=>{
        fetchListSV();
    },[]);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="wrap-page-server">
            <div className="page-header">
                <p className="content-title">List Config Server</p>
                <button onClick={()=>{setShowModal({action:"new",show:true}); setFillData("")}}>
                    <Plus></Plus>
                    Add Config Server
                </button>
            </div>
     
            <Table className="content-table"
                columns={columns} pagination={false}
                dataSource={data} scroll={{ y: 360 }}/>
            <ModalConfigServer showModal={showModal}
                setShowModal={setShowModal} fillData={fillData}
            ></ModalConfigServer>
            <Modal
                title="Do you want to delete this config server?"
                onCancel={()=>setShowDelete(false)}
                visible={showDelete}
                cancelButtonProps ={{ style:{ display: 'none' }} }
                okButtonProps ={{ style:{ display: 'none' }} }
                centered
                footer={<><Button onClick={()=>{
                    DeleteSV(remove).unwrap().then((originalPromiseResult) => {
                        message.loading({ content: 'Loading...',key: "delete" });
                        setTimeout(() => {
                          message.success({ content: `${originalPromiseResult}`,key:"delete",duration: 5});
                          setShowDelete(false);
                          fetchListSV();
                        }, 1000);
                    })
                    .catch((rejectedValueOrSerializedError) => {
                        message.loading({ content: 'Loading...',key: "deleteError" });
                        setTimeout(() => {
                            message.error({ content: `${rejectedValueOrSerializedError}`,key:"deleteError",duration: 5});
                            setShowDelete(false);
                        }, 1000);
                    })
                }} key="1" type="primary" ghost>Yes</Button>
                          <Button key="2" onClick={()=>setShowDelete(false)} type="default" danger>No</Button>  </>}
                className="model-delete-server"
            >   

            </Modal>
        </div>
    )
}

export default Server;

