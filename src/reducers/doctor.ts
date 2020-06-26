import { CHANGE_SELECTED_DOCTOR } from '../constants/doctor';

const INITIAL_STATE = {
  isChanged: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_SELECTED_DOCTOR:
      return {
        ...state,
        isChanged: action.isChanged,
      };
    default:
      return state;
  }
};