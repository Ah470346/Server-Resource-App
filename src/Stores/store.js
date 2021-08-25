import { configureStore } from '@reduxjs/toolkit';
import permissionReducer from './permission/slice';
import authReducer from './auth/slice';
import statusReducer from './status/slice';
import list_svReducer from './list_sv/slice';
import modelReducer from './model_run/slice';

const reducer = {
  permission: permissionReducer,
  auth: authReducer,
  status: statusReducer,
  listSV: list_svReducer,
  model: modelReducer
};

export const store = configureStore({reducer});