import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BlogState {
  blogSettings: any;
  blogPosts: any;
  blogIcons: any;
  categories: any;
  users: any;
}

const initialState: BlogState = {
  blogSettings: null,
  blogPosts: null,
  blogIcons: null,
  categories: null,
  users: null,
};

const blogSlice = createSlice({
  name: "blog",
  initialState,
  reducers: {
    setBlogSettingsData: (state, action: PayloadAction<any>) => {
      state.blogSettings = action.payload;
    },
    setBlogPostsData: (state, action: PayloadAction<any>) => {
      state.blogPosts = action.payload;
    },
    setBlogIconsData: (state, action: PayloadAction<any>) => {
      state.blogIcons = action.payload;
    },
    setCategoriesData: (state, action: PayloadAction<any>) => {
      state.categories = action.payload;
    },
    setUsersData: (state, action: PayloadAction<any>) => {
      state.users = action.payload;
    },
  },
});

export const { 
  setBlogSettingsData, 
  setBlogPostsData, 
  setBlogIconsData, 
  setCategoriesData, 
  setUsersData 
} = blogSlice.actions;
export default blogSlice.reducer;
