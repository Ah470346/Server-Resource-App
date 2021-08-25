import { createReducer,createAsyncThunk} from '@reduxjs/toolkit';
import statusApi from '../../Api/statusApi';

const initialState = {
    loading:false,
    data: "",
    postStatus:"",
    error:null
}

export const postStatus = createAsyncThunk(
    'status/postStatus',
    async (status, { rejectWithValue }) => { 
        try {
            const response = await statusApi.postStatus(status);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
  )

export const getStatus = createAsyncThunk(
'status/getStatus',
async (status, { rejectWithValue }) => { 
    try {
        const response = await statusApi.getStatus();
        return response;
    } catch (err) {
    // Use `err.response.data` as `action.payload` for a `rejected` action,
    // by explicitly returning it using the `rejectWithValue()` utility
        return rejectWithValue(err.response.data);
    }
}
)

const statusReducer = createReducer(initialState, {
    [postStatus.pending]: (state, action) => {state.loading = true},
    [postStatus.fulfilled]: (state, action) => {
        state.loading = false;
        state.postStatus = action.payload;
    },
    [postStatus.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    },
    [getStatus.pending]: (state, action) => {state.loading = true},
    [getStatus.fulfilled]: (state, action) => {
        state.loading = false;
        state.data = action.payload;
    },
    [getStatus.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }

})

export default statusReducer;