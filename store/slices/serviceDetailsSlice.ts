import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ServiceDetailsState {
  serviceBannerFull: any;
  serviceSolutions: any;
  serviceBanner: any;
  serviceTechnologies: any;
  serviceWhyChooseUs: any;
  serviceWhyConcatString: any;
  serviceIndustries: any;
  serviceProcess: any;
  serviceStartBuilding: any;
  serviceFaq: any;
}

const initialState: ServiceDetailsState = {
  serviceBannerFull: null,
  serviceSolutions: null,
  serviceBanner: null,
  serviceTechnologies: null,
  serviceWhyChooseUs: null,
  serviceWhyConcatString: null,
  serviceIndustries: null,
  serviceProcess: null,
  serviceStartBuilding: null,
  serviceFaq: null,
};

const serviceDetailsSlice = createSlice({
  name: "serviceDetails",
  initialState,
  reducers: {
    setServiceBannerFull: (state, action: PayloadAction<any>) => {
      state.serviceBannerFull = action.payload;
    },
    setServiceSolutions: (state, action: PayloadAction<any>) => {
      state.serviceSolutions = action.payload;
    },
    setServiceBanner: (state, action: PayloadAction<any>) => {
      state.serviceBanner = action.payload;
    },
    setServiceTechnologies: (state, action: PayloadAction<any>) => {
      state.serviceTechnologies = action.payload;
    },
    setServiceWhyChooseUs: (state, action: PayloadAction<any>) => {
      state.serviceWhyChooseUs = action.payload;
    },
    setServiceWhyConcatString: (state, action: PayloadAction<any>) => {
      state.serviceWhyConcatString = action.payload;
    },
    setServiceIndustries: (state, action: PayloadAction<any>) => {
      state.serviceIndustries = action.payload;
    },
    setServiceProcess: (state, action: PayloadAction<any>) => {
      state.serviceProcess = action.payload;
    },
    setServiceStartBuilding: (state, action: PayloadAction<any>) => {
      state.serviceStartBuilding = action.payload;
    },
    setServiceFaq: (state, action: PayloadAction<any>) => {
      state.serviceFaq = action.payload;
    },
  },
});

export const {
  setServiceBannerFull,
  setServiceSolutions,
  setServiceBanner,
  setServiceTechnologies,
  setServiceWhyChooseUs,
  setServiceWhyConcatString,
  setServiceIndustries,
  setServiceProcess,
  setServiceStartBuilding,
  setServiceFaq
} = serviceDetailsSlice.actions;

export default serviceDetailsSlice.reducer;
