import { combineReducers } from 'redux';

import measure from './measure';
import addMeasure from './addMeasure';
import addLatestMeasure from './add-latest-measure';
import preview from './preview';
import doctor from './doctor';

export default combineReducers({
  measure,
  addMeasure,
  addLatestMeasure,
  doctor,
  preview,
});
