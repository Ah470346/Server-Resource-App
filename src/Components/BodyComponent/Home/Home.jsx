import React,{useState,useEffect} from'react';
import {getStatus,postStatus} from '../../../Stores/status/slice';
import {getListSV} from '../../../Stores/list_sv/slice';
import {getModel} from '../../../Stores/model_run/slice';
import {useSelector,useDispatch} from 'react-redux';
import {ReactComponent as Power} from '../../../Assets/power-button.svg'; 
import {ReactComponent as Success} from '../../../Assets/success.svg'; 
import {Table,Modal} from 'antd';

function Home({columns,columnsDetail}) {
    const dispatch = useDispatch();
    const fetchStatus = () => dispatch(getStatus());
    const fetchListSV = () => dispatch(getListSV());
    const fetchModel = (param) => dispatch(getModel(param));
    const pushStatus = (status) => dispatch(postStatus(status));
    const status = useSelector(state => state.status.data);
    const listSV = useSelector(state => state.listSV.data);
    const models = useSelector(state => state.model.data);
    const [spin,setSpin] = useState(false);
    const [detail,setDetail] = useState("");
    const [showDetail,setShowDetail] = useState(false);
    const timeRun = (model) => {
        const result = {
            total:"",
            run: 0,
            status:""
        }
        const currentDate = new Date();
        const filterModels = models.filter((i)=>{
            return i.Server_Run === model;
        });
        result.total = filterModels.length;
        for(let i of filterModels){
            const date = new Date(i.time_run);
            if((currentDate-date)/1000 >= 60 && i.number_run >= 3){
                result.status = "error";
            } else if((currentDate-date)/1000 >= 60 && i.number_run <= 2 && result.status !== "error") {
                result.status= "warning";
            } else if((currentDate-date)/1000 < 60){
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
            file: <div className="file">2/2 <Success style={{with:"18px",height:"18px"}}></Success></div>
        }
    });
    const dataDetail = models !== "" && models.map((i,index)=>{
        return {
            key: index + 1,
            number: index + 1,
            file: i.name,
            status:<div className="status">
                <span></span>
                Ok
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

    useEffect(()=>{
        fetchStatus();
        fetchListSV();
    },[]);// eslint-disable-line react-hooks/exhaustive-deps
    return (
        <div className="wrap-page-home">
            <p className="content-title">List Config</p>
            <Table className="content-table"
                onRow={(record, rowIndex) => {
                    return {
                    onClick: event => { setDetail(record.server);
                                        setShowDetail(true);
                                        fetchModel(record.server)}, // click row
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

