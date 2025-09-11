import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TeamState {
  teamData: any | null;
}

const initialState: TeamState = {
  teamData: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    setTeamData: (state, action: PayloadAction<any>) => {
      state.teamData = action.payload;
    },
    clearTeamData: (state) => {
      state.teamData = null;
    },
  },
});

export const { setTeamData, clearTeamData } = teamSlice.actions;
export default teamSlice.reducer;
