import Taro, { memo } from '@tarojs/taro';
import Chart from 'taro-echarts';
import { View, Text } from '@tarojs/components';

import './line.css';

interface Props {
  timeSpanIndex: number;
  measureBasicList: any[];
  isVisible: boolean;
  onDetailsClick: Function;
}

const getCurrentWeek = () => {
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  let now = new Date();

  let spli = week.splice(0, now.getDay() + 1);

  return [...week, ...spli];
};

const backwardsDaysInMounth = (backwardsNums: number): string[] => {
  const oneDayStmp = 3600 * 24 * 1000;
  const nowStmp = new Date().getTime();
  const res: string[] = [];

  backwardsNums--;

  while (backwardsNums >= 0) {
    res.push(`${new Date(nowStmp - backwardsNums * oneDayStmp).getMonth() + 1}.${new Date(
      nowStmp - backwardsNums * oneDayStmp).getDate()}`);
    backwardsNums--;
  }

  return res;
};

const DataSingleLine = ({
  timeSpanIndex,
  measureBasicList,
  isVisible,
  onDetailsClick,
}: Props) => {
  return (
    <View className="line-box" >
      <View className="line-title">
        <Text>尿酸</Text>
        {/* {timeSpanIndex ? null : ( */}
        <Text
          onClick={() => {
            onDetailsClick(true);
          }}
        >
          查看详情 &gt;
              </Text>
        {/* )} */}
      </View>
      <View style={{ display: isVisible ? 'none' : 'block' }}>
        <Chart
          chartId={'1'}
          option={{
            // markLine: {
            //   data: [{ data: singleUricHigh }, { data: singleUricLow }],
            // },
            grid: {
              left: '50px',
              right: '50px',
            },
            xAxis: {
              type: 'category',
              data: timeSpanIndex ? backwardsDaysInMounth(29)
                : getCurrentWeek(),
              name: timeSpanIndex ? '天' : '星期',
            },
            yAxis: {
              type: 'value',
              name: 'μmol/L',
            },
            series: [
              {
                data: measureBasicList,
                type: 'line',
                connectNulls: true,
                itemStyle: { normal: { label: { show: !timeSpanIndex } } },
              },
            ],
            animation: false,
          }}
        />
      </View>
    </View>
  );
}

export default memo(DataSingleLine);