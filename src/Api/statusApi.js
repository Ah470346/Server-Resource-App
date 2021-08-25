import axiosClient from './axiosClient';

const statusApi = {
    getStatus: (data,params)=>{
        const url = '/api/status';
        return axiosClient.get(url,data,params);
    },
    postStatus: (data,params)=>{
        const url = '/api/status';
        return axiosClient.post(url,data,params);
    }
}

export default statusApi;