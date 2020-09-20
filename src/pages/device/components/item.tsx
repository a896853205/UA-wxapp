import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './item.css';

export interface Props {
  type: string;
  uric: number;
  date: string;
  sugar: number;
  fat: number;
  num: number;
}

export default ({
  type,
  uric,
  date,
  sugar,
  fat,
  num
}: Props) => {
  return (
    <View className="data-item-box">
      {type == 'single' ?
        <View className="data-up-box">
          <View className="up-box">尿酸：{uric}</View>
        </View>
        : null}
      {type == 'triple' ?
        <View className="data-up-box">
          <View className="up-box">尿酸：{uric}</View>
          <View className="up-box">甘油三酯：{sugar}</View>
          <View className="up-box">血脂：{fat}</View>
        </View>
        : null}
      <View className="data-down-box">第{num+1}条 {date}</View>
    </View>
  );
};
