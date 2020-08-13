import { ADD_MEASURE_DATA } from '../constants/addMeasure';

export const addMeasureData = (isAdded) => {
  return {
    type: ADD_MEASURE_DATA,
    isAdded,
  };
};