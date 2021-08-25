import { createReducer,createAsyncThunk} from '@reduxjs/toolkit';
import modelApi from '../../Api/modelApi';

const initialState = {
    loading:false,
    data: "",
    postModel:"",
    putModel:"",
    removeModel:"",
    error:null
}

export const postModel = createAsyncThunk(
    'model/postModel',
    async (model, { rejectWithValue }) => { 
        try {
            const response = await modelApi.postModel(model);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
  )

export const putModel = createAsyncThunk(
'model/putModel',
    async (model, { rejectWithValue }) => { 
        try {
            console.log(model.name);
            const response = await modelApi.editModel(model,model.name);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)

export const removeModel = createAsyncThunk(
'model/removeModel',
    async (params, { rejectWithValue }) => { 
        try {
            const response = await modelApi.removeModel(params);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)

export const getModel = createAsyncThunk(
'model/getModel',
    async (param, { rejectWithValue }) => { 
        try {
            const response = await modelApi.getModel(param);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
)

export const getAllModel = createAsyncThunk(
    'model/getAllModel',
        async (param, { rejectWithValue }) => { 
            try {
                const response = await modelApi.getAll();
                return response;
            } catch (err) {
            // Use `err.response.data` as `action.payload` for a `rejected` action,
            // by explicitly returning it using the `rejectWithValue()` utility
                return rejectWithValue(err.response.data);
            }
        }
    )

const modelReducer = createReducer(initialState, {
    [postModel.pending]: (state, action) => {state.loading = true},
    [postModel.fulfilled]: (state, action) => {
        state.loading = false;
        state.postModel = action.payload;
    },
    [postModel.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [getModel.pending]: (state, action) => {state.loading = true},
    [getModel.fulfilled]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getModel.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [getAllModel.pending]: (state, action) => {state.loading = true},
    [getAllModel.fulfilled]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getAllModel.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [putModel.pending]: (state, action) => {state.loading = true},
    [putModel.fulfilled]: (state, action) => {
        state.loading = false;
        state.putModel = action.payload;
    },
    [putModel.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [removeModel.pending]: (state, action) => {state.loading = true},
    [removeModel.fulfilled]: (state, action) => {
        state.loading = false;
        state.removeModel = action.payload;
    },
    [removeModel.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }

})

export default modelReducer;