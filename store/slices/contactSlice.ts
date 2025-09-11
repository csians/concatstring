import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ContactState {
  contactUs: any;
  contactFaq: any;
}

const initialState: ContactState = {
  contactUs: null,
  contactFaq: null,
};

const contactSlice = createSlice({
  name: "contact",
  initialState,
  reducers: {
    setContactUsData: (state, action: PayloadAction<any>) => {
      state.contactUs = action.payload;
    },
    setContactFaqData: (state, action: PayloadAction<any>) => {
      state.contactFaq = action.payload;
    },
  },
});

export const { 
  setContactUsData, 
  setContactFaqData 
} = contactSlice.actions;
export default contactSlice.reducer;
