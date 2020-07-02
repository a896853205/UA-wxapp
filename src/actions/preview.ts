import { CHANGE_PREVIEW_VALUE } from '../constants/preview';

export const changeSelectedPreview = (isChanged) => {
  return {
    type: CHANGE_PREVIEW_VALUE,
    isChanged,
  };
};
