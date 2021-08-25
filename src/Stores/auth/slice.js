import { createReducer,createAsyncThunk} from '@reduxjs/toolkit';
import authApi from '../../Api/authApi';

const initialState = {
    loading:false,
    isAuth: false,
    error:null
}

export const postAuth = createAsyncThunk(
    'user/postAuth',
    async (user, { rejectWithValue }) => { 
        try {
            const response = await authApi.postAuth(user);
            return response;
        } catch (err) {
        // Use `err.response.data` as `action.payload` for a `rejected` action,
        // by explicitly returning it using the `rejectWithValue()` utility
            return rejectWithValue(err.response.data);
        }
    }
  )

const authReducer = createReducer(initialState, {
    [postAuth.pending]: (state, action) => {state.loading = true},
    [postAuth.fulfilled]: (state, action) => {
        state.loading = false;
        state.isAuth = true;
    },
    [postAuth.rejected]: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }
})

export default authReducer;