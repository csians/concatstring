// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import homeReducer from "./slices/homeSlice";
import aboutReducer from "./slices/aboutSlice";
import authorReducer from "./slices/authorSlice";
import blogReducer from "./slices/blogSlice";
import blogDetailReducer from "./slices/blogDetailSlice";
import contactReducer from "./slices/contactSlice";
import eventsReducer from "./slices/eventsSlice";
import teamReducer from "./slices/teamSlice";
import servicesReducer from "./slices/servicesSlice";
import serviceDetailsReducer from "./slices/serviceDetailsSlice";
import projectDetailsReducer from "./slices/projectDetailsSlice";
import cookieReducer from "./slices/cookieSlice";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const rootReducer = combineReducers({
  home: homeReducer,
  about: aboutReducer,
  author: authorReducer,
  blog: blogReducer,
  blogDetail: blogDetailReducer,
  contact: contactReducer,
  events: eventsReducer,
  team: teamReducer,
  services: servicesReducer,
  serviceDetails: serviceDetailsReducer,
  projectDetails: projectDetailsReducer,
  cookie: cookieReducer
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["home", "about", "author", "blog", "blogDetail", "contact", "events", "projectDetail", "services", "serviceDetails", "projectDetails", "cookie", "team"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
