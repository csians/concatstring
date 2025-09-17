import { useEffect, useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { useDispatch, useSelector } from 'react-redux';
import { GET_OUR_TECHNOLOGIES } from '@/lib/queries';
import { RootState } from '@/store';
import { setTechnologies } from '@/store/slices/homeSlice';

export const useTechnologiesData = () => {
  const dispatch = useDispatch();
  const cachedData = useSelector((state: RootState) => state.home.technologies);

  const { data, loading, error } = useQuery(GET_OUR_TECHNOLOGIES, {
    fetchPolicy: 'cache-first',
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: false,
  });

  // Memoize the dispatch function to prevent unnecessary re-renders
  const dispatchTechnologies = useCallback((data: any) => {
    dispatch(setTechnologies(data));
  }, [dispatch]);

  // Cache data in Redux when it's fetched
  useEffect(() => {
    if (data && !cachedData) {
      dispatchTechnologies(data);
    }
  }, [data, cachedData, dispatchTechnologies]);

  // Use cached data if available, otherwise use fresh data
  const content = cachedData || data;
  
  // Memoize the tech section extraction to prevent unnecessary re-computations
  const techSection = useMemo(() => {
    if (!content?.page?.flexibleContent?.flexibleContent) return {};
    
    return content.page.flexibleContent.flexibleContent.find(
      (item: any) => item?.weProvideTitle
    ) || {};
  }, [content]);

  const technologies = useMemo(() => {
    return techSection.technologies?.nodes || [];
  }, [techSection.technologies?.nodes]);

  // Memoize the return object to prevent unnecessary re-renders
  return useMemo(() => ({
    techSection,
    technologies,
    loading: loading && !cachedData,
    error: error && !cachedData,
    hasData: !!(technologies.length && techSection.weProvideTitle)
  }), [techSection, technologies, loading, cachedData, error]);
};
