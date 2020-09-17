import { combineReducers } from 'redux';

import measure from './measure';
import addMeasure from './addMeasure';
import readNews from './read-news';
import addLatestMeasure from './add-latest-measure';
import preview from './preview';
import doctor from './doctor';

export default combineReducers({
  measure,
  addMeasure,
  readNews,
  addLatestMeasure,
  doctor,
  preview,
});
