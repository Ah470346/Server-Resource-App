import React,{useState,useEffect} from'react';
import {getStatus,postStatus} from '../../../Stores/status/slice';
import {getListSV} from '../../../Stores/list_sv/slice';
import {getAllModel} from '../../../Stores/model_run/slice';
import {useSelector,useDispatch} from 'react-redux';
import {ReactComponent as Power} from '../../../Assets/power-button.svg'; 
import {ReactComponent as Success} from '../../../Assets/success.svg'; 
import {ReactComponent as Warning} from '../../../Assets/warning.svg';
import {ReactComponent as Error} from '../../../Assets/error.svg';
import {Table,Modal} from 'antd';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://192.168.1.134:8080";

function Home({columns,columnsDetail}) {
    const dispatch = useDispatch();
    const fetchStatus = () => dispatch(getStatus());
    const fetchListSV = () => dispatch(getListSV());
    const fetchModel = () => dispatch(getAllModel());
    const pushStatus = (status) => dispatch(postStatus(status));
    const status = useSelector(state => state.status.data);
    const listSV = useSelector(state => state.listSV.data);
    const [models,setModels] = useState([]);
    const [spin,setSpin] = useState(false);
    const [detail,setDetail] = useState("");
    const [showDetail,setShowDetail] = useState(false);
    const [fileRun,setFileRun] = useState([]);
    const checkStatus = (i)=>{
        const currentDate = new Date();
        const date = new Date(i.time_run);
        if(i.Status === 1 ||(currentDate-date)/1000 >= 60 && i.number_run >= 3){
            return "error";
        } else if((currentDate-date)/1000 >= 60 && i.number_run <= 2) {
            return "warning";
        } else if((currentDate-date)/1000 < 60){
            return 1 ;
        }
    }
    const timeRun = (name,model) => {
        const result = {
            name:name,
            total:"",
            run: 0,
            status:""
        }
        
        const filterModels = model.filter((i)=>{
            return i.Server_Run === name;
        });
        result.total = filterModels.length;
        for(let i of filterModels){
            const check = checkStatus(i);
            if(check === "error"){
                result.status = "error";
            } else if(check==="warning" && result.status !== "error") {
                result.status= "warning";
            } else if(check === 1){
                result.run = result.run + 1 ;
            }
        } 
        return result;   
    }
    const data = listSV !== "" && listSV.map((i,index)=>{
        return {
            key: index + 1,
            number: index + 1,
            server: i.name,
            memory:`${i.GB} GB`,
            device: i.Device,
            file: fileRun.length !==0 
            && status.status !==0 && <div className="file">{fileRun[index].total !==0 && `${fileRun[index].run}/${fileRun[index].total}`}
                {fileRun[index].status === "error" && <Error style={{with:"18px",height:"18px"}}/>}
                {fileRun[index].status === "warning" && <Warning style={{with:"18px",height:"18px"}}/>}
                {fileRun[index].status === "" && fileRun[index].total !==0 && <Success style={{with:"18px",height:"18px"}}/>}</div>
        }
    });
    const color = (status)=>{
        if(status === "error"){
            return "rgba(242,45,45,255)";
        } else if(status === 1){
            return "rgba(55,152,65,255)";
        } else return "#faad14";
    }
    const dataDetail = models.length !== 0 && models.filter((i)=>i.Server_Run === detail).map((i,index)=>{
        return {
            key: index + 1,
            number: index + 1,
            file: i.name,
            status:<div className="status">
                <span style={{backgroundColor:color(i.status)}}></span>
                {i.status === 1 ? "Ok" : i.status}
            </div>,
            run: i.number_run,
            last:i.time_run 
        }
    });
    const onPower = (status) => {    
        if(status === 0){
            setSpin(true);
            pushStatus({status:1}).unwrap().then(async (originalPromiseResult) => {
                setTimeout(() => {
                    setSpin(false);
                    fetchStatus();
                }, 1500);
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
            })
        } else {
            setSpin(true);
            pushStatus({status:0}).unwrap().then(async (originalPromiseResult) => {
                setTimeout(() => {
                    setSpin(false);
                    fetchStatus();
                }, 1500);
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
            })
        }
    } 
    // so sánh hai Obj
    function shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (let key of keys1) {
          if (object1[key] !== object2[key]) {
            return false;
          }
        }
        return true;
      }
    // So sánh hai array
    const EqualArray = (arr1,arr2)=>{
        if(arr1.length !== arr2.length){
            return false;
        }
        for(let i=0 ; i< arr1.length ; i ++){
            if(shallowEqual(arr1[i],arr2[i])=== false){
                return false;
            }
        }
        return true;
    }
    useEffect(() => {
        const socket = socketIOClient(ENDPOINT,{'forceNew':true });
        socket.on("model", model => {
            const modelArr = [];
            const newArr = [];
            if(listSV !== ""){
                for(let i of listSV){
                    newArr.push(timeRun(i.name,model));
                }
                if(EqualArray(newArr,fileRun) === false){
                    setFileRun([...newArr]);
                }
            }
            for(let i of model){
                modelArr.push({
                    name:i.name,
                    status:checkStatus(i),
                    number_run:i.number_run,
                    time_run:i.time_run,
                    Server_Run:i.Server_Run
                })
            }
            setModels([...modelArr]);
        });
        return () => {socket.disconnect();socket.close()};
    }, [listSV,fileRun]);

    useEffect(()=>{
        fetchStatus();
        fetchModel();
        fetchListSV();
    },[]);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="wrap-page-home">
            <p className="content-title">List Config</p>
            <Table className="content-table"
                onRow={(record, rowIndex) => {
                    return {
                    onClick: event => { setDetail(record.server);
                                        setShowDetail(true);}, // click row
                    };
                }} 
                columns={columns} dataSource={data}  
                pagination={false}
                scroll={{ y: 360 }} loading={spin}/>
            <div className="content-btn">
                <button onClick={()=>{
                    status.status === 0 ? onPower(0): onPower(1);
                }}
                style={{backgroundColor: status.status === 1 ? "rgba(242,45,45,255)": "rgba(55,152,65,255)"}}
                ><Power/> {status.status === 1 ? "STOP" : "START"}</button>
            </div>
            <Modal
                title={`Detail Server ${detail}`} 
                visible={showDetail}
                onCancel={()=>setShowDetail(false)}
                cancelButtonProps ={{ style:{ display: 'none' }} }
                okButtonProps={{ style:{ display: 'none' }} }
                centered
                width="1000px"
                className="modal-detail-server"
            >
                <div className="wrap-table-detail">
                    <Table className="content-table"
                        columns={columnsDetail} dataSource={dataDetail}  
                        pagination={false}
                        scroll={{ y: 360 }} loading={spin}/>
                </div>
            </Modal>
        </div>
    )
}

export default Home;

