import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  permission:"login",...localStorage
}

export const permissionSlice = createSlice({
  name: 'permission',
  initialState,
  reducers: {
    addPermission: (state,action) => {
      state.permission = action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { addPermission } = permissionSlice.actions;

export default permissionSlice.reducer;