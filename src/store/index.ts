import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import directoryReducer from "./slices/directorySlice";
import inputsReducer from "./slices/inputsSlice";
import outputReducer from "./slices/outputsSlice";
import auditReducer from "./slices/auditSlice"; // 1. Импортируем новый слайс логов

export const store = configureStore({
  reducer: {
    auth: authReducer,
    directory: directoryReducer,
    inputs: inputsReducer,
    outputs: outputReducer,
    audit: auditReducer,
  },
});

// Эти типы нужны для файла hooks.ts из Шага 1
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
