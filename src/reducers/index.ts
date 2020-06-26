import { combineReducers } from 'redux';
import measure from './measure';
import doctor from './doctor';

export default combineReducers({
  measure,
  doctor,
});
