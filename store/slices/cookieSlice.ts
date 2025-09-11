import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CookiePreferences, DEFAULT_COOKIE_PREFERENCES } from '@/lib/cookie-utils';

interface CookieState {
  consent: 'accepted' | 'declined' | null;
  preferences: CookiePreferences;
  isVisible: boolean;
}

const initialState: CookieState = {
  consent: null,
  preferences: DEFAULT_COOKIE_PREFERENCES,
  isVisible: false,
};

const cookieSlice = createSlice({
  name: 'cookie',
  initialState,
  reducers: {
    setConsent: (state, action: PayloadAction<'accepted' | 'declined'>) => {
      state.consent = action.payload;
      state.isVisible = false;
    },
    setPreferences: (state, action: PayloadAction<Partial<CookiePreferences>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setVisibility: (state, action: PayloadAction<boolean>) => {
      state.isVisible = action.payload;
    },
    initializeCookieState: (state, action: PayloadAction<{ consent: 'accepted' | 'declined' | null; preferences: CookiePreferences }>) => {
      state.consent = action.payload.consent;
      state.preferences = action.payload.preferences;
      state.isVisible = !action.payload.consent; // Show popup if no consent given
    },
    resetCookieState: (state) => {
      state.consent = null;
      state.preferences = DEFAULT_COOKIE_PREFERENCES;
      state.isVisible = true;
    },
    hideCookiePopup: (state) => {
      state.isVisible = false;
    },
  },
});

export const { 
  setConsent, 
  setPreferences, 
  setVisibility, 
  initializeCookieState, 
  resetCookieState,
  hideCookiePopup
} = cookieSlice.actions;

export default cookieSlice.reducer;
