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
    editListSV: (data,params1,params2)=>{
        const url = `/api/listServer/${params1}/${params2}`;
        return axiosClient.put(url,data);
    },
    removeListSV: (params1,params2)=>{
        const url = `/api/listServer/${params1}/${params2}`;
        return axiosClient.delete(url);
    },
    updateUsage: (data,params1,params2)=>{
        const url = `/api/listServer/usage/${params1}/${params2}`;
        return axiosClient.post(url,data);
    }
}

export default listSvApi;