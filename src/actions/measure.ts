import { CHANGE_MEASURE_TYPE } from '../constants/measure';

export const changeMeasureType = (measureType) => {
  let measureText = '';
  switch (measureType) {
    case 'single':
      measureText = '尿酸单项';
      break;
    case 'joint':
      measureText = '三联检测';
      break;
    default:
      measureText = '';
  }
  return {
    type: CHANGE_MEASURE_TYPE,
    measureType,
    measureText,
  };
};

// 异步的action
// export function asyncAdd() {
//   return (dispatch) => {
//     setTimeout(() => {
//       dispatch(add());
//     }, 2000);
//   };
// }
