import axiosClient from './axiosClient';

const listSvApi = {
    getListSV: (data,params)=>{
        const url = '/api/listServer';
        return axiosClient.get(url,data,params);
    },
    postListSV: (data,params)=>{
        const url = '/api/listServer';
        return axiosClient.post(url,data,params);
    },
    editListSV: (data,params)=>{
        const url = `/api/listServer/${params}`;
        return axiosClient.put(url,data);
    },
    removeListSV: (params)=>{
        const url = `/api/listServer/${params}`;
        return axiosClient.delete(url);
    },
    updateUsage: (data,params)=>{
        const url = `/api/listServer/usage/${params}`;
        return axiosClient.post(url,data);
    }
}

export default listSvApi;