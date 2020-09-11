import { ADD_LATEST_MEASURE } from '../constants/add-latest-measure';

const INITIAL_STATE = {
  isAdded: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ADD_LATEST_MEASURE:
      return {
        ...state,
        isAdded: action.isAdded,
      };
    default:
      return state;
  }
};