import { READ_NEWS } from '../constants/read-news';

export const readNews= (isReaded) => {
  return {
    type: READ_NEWS,
    isReaded,
  }