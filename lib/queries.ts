import { gql } from '@apollo/client';

export const GET_HEADER_MENU = gql`
  query GetHeaderMenu {
    headerSettings {
      menuTitle
      headerSetting {
        concatstringLogo {
          node {
            altText
            sourceUrl
          }
        }
        csLogo {
          node {
            altText
            sourceUrl
          }
        }
        headerPaths {
          menuItems
          itemKey
          pathLink {
            title
            url
            target
          }
          pathSvg {
            node {
              altText
              sourceUrl
            }
          }
        }
        closeButtonTitle
        letsTalkTitle {
          title
          url
          target
        }
      }
    }
  }
`;

export const GET_FOOTER_MENU = gql`
  query GetFooterMenu {
    footerSettings {
      footerOptions {
        newsletterTitle
        footerPaths {
          pathLink {
            target
            title
            url
          }
        }
        servicesTitle
        serviceName {
          nodes {
            ... on Technology {
              title
            }
            id
            slug
          }
        }
        companyAddress
        companyNumber
        companyEmail
        rightsTitle
        termsLink {
          title
          url
        }
        privacyLink {
          title
          url
        }
      }
    }
  }
`;

export const GET_BANNER_CONTENT = gql`
  query GetBannerContent {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentBannerLayout {
            column {
              content
              link {
                title
                url
              }
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_TRUSTED_BRANDS = gql`
  query GetTrustedBrands {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentBrandGroupLayout {
            trustedTitle
            brandsImages {
              brandImage {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_OUR_TECHNOLOGIES = gql`
  query GetOurTechnologies {
  page(id: "cG9zdDoyMA==") {
    flexibleContent {
      flexibleContent {
        ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
          weProvideTitle
          provideDescription
          technologies {
            nodes {
              ... on Technology {
                technologiesSettings {
                  technologyName
                  technologyDescription
                  technologyImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  readMoreLink {
                    title
                    url
                  }
                }
              }
              slug
              id
            }
          }
          exploreTechnologies {
            title
            url
          }
        }
      }
    }
  }
}
`;

export const GET_CSIAN_CULTURE = gql`
  query GetCsianCulture {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentBecomeCsianLayout {
            toBecomeTitle
            csianTitle
            becomeCsian {
              url
              title
            }
            perks {
              gif {
                node {
                  altText
                  sourceUrl
                }
              }
              description
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_WHY_CHOOSE_US = gql`
  query GetWhyChooseUs {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentWhyChooseUsLayout {
            whyChooseUsTitle
            companyStatistic {
              statisticLabel
              statisticNumber
            }
          }
        }
      }
    }
  }
`;

// Query for WorkImpact section
export const GET_POWERFUL_IMPACTS = gql`
  query GetPowerfulImpacts {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            powerfulImpactTitle
            project {
              nodes {
                ... on Project {
                  id
                  title
                  projectSettings {
                    projectTechnologyName
                    projectName
                    projectDescription
                    projectImage {
                      node {
                        altText
                        mediaItemUrl
                      }
                    }
                    projectImageLabel
                    readStoryLink {
                      title
                      url
                    }
                    projectTechnologyImage {
                      node {
                        altText
                        mediaItemUrl
                      }
                    }
                    projectAnalysis {
                      projectKey
                      projectKeyPoints {
                        projectKeyPoint
                      }
                    }
                    techImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    techImageHover {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                  }
                }
                   slug
              }
            }
            viewMoreButton {
              title
              url
            }
          }
        }
      }
    }
  }
`;

export const GET_FAQ = gql`
  query GetFaq {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentFaqLayout {
            faqTitle
            faqData {
              nodes {
                ... on Faq {
                  content
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ABOUT_BANNER = gql`
  query GetAboutBanner {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentAboutBannerLayout {
            aboutBannerTitle
            aboutBannerVideo {
              node {
                altText
                mediaItemUrl
                mimeType
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_WHO_WE_ARE = gql`
  query GetWhoWeAre {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentWhoWeAreLayout {
            whoWeAreDescription
            whoWeAreTitle
            contactUsButton {
              title
              url
            }
            whoWeAreImage1 { node { sourceUrl altText } }
            whoWeAreImage2 { node { sourceUrl altText } }
            whoWeAreImage3 { node { sourceUrl altText } }
            whoWeAreImage4 { node { sourceUrl altText } }
            whoWeAreImage5 { node { sourceUrl altText } }
            whoWeAreImage6 { node { sourceUrl altText } }
            whoWeAreImageMain { node { sourceUrl altText } }
          }
        }
      }
    }
  }
`;

export const GET_ABOUT_TECHNOLOGIES = gql`
  query GetAboutTechnologies {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentAboutTechnologiesLayout {
            aboutTechnologiesTitle
            technologies {
              aboutTechnologyTitle
              aboutTechnologiesDescriptionTitle
              aboutTechnologiesImage {
                node {
                  altText
                  sourceUrl
                }
              }
              aboutTechnologyBackPic {
                node {
                  altText
                  sourceUrl
                }
              }
              description {
                listTitle
                technologyList {
                  technologyName
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ROAD_TRAVELED = gql`
  query GetRoadTraveled {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentRoadTraveledLayout {
            roadTraveledTitle
            companyGrowth {
              companyGrowthTitle
              growthDescription
              growthYear
              readMoreLink {
                url
              }
              color
              growthImage {
                node {
                  altText
                  sourceUrl
                }
              }
            }
          }
        }
      }
    }
  }
`;

// Query for Timeline (Road Traveled section)
export const GET_POWERFUL_IMPACTS_TIMELINE = gql`
  query GetPowerfulImpactsTimeline {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentRoadTraveledLayout {
            roadTraveledTitle
            companyGrowth {
              companyGrowthTitle
              growthDescription
              growthYear
              readMoreLink {
                title
                url
              }
              colour
            }
          }
        }
      }
    }
  }
`;

// Query for Working Method section
export const GET_WORKING_METHOD = gql`
  query GetWorkingMethod {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentWorkingMethodLayout {
            workingDescription
            workingMethodTitle
            contactUsButton {
              title
              url
            }
            workingCycle {
              workingCycleTitle
              workingCycleDescription
            }
          }
        }
      }
    }
  }
`;

export const GET_MEET_OUR_TEAM = gql`
  query GetMeetOurTeam {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentMeetOurTeamLayout {
            meetOurTeamTitle
            teamMember {
              nodes {
                ... on Team {
                  teamSetting {
                    memberName
                    memberShortDesignation
                    memberImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    memberGif {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    memberFullName
                    memberDesignation
                    memberDescription
                    memberInfo {
                      infoTitle
                      infoValue
                    }
                    socialLinkTitle
                    socialLink {
                      title
                      url
                    }
                    socialSvg {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    memberExperienceTitle
                    memberExperienceDiscription
                    profileSkillTitle
                    skillsDetail {
                      skillEndColour
                      skillPercentage
                      skillStartColour
                      skillTitle
                    }
                    memberDetailBackgroundImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                  }
                }
              }
            }
            meetEveryCsian {
              title
              url
            }
          }
        }
      }
    }
  }
`;

export const GET_TURNING_VISION_AND_WORKING_METHOD = gql`
  query GetTurningVisionAndWorkingMethod {
    page(id: "cG9zdDoyMg==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentTurningVisionLayout {
            turningVisionTitle
            projectSilder {
              nodes {
                ... on Project {
                  projectSettings {
                    relatedProjectName
                    arrowSvg {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    relatedProjectImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    projectLink {
                      url
                      title
                    }
                  }
                     slug
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_BANNER = gql`
  query GetServiceBanner {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    serviceName
                  }
                  featuredImage {
                    node {
                      sourceUrl
                      altText
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
export const GET_SERVICE_BANNER_FULL = gql`
  query GetServiceBanner {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    serviceTitle
                    serviceDescription
                    serviceFeature {
                      featureTitle
                      featureDescriptionTitle
                      featureDescription
                      fratureDescription {
                        listTitle
                        listDescription
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_SOLUTIONS = gql`
  query GetServiceSolutions {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    solutionTitle
                    solutionDescription
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MARKET_OPS = gql`
  query GetMarketOps {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    heading
                    subHeading
                  }
                  featuredImage {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PROJECT_OVERVIEW = gql`
  query GetProjectOverview {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    projectOverviewTitle
                    projectOverviewDescription
                    projectOverviewImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_PROJECT_SERVICES = gql`
  query GetProjectServices {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    serviceTitle
                    services {
                      service
                    }
                    serviceImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    servicePhoto {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    serviceHighlight {
                      serviceHighlightTitle
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TOOLS_BEHIND = gql`
  query GetToolsBehind {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    toolStack {
                      toolName
                    }
                    toolBuildTitle
                    serviceLogo {
                      node {
                        altText
                        title
                        sourceUrl
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_WHAT_WE_ACHIEVED = gql`
  query GetWhatWeAchieved {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    achievedBlocks {
                      archivedNumber
                      achievedTitle
                    }
                    weAchievedTitle
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_CLIENT_FEEDBACK = gql`
  query GetClientFeedback {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    clientFeedbackTiitle
                    clientFeedbacks {
                      nodes {
                        ... on Testimonial {
                          testimonialSettings {
                            clientName
                            clientFeedback
                            clientDesignation
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_RELATED_PROJECTS = gql`
  query GetRelatedProjects {
    page(id: "cG9zdDo4MTE=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurPowerfulImpactsLayout {
            project {
              nodes {
                ... on Project {
                  projectSettings {
                    relatedProjectTitle
                    projects {
                      nodes {
                        ... on Project {
                          projectSettings {
                            relatedProjectName
                            relatedProjectImage {
                              node {
                                altText
                                sourceUrl
                              }
                            }
                            projectLink {
                              title
                              url
                            }
                            arrowSvg {
                              node {
                                altText
                                sourceUrl
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_TECHNOLOGIES = gql`
  query GetServiceTechnologies {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    technologyUseTitle
                    technologyUsedDescription
                    techStack {
                      techStackName
                      techSubStack {
                        techSubStackName
                        techSubStackLogo {
                          node {
                            altText
                            sourceUrl
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_WHY_CONCATSTRING_PARTNER = gql`
  query GetWhyConcatstringPartner {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    concatstringPartnerTitle
                    partnerImage {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    partnerFeatures {
                      featureTitle
                      featureDescription
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_INDUSTRIES = gql`
  query GetServiceIndustries {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    industryServeTitle
                    industriesName {
                      industryName
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_START_BUILDING = gql`
  query GetStartBuilding {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    startBuildingTitle
                    startBuildingDescription
                    digitalPresenceTitle
                    getInTouchTitle
                    contactDetails {
                      contactTitle {
                        title
                        url
                      }
                    }
                    phoneSvg {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    contactNumber
                    mailSvg {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    emailAddress
                    getInTouchButton {
                      title
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_PROCESS_FLOW = gql`
  query GetServiceProcessFlow($id: ID!) {
    page(id: $id) {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    ourProcessTitle
                    processFlow {
                      processCount
                      processTitle
                      processDescription
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_DETAIL_FAQ = gql`
  query GetServiceDetailFaq {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    faqTitle
                    faq {
                      nodes {
                        ... on Faq {
                          title
                          content
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_SERVICE_DETAIL_WHY_CHOOSE_US = gql`
  query GetServiceDetailWhyChooseUs {
    page(id: "cG9zdDoyNzg=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurTechnologiesLayout {
            technologies {
              nodes {
                ... on Technology {
                  technologiesSettings {
                    whyChooseTitle
                    companyStatistic {
                      statisticLabel
                      statisticNumber
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_MARKET_OPS_AND_OVERVIEW = gql`
  query GetMarketOpsAndOverview($slug: ID!) {
    project(id: $slug, idType: SLUG) {
     slug
    title
    content
    featuredImage {
      node {
        sourceUrl
        altText
      }
    }
    projectSettings {
      heading
      subHeading
      aboutCsTitle
      aboutCsDescription
      caseStudyClientFeedbackTitle
      caseStudyClientFeedbackDescription
      keyObjectiveTitle
      businessPerformanceTitle
      businessPerformanceImage {
        node {
          altText
          sourceUrl
        }
      }
      performanceList {
        performanceList
      }
      resultTitle
      resultKeyPoints {
        resultList
      }
      resultImage {
        node {
          altText
          sourceUrl
        }
      }
      conclusionTitle
      conclusionDescription
      projectOverviewTitle
      projectOverviewDescription
      projectOverviewImage {
        node {
          altText
          sourceUrl
        }
      }
      serviceTitle
      services {
        service
        servicesDescription
      }
      serviceImage {
        node {
          altText
          sourceUrl
        }
      }
      ourApproachDescription
      servicePhoto {
        node {
          altText
          sourceUrl
        }
      }
      serviceHighlight {
        serviceHighlightTitle
      }
      weAchievedTitle
      achievedBlocks {
        archivedNumber
        achievedTitle
      }
      clientFeedbackTiitle
      clientFeedbacks {
        nodes {
          ... on Testimonial {
            testimonialSettings {
              clientName
              clientDesignation
              clientFeedback
            }
            featuredImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
      relatedProjectTitle
      projects {
        nodes {
          ... on Project {
            projectSettings {
              relatedProjectName
              relatedProjectImage {
                node {
                  sourceUrl
                  altText
                }
              }
              projectLink {
                url
                target
              }
              arrowSvg {
                node {
                  sourceUrl
                  altText
                }
              }
            }
          }
        }
      }
      relatedProjectImage {
        node {
          altText
          sourceUrl
        }
      }
      relatedProjectName
    }
    }
  }
`;

export const GET_CONTACT_US = gql`
  query GetContactUs {
    page(id: "cG9zdDoyNjU=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentContactUsLayout {
            contactTitle
            contactUsDescription
            joinOurTeamLink
          }
        }
      }
    }
  }
`;

export const GET_CONTACT_FAQ = gql`
  query GetContactFaq {
    page(id: "cG9zdDoyNjU=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentContactUsLayout {
            faqTitle
            contactFaq {
              nodes {
                ... on Faq {
                  content
                  title
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_DIGITAL_GROWTH_BANNER = gql`
  query GetDigitalGrowthBanner {
    page(id: "cG9zdDo4Mzk=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentDigitalGrowthLayout {
            digitalGrowthTitle
            growthDescription
          }
        }
      }
    }
  }
`;

export const GET_DISCOVER_OUR_SERVICES = gql`
  query GetDiscoverOurServices {
  page(id: "cG9zdDo4Mzk=") {
    flexibleContent {
      flexibleContent {
        ... on FlexibleContentFlexibleContentDiscoverOurServicesLayout {
          discoverServicesTitle
          ourServicesTechnology {
            nodes {
              ... on Technology {
                technologiesSettings {
                  ourServiceTitle
                  ourServiceDescription
                  ourServiceLink {
                    url
                    target
                  }
                  ourServiceSvg {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  redirectSvg {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  webServicesList {
                    nodes {
                      ... on Technology {
                        id
 technologiesSettings {
                    ourServiceTitle
                    ourServiceDescription
                    ourServiceLink {
                      url
                      target
                    }
                    ourServiceSvg {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    redirectSvg {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                  }
slug
              id
                      }
                    }
                  }
                }
              }
              slug
              id
            }
          }
        }
      }
    }
  }
}
`;

export const GET_CLIENT_FEEDBACK_SERVICES = gql`
  query GetClientFeedbackServices {
  page(id: "cG9zdDo4Mzk=") {
    flexibleContent {
      flexibleContent {
        ... on FlexibleContentFlexibleContentClientFeedBackLayout {
          feedbackTitle
          clientFeedback {
            nodes {
              ... on Testimonial {
                testimonialSettings {
                  clientFeedback
                  clientName
                  clientDesignation
                }
                featuredImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

export const GET_OUR_SERVICE_BANNER = gql`
  query GetOurServiceBanner {
    page(id: "cG9zdDo4Mzk=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentOurServiceBannerLayout {
            ourServiceTitle
            serviceVideo {
              node {
                mediaItemUrl
                mimeType
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_EVENTS_BANNER = gql`
  query GetEventsBanner {
    page(id: "cG9zdDo5NzM=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentEventsBannerLayout {
            eventBannerTitle
            eventBannerImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_LIFE_AT_COMPANY = gql`
  query GetLifeAtCompany {
    page(id: "cG9zdDo5NzM=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentLifeAtCompanyLayout {
            lifeAtCompanyTitle
            lifeAtCompanyContent
            mostRecentEventsTitle
            events {
              nodes {
                ... on Event {
                  id
                  slug
                  eventSettings {
                    eventTitle
                    eventDate
                    eventDescription
                    eventViewMoreLink {
                      title
                      url
                    }
                    eventImages {
                      eventImage {
                        node {
                          altText
                          sourceUrl
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_LIFE_AT_COMPANY_WITH_EVENTS = gql`
  query GetLifeAtCompany {
    page(id: "cG9zdDoyMA==") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentLifeAtCompanyLayout {
            lifeAtCompanyTitle
            eventPageLink {
              title
              url
            }
            events {
              nodes {
                ... on Event {
                  id
                  slug
                  eventSettings {
                    eventDate
                    eventDescription
                    eventTitle
                    eventImages {
                      eventImage {
                        node {
                          altText
                          sourceUrl
                        }
                      }
                    }
                    eventViewMoreLink {
                      title
                      url
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_EVENT_RECENT_IMAGES = gql`
  query GetEventRecentImages {
    page(id: "cG9zdDo5NzM=") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentEventRecentImagesLayout {
            eventRecentImageContent {
              eventRecentImagesDate
              eventRecentImagesImage {
                node {
                  sourceUrl
                  altText
                }
              }
              eventRecentImagesViewMore {
                target
                title
                url
              }
              eventRecentImagesTitle
            }
            eventRecentImagesViewMoreImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_TEAM_LISTING = gql`
  query GetTeamListing {
    page(id: "cG9zdDoxMDEx") {
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentTeamListingLayout {
            teamGroup {
              teamGroupTitle
              teamMember(first: 50) {
                nodes {
                  ... on Team {
                    teamSetting {
                      memberName
                      memberShortDesignation
                      memberImage {
                        node {
                          altText
                          sourceUrl
                        }
                      }
                      memberGif {
                        node {
                          altText
                          sourceUrl
                        }
                      }
                      memberFullName
                      memberDesignation
                      memberDescription
                      memberInfo {
                        infoTitle
                        infoValue
                      }
                      socialLinkTitle
                      socialLink {
                        title
                        url
                      }
                      socialSvg {
                        node {
                          altText
                          sourceUrl
                        }
                      }
                      memberExperienceTitle
                      memberExperienceDiscription
                      profileSkillTitle
                      skillsDetail {
                        skillEndColour
                        skillPercentage
                        skillStartColour
                        skillTitle
                      }
                      memberDetailBackgroundImage {
                        node {
                          altText
                          sourceUrl
                        }
                      }
                    }
                  }
                }
              }
            }
            teamListBannerImage {
              node {
                altText
                sourceUrl
              }
            }
            teamListTitle
          }
        }
      }
    }
  }
`;

export const GET_BLOG_SETTINGS = gql`
  query GetBlogSettings {
    page(id: "cG9zdDoxMDcx") {
      blogSettings {
        heroSection {
          title
          image {
            node {
              altText
              link
              sourceUrl
              uri
              title
            }
          }
        }
        techTalks {
          title
          description
          readMore
          readMoreIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          commentIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          viewIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          dateIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          newIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
                latestPost(last: 1) {
            nodes {
              id
              slug
              date
              isComment
              status
              ... on Post {
                id
                content
                authorId
                author {
                  node {
                    id
                  }
                }
                terms(first: 10) {
                  edges {
                    node {
                      id
                      name
                      slug
                      link
                    }
                  }
                }
                link
                commentCount
                viewsCount
                featuredImage {
                  node {
                    uri
                    title
                    sourceUrl
                    altText
                  }
                }
              }
              link
              uri
            }
          }
        }
        writersList {
          title
          description
          designation
          buttonLabel
          buttonIcon {
            node {
              altText
              uri
              title
              sourceUrl
            }
          }
        }
        techStory {
          cards {
            title
            description
            buttonLink {
              target
              title
              url
            }
          }
          title
          description
        }
        blogList {
          categoryList {
            nodes {
              id
              link
              name
              slug
              count
              uri
            }
          }
        }
      }
    }
    users {
      nodes {
        id
        name
        slug
        username
        uri
        description
        avatar {
          url
        }
        userProfileImage {
          userProfileImage {
            node {
              altText
              id
              uri
              title
              sourceUrl
            }
          }
        }
      }
    }
  }
`;

export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($categorySlug: String, $perPage: Int, $after: String) {
  posts(where: {categoryName: $categorySlug}, first: $perPage, after: $after) {
    pageInfo {
      hasNextPage
      hasPreviousPage
      endCursor
      startCursor
    }
    nodes {
      id
      title
      slug
      excerpt
      date
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          id
        }
      }
      commentCount
      viewsCount
      link
      blogDetail {
        blogDetailContent
        blogDetailShotDesc
        viewAllBlog {
          title
          url
        }
      }
    }
  }
}
`;

export const GET_BLOG_ICONS = gql`
  query GetBlogIcons {
    page(id: "cG9zdDoxMDcx") {
      blogSettings {
        techTalks {
          title
          description
          readMore
          readMoreIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          commentIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          viewIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          dateIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
          newIcon {
            node {
              altText
              sourceUrl
              uri
              title
            }
          }
        }
      }
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      nodes {
        id
        name
        slug
        uri
        count
      }
    }
  }
`;
export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      content
      flexibleContent {
        flexibleContent {
          ... on FlexibleContentFlexibleContentFaqLayout {
            faqTitle
            faqData {
              nodes {
                ... on Faq {
                  id
                  title
                  content
                }
              }
            }
          }
        }
      }
      title
      content
      date
      commentCount
      viewsCount
    comments(where: {parent: 0, order: ASC}) {
      nodes {
        id
        databaseId
        content
        date
        approved
        author {
          node {
            id
            name
            ... on User {
              id
              email
              userProfileImage {
                userRole
                userProfileImage {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
          }
        }
        replies {
          nodes {
            id
            databaseId
            content
            date
            approved
            author {
              node {
                id
                name
                ... on User {
                  id
                  email
                  userProfileImage {
                    userRole
                  }
                }
              }
            }
          }
        }
      }
    }
     author {
      node {
        name
        uri
        description
        userProfileImage {
          userProfileImage {
            node {
              altText
              sourceUrl
            }
          }
          userRole
          socialMedia {
            socialLink {
              url
              title
            }
            socialSvg {
              node {
                altText
                sourceUrl
              }
            }
          }
             discoverMyJourneyTitle
          discoverSvg {
            node {
                altText
                sourceUrl
              }
          }
        }
        id
      }
    }
        blogDetail {
      blogDetailContent
      socialLinks {
        socialLink {
          url
          title
        }
        socialSvg {
          node {
            altText
            sourceUrl
          }
        }
      }
      blogDetailShotDesc
      shareItOnTitle
      dateSvg {
        node {
          altText
          sourceUrl
        }
      }
      moreFromMeTitle
      viewAllBlog {
        title
        url
      }
      aboutTheAuthorTitle
      subscribeMyArticleTitle
      subscribeDescription
      tableOfContent
    }
      terms {
        nodes {
          link
          slug
          name
          taxonomyName
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
    }
  }
`;

export const GET_SERVICE_BY_SLUG = gql`
  query GetServiceBySlug($slug: ID!) {
    technology(id: $slug, idType: SLUG) {
      slug
      title
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      technologiesSettings {
        serviceName
        serviceTitle
        serviceDescription
        serviceFeature {
          featureTitle
          featureDescriptionTitle
          featureDescription
          fratureDescription {
            listTitle
            listDescription
          }
        }
        solutionTitle
        solutionDescription
        technologyUseTitle
        technologyUsedDescription
        techStack {
          techStackName
          techSubStack {
            techSubStackName
            techSubStackLogo {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
        whyChooseTitle
        companyStatistic {
          statisticLabel
          statisticNumber
        }
        concatstringPartnerTitle
        partnerImage {
          node {
            altText
            sourceUrl
          }
        }
        partnerFeatures {
          featureTitle
          featureDescription
        }
        startBuildingTitle
        startBuildingDescription
        digitalPresenceTitle
        getInTouchTitle
        contactDetails {
          contactTitle {
            title
            url
          }
        }
        phoneSvg {
          node {
            altText
            sourceUrl
          }
        }
        contactNumber
        mailSvg {
          node {
            altText
            sourceUrl
          }
        }
        emailAddress
        getInTouchButton {
          title
          url
        }
        ourProcessTitle
        processFlow {
          processCount
          processTitle
          processDescription
        }
        industryServeTitle
        industriesName {
          industryName
        }
        faqTitle
        faq {
          nodes {
            ... on Faq {
              title
              content
            }
          }
        }
      }
    }
  }
`;
export const GET_AUTHORS = gql`
  query getAuthors {
    users {
      nodes {
        id
        name
        description
        email
        userProfileImage {
          userRole
          userProfileImage {
            node {
              altText
              sourceUrl
            }
          }
          socialTitle
          socialMedia {
            fieldGroupName
            socialLink {
              title
              url
              target
            }
            socialSvg {
              node {
                altText
                sourceUrl
              }
            }
          }
          hour
          honors {
            fieldGroupName
            honorsImages {
              node {
                altText
                uri
                sourceUrl
              }
            }
          }
          fieldGroupName
          discoverSvg {
            node {
              altText
              sourceUrl
            }
          }
          discoverMyJourneyTitle
          authorDetailDescription
          authorDescription
          blogTitle
          contactSection {
            contactTitle
            contactDescription
            contactLink {
              url
              title
              target
            }
            bgImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
        posts {
          nodes {
            id
            title
            slug
            uri
            commentCount
            viewsCount
            featuredImage {
              node {
                altText
                sourceUrl
              }
            }
          }
        }
      }
    }
  }
`;

// Reusable dynamic SEO query for any page
export const DYNAMIC_SEO_QUERY = gql`
  query DynamicSeoQuery($pageId: ID!) {
    page(id: $pageId) {
      title
      slug
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      seo {
        focuskw
        title
        metaDesc
        opengraphUrl
        opengraphImage {
          altText
          author {
            node {
              name
            }
          }
        }
      }
    }
  }
`;

// Dynamic Author SEO query using user ID
export const DYNAMIC_AUTHOR_SEO_QUERY = gql`
  query DynamicAuthorSeoQuery($userId: ID!) {
    user(id: $userId) {
      name
      slug
      userProfileImage {
        userProfileImage {
          node {
            altText
            sourceUrl
          }
        }
      }
      seo {
        title
        metaDesc
        opengraphImage {
          altText
          author {
            node {
              name
            }
          }
        }
      }
    }
  }
`;

// Simplified Blog Post query for SEO
export const GET_BLOG_POST_SEO = gql`
  query GetBlogPostSeo($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      slug
      date
      modified
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      seo {
        focuskw
        title
        metaDesc
        opengraphUrl
        opengraphImage {
          altText
          sourceUrl
        }
      }
      author {
        node {
          id
          name
          uri
          description
        }
      }
    }
  }
`;

// Project SEO query for metadata generation
export const GET_PROJECT_SEO = gql`
  query GetProjectSeo($slug: ID!) {
    project(id: $slug, idType: SLUG) {
      id
      title
      slug
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      seo {
        focuskw
        title
        metaDesc
      }
    }
  }
`;

// Service/Technology SEO query for metadata generation
export const GET_SERVICE_SEO = gql`
  query GetServiceSeo($slug: ID!) {
    technology(id: $slug, idType: SLUG) {
      id
      title
      slug
      featuredImage {
        node {
          altText
          sourceUrl
        }
      }
      seo {
        focuskw
        title
        metaDesc
      }
    }
  }
`;

export const GET_EVENT_BY_SLUG = gql`
  query GetEventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      eventSettings {
        eventDate
        eventTitle
        eventDescription
        eventViewMoreLink {
          title
          url
        }
        eventImages {
          eventImage {
            node {
              altText
              sourceUrl
            }
          }
        }
      }
      seo {
        focuskw
        title
        metaDesc
        opengraphImage {
          altText
          sourceUrl
        }
      }
    }
  }
`;


