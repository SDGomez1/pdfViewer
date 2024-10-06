import { configureStore } from "@reduxjs/toolkit";
import pdfViewSlice from "./features/pdfView/pdfViewSlice";

export const store = configureStore({
  reducer: {
    pdfView: pdfViewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
