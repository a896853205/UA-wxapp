import { combineReducers } from 'redux';

import measure from './measure';
import preview from './preview';
import doctor from './doctor';

export default combineReducers({
  measure,
  doctor,
  preview,
});
