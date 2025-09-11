import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServicesState {
  ourServiceBanner: any;
  digitalGrowthBanner: any;
  discoverOurServices: any;
  clientFeedbackServices: any;
}

const initialState: ServicesState = {
  ourServiceBanner: null,
  digitalGrowthBanner: null,
  discoverOurServices: null,
  clientFeedbackServices: null,
};

const servicesSlice = createSlice({
  name: "services",
  initialState,
  reducers: {
    setOurServiceBanner: (state, action: PayloadAction<any>) => {
      state.ourServiceBanner = action.payload;
    },
    setDigitalGrowthBanner: (state, action: PayloadAction<any>) => {
      state.digitalGrowthBanner = action.payload;
    },
    setDiscoverOurServices: (state, action: PayloadAction<any>) => {
      state.discoverOurServices = action.payload;
    },
    setClientFeedbackServices: (state, action: PayloadAction<any>) => {
      state.clientFeedbackServices = action.payload;
    },
  },
});

export const {
  setOurServiceBanner,
  setDigitalGrowthBanner,
  setDiscoverOurServices,
  setClientFeedbackServices
} = servicesSlice.actions;

export default servicesSlice.reducer;
