import { createReducer,createAsyncThunk} from '@reduxjs/toolkit';
import listSvApi from '../../Api/listSvApi';

const initialState = {
    loading:false,
    data: "",
    postListSV:"",
    putListSV:"",
    removeListSV:"",
    error:null,
    updateUsage:"",
}

export const postListSV = createAsyncThunk(
    'status/postListSV',
    async (server, { rejectWithValue }) => { 
        try {
            const response = await listSvApi.postListSV(server);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
  )

export const putListSV = createAsyncThunk(
'status/putListSV',
    async (server, { rejectWithValue }) => { 
        try {
            console.log(server);
            const response = await listSvApi.editListSV(server.server,server.oldName,server.oldDevice);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)

export const getListSV = createAsyncThunk(
'status/getListSV',
    async (server, { rejectWithValue }) => { 
        try {
            const response = await listSvApi.getListSV();
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)
export const removeListSV = createAsyncThunk(
    'status/removeListSV',
    async (params, { rejectWithValue }) => { 
        try {
            const response = await listSvApi.removeListSV(params.name,params.Device);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)

export const updateUsage = createAsyncThunk(
    'status/updateUsage',
    async (usage, { rejectWithValue }) => { 
        try {
            const response = await listSvApi.updateUsage(usage,usage.name,usage.Device);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)

const list_svReducer = createReducer(initialState, {
    [postListSV.pending]: (state, action) => {state.loading = true},
    [postListSV.fulfilled]: (state, action) => {
        state.loading = false;
        state.postListSV = action.payload;
    },
    [postListSV.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [putListSV.pending]: (state, action) => {state.loading = true},
    [putListSV.fulfilled]: (state, action) => {
        state.loading = false;
        state.putListSV = action.payload;
    },
    [putListSV.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [getListSV.pending]: (state, action) => {state.loading = true},
    [getListSV.fulfilled]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getListSV.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [removeListSV.pending]: (state, action) => {state.loading = true},
    [removeListSV.fulfilled]: (state, action) => {
        state.loading = false;
        state.removeListSV = action.payload;
    },
    [removeListSV.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [updateUsage.pending]: (state, action) => {state.loading = true},
    [updateUsage.fulfilled]: (state, action) => {
        state.loading = false;
        state.updateUsage = action.payload;
    },
    [updateUsage.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }

})

export default list_svReducer;