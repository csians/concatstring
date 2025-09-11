import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types
type EmpoweringData = any;
type AboutBannerData = any;
type WhoWeAreData = any;
type AboutTechnologiesData = any;
type RoadTraveledData = any;
type WorkingMethodData = any;
type MeetOurTeamData = any;
type TurningVisionData = any;

// --- State
interface AboutState {
  empowering: EmpoweringData | null;
  aboutBanner: AboutBannerData | null;
  whoWeAre: WhoWeAreData | null;
  aboutTechnologies: AboutTechnologiesData | null;
  roadTraveled: RoadTraveledData | null;
  workingMethod: WorkingMethodData | null;
  meetOurTeam: MeetOurTeamData | null;
  turningVision: TurningVisionData | null;
}

const initialState: AboutState = {
  empowering: null,
  aboutBanner: null,
  whoWeAre: null,
  aboutTechnologies: null,
  roadTraveled: null,
  workingMethod: null,
  meetOurTeam: null,
  turningVision: null
};

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    setEmpoweringData(state, action: PayloadAction<EmpoweringData>) {
      state.empowering = action.payload;
    },
    setAboutBannerData(state, action: PayloadAction<AboutBannerData>) {
      state.aboutBanner = action.payload;
    },
    setWhoWeAreData(state, action: PayloadAction<WhoWeAreData>) {
      state.whoWeAre = action.payload;
    },
    setAboutTechnologiesData(state, action: PayloadAction<AboutTechnologiesData>) {
      state.aboutTechnologies = action.payload;
    },
    setRoadTraveledData(state, action: PayloadAction<RoadTraveledData>) {
      state.roadTraveled = action.payload;
    },
    setWorkingMethodData(state, action: PayloadAction<WorkingMethodData>) {
      state.workingMethod = action.payload;
    },
    setMeetOurTeamData(state, action: PayloadAction<MeetOurTeamData>) {
      state.meetOurTeam = action.payload;
    },
    setTurningVisionData(state, action: PayloadAction<TurningVisionData>) {
      state.turningVision = action.payload;
    },
  },
});

export const { 
  setEmpoweringData, 
  setAboutBannerData, 
  setWhoWeAreData, 
  setAboutTechnologiesData, 
  setRoadTraveledData, 
  setWorkingMethodData, 
  setMeetOurTeamData, 
  setTurningVisionData 
} = aboutSlice.actions;

export default aboutSlice.reducer;
