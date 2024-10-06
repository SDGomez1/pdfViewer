import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  currentRealScale: number;
  currentScale: number;
  touchOrigin: {
    x: number;
    y: number;
  };
}

const initialState: CounterState = {
  currentScale: 1,
  currentRealScale: 1,
  touchOrigin: {
    x: 0,
    y: 0,
  },
};

export const pdfViewSlice = createSlice({
  name: "pdfView",
  initialState,
  reducers: {
    pdfViewUpdateScale: (state, action: PayloadAction<number>) => {
      state.currentScale = action.payload;
    },
    pdfViewUpdateCurrentScale: (state, action: PayloadAction<number>) => {
      state.currentRealScale = action.payload;
    },
    pdfViewUpdateTouchOrigin: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      state.touchOrigin = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  pdfViewUpdateScale,
  pdfViewUpdateCurrentScale,
  pdfViewUpdateTouchOrigin,
} = pdfViewSlice.actions;

export default pdfViewSlice.reducer;
