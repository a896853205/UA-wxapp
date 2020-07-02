import { CHANGE_PREVIEW_VALUE } from '../constants/preview';

const INITIAL_STATE = {
  isChanged: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CHANGE_PREVIEW_VALUE:
      return {
        ...state,
        isChanged: action.isChanged,
      };
    default:
      return state;
  }
};
