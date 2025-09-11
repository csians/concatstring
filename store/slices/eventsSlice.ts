import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventsState {
  eventsBanner: any;
  lifeAtCompany: any;
}

const initialState: EventsState = {
  eventsBanner: null,
  lifeAtCompany: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventsBannerData: (state, action: PayloadAction<any>) => {
      state.eventsBanner = action.payload;
    },
    setLifeAtCompanyData: (state, action: PayloadAction<any>) => {
      state.lifeAtCompany = action.payload;
    },
  },
});

export const {
  setEventsBannerData,
  setLifeAtCompanyData
} = eventsSlice.actions;
export default eventsSlice.reducer;
