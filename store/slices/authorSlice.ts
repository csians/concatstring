import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthorState {
  authors: any;
  blogIcons: any;
}

const initialState: AuthorState = {
  authors: null,
  blogIcons: null,
};

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    setAuthorsData: (state, action: PayloadAction<any>) => {
      state.authors = action.payload;
    },
    setBlogIconsData: (state, action: PayloadAction<any>) => {
      state.blogIcons = action.payload;
    },
  },
});

export const { setAuthorsData, setBlogIconsData } = authorSlice.actions;
export default authorSlice.reducer;
