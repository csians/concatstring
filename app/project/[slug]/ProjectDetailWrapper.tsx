"use client";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  setProjectData,
  setProjectOverview,
  setProjectService,
  setProjectTools,
  setProjectAchievements,
  setProjectResults,
  setProjectConclusion,
  setProjectClientFeedback,
  setProjectRelatedProjects,
} from "@/store/slices/projectDetailsSlice";
import MarketOps from "./marketOps";
import AboutConcatstring from "./aboutConcatstring";
import ProjectOverview from "./projectOverview";
import Service from "./service";
import ToolsBehind from "./toolsBehind";
import WhatWeAchive from "./whatWeAchive";
import ClientFeedback from "./clientFeedback";
import RelatedProjects from "./relatedProjects";
import ProjectResult from "./projectResult";
import ProjectConclusion from "./projectConclusion";

import LoadingProvider from "@/components/LoadingContext";
interface Props {
  project: any;
}

const ProjectDetailWrapper: React.FC<Props> = ({ project }) => {
  const dispatch = useDispatch();

  // Dispatch project data to Redux when component mounts
  useEffect(() => {
    if (project) {
      console.log("ProjectDetailWrapper - Dispatching to Redux:", project);
      dispatch(setProjectData(project));
      dispatch(setProjectOverview(project));
      dispatch(setProjectService(project));
      dispatch(setProjectTools(project));
      dispatch(setProjectAchievements(project));
      dispatch(setProjectResults(project));
      dispatch(setProjectConclusion(project));
      dispatch(setProjectClientFeedback(project));
      dispatch(setProjectRelatedProjects(project));
    }
  }, [project, dispatch]);

  return (
    <LoadingProvider>
      <MarketOps project={project} />
      <AboutConcatstring project={project} />
      <ProjectOverview project={project} />
      <Service project={project} />
      <ToolsBehind project={project} />
      <WhatWeAchive project={project} />
      <ProjectResult project={project} />
      <ProjectConclusion project={project} />
      <ClientFeedback project={project} />
      <RelatedProjects project={project} />
    </LoadingProvider>
  );
};

export default ProjectDetailWrapper;
