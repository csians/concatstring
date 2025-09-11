import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProjectDetailsState {
  projectData: any;
  projectOverview: any;
  projectService: any;
  projectTools: any;
  projectAchievements: any;
  projectResults: any;
  projectConclusion: any;
  projectClientFeedback: any;
  projectRelatedProjects: any;
}

const initialState: ProjectDetailsState = {
  projectData: null,
  projectOverview: null,
  projectService: null,
  projectTools: null,
  projectAchievements: null,
  projectResults: null,
  projectConclusion: null,
  projectClientFeedback: null,
  projectRelatedProjects: null,
};

const projectDetailsSlice = createSlice({
  name: "projectDetails",
  initialState,
  reducers: {
    setProjectData: (state, action: PayloadAction<any>) => {
      state.projectData = action.payload;
    },
    setProjectOverview: (state, action: PayloadAction<any>) => {
      state.projectOverview = action.payload;
    },
    setProjectService: (state, action: PayloadAction<any>) => {
      state.projectService = action.payload;
    },
    setProjectTools: (state, action: PayloadAction<any>) => {
      state.projectTools = action.payload;
    },
    setProjectAchievements: (state, action: PayloadAction<any>) => {
      state.projectAchievements = action.payload;
    },
    setProjectResults: (state, action: PayloadAction<any>) => {
      state.projectResults = action.payload;
    },
    setProjectConclusion: (state, action: PayloadAction<any>) => {
      state.projectConclusion = action.payload;
    },
    setProjectClientFeedback: (state, action: PayloadAction<any>) => {
      state.projectClientFeedback = action.payload;
    },
    setProjectRelatedProjects: (state, action: PayloadAction<any>) => {
      state.projectRelatedProjects = action.payload;
    },
  },
});

export const {
  setProjectData,
  setProjectOverview,
  setProjectService,
  setProjectTools,
  setProjectAchievements,
  setProjectResults,
  setProjectConclusion,
  setProjectClientFeedback,
  setProjectRelatedProjects,
} = projectDetailsSlice.actions;

export default projectDetailsSlice.reducer;
