import { ADD_MEASURE_DATA } from '../constants/addMeasure';

const INITIAL_STATE = {
  isAdded: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_MEASURE_DATA:
      return {
        ...state,
        isAdded: action.isAdded,
      };
    default:
      return state;
  }
};
