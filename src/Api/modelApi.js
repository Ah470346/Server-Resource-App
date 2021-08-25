import axiosClient from './axiosClient';

const modelApi = {
    getAll:(params)=>{
        const url = `/api/model/all`;
        return axiosClient.get(url,params);
    },
    getModel: (params)=>{
        const url = `/api/model/${params}`;
        return axiosClient.get(url);
    },
    postModel: (data,params)=>{
        const url = '/api/model';
        return axiosClient.post(url,data,params);
    },
    editModel: (data,params)=>{
        const url = `/api/model/${params}`;
        return axiosClient.put(url,data);
    },
    removeModel: (params)=>{    
        const url = `/api/model/${params}`;
        return axiosClient.delete(url);
    }
}

export default modelApi;