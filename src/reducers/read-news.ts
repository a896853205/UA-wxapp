import { READ_NEWS } from '../constants/read-news';

const INITIAL_STATE = {
  isReaded: false,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case READ_NEWS:
      return {
        ...state,
        isReaded: action.isReaded,
      };
    default:
      return state;
  }