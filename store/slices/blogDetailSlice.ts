import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlogDetailState {
  blogPosts: any;
  blogIcons: any;
  blogSettings: any;
}

const initialState: BlogDetailState = {
  blogPosts: null,
  blogIcons: null,
  blogSettings: null,
};

const blogDetailSlice = createSlice({
  name: "blogDetail",
  initialState,
  reducers: {
    setBlogPostsData: (state, action: PayloadAction<any>) => {
      state.blogPosts = action.payload;
    },
    setBlogIconsData: (state, action: PayloadAction<any>) => {
      state.blogIcons = action.payload;
    },
    setBlogSettingsData: (state, action: PayloadAction<any>) => {
      state.blogSettings = action.payload;
    },
  },
});

export const { 
  setBlogPostsData, 
  setBlogIconsData, 
  setBlogSettingsData 
} = blogDetailSlice.actions;
export default blogDetailSlice.reducer;
