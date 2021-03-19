import Taro, { memo } from '@tarojs/taro';
import Chart from 'taro-echarts';
// import { View } from '@tarojs/components';

interface Props {
  timeSpanIndex: number;
  measureBasicList: any[];
  unit: string;
}

const getCurrentWeek = () => {
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  let now = new Date();

  let spli = week.splice(0, now.getDay() + 1);

  return [...week, ...spli];
};

let getPreMonthDate = () => {
  // 获取当前时间
  let curDate = new Date();
  let dateArray: Array<string> = [];

  for (let i = 29; i >= 0; i--) {
    let preDate = new Date(curDate.getTime() - i * 24 * 60 * 60 * 1000);
    let preMonth = preDate.getMonth() + 1;
    let preDay = preDate.getDate();
    let preDateStr = `${preMonth}.${preDay}`;
    dateArray.push(preDateStr);
  }
  return dateArray;
}

const DataSingleLine = ({
  timeSpanIndex,
  measureBasicList,
  unit
}: Props) => {
  return (
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
          data: timeSpanIndex ? getPreMonthDate() : getCurrentWeek(),
          name: timeSpanIndex ? '天' : '星期',
        },
        yAxis: {
          type: 'value',
          name: unit,
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
    />);
}

export default memo(DataSingleLine);