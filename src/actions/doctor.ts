import { CHANGE_SELECTED_DOCTOR } from '../constants/doctor';

export const changeSelectedDoctor = (isChanged) => {
  return {
    type: CHANGE_SELECTED_DOCTOR,
    isChanged,
  };
};