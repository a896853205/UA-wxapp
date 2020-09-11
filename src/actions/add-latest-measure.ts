import { ADD_LATEST_MEASURE } from '../constants/add-latest-measure';

export const addLatestMeasure = (isAdded) => {
  return {
    type: ADD_LATEST_MEASURE,
    isAdded,
  };
};