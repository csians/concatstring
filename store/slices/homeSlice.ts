// store/slices/homeSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// --- Types
type BannerData = any;
type TechnologiesData = any;
type TrustedData = any;
type ChooseUs = any;
type WorkImpact = any;
type Footer = any;
type CsianBlock = any
type LifeAtCompanyData = any
type WhyChooseData = any
type TechTalksData = any
type FaqData = any
type FooterData = any
type HeaderData = any

// --- State
interface HomeState {
  banner: BannerData | null;
  technologies: TechnologiesData | null;
  trusted: TrustedData | null;
  chooseUs: ChooseUs | null;
  workImpact: WorkImpact | null;
  csian: CsianBlock | null;
  lifeAtCompany: LifeAtCompanyData | null;
  whyChoose: WhyChooseData | null;
  techTalks: TechTalksData | null;
  faq: FaqData | null;
  footer: FooterData | null;
  header: HeaderData | null;
}

const initialState: HomeState = {
  banner: null,
  technologies: null,
  trusted: [],
  chooseUs: null,
  workImpact: null,
  csian: null,
  lifeAtCompany: null,
  whyChoose: null,
  techTalks: null,
  faq: null,
  footer: null,
  header: null
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setBanner(state, action: PayloadAction<BannerData>) {
      state.banner = action.payload;
    },
    setTechnologies(state, action: PayloadAction<TechnologiesData>) {
      state.technologies = action.payload;
    },
    setTrusted(state, action: PayloadAction<TrustedData>) {
      state.trusted = action.payload;
    },
    setChooseUs(state, action: PayloadAction<ChooseUs>) {
      state.chooseUs = action.payload;
    },
    setWorkImpact(state, action: PayloadAction<WorkImpact>) {
      state.workImpact = action.payload;
    },
    setCsianData(state, action: PayloadAction<CsianBlock>) {
      state.csian = action.payload;
    },
    setLifeAtCompanyData(state, action: PayloadAction<LifeAtCompanyData>) {
      state.lifeAtCompany = action.payload;
    },
    setWhyChooseData(state, action: PayloadAction<WhyChooseData>) {
      state.whyChoose = action.payload;
    },
    setFooterData(state, action: PayloadAction<FooterData>) {
      state.footer = action.payload;
    },
    setTechTalksData(state, action: PayloadAction<TechTalksData>) {
      state.techTalks = action.payload;
    },
    setFaqData(state, action: PayloadAction<FaqData>) {
      state.faq = action.payload;
    },
    setHeaderData(state, action: PayloadAction<HeaderData>) {
      state.header = action.payload;
    },
  },
});

export const { setBanner, setTechnologies, setTrusted, setChooseUs, setWorkImpact, setCsianData, setLifeAtCompanyData, setWhyChooseData, setFooterData, setTechTalksData, setFaqData, setHeaderData } = homeSlice.actions;
export default homeSlice.reducer;
