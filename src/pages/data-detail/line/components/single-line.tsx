import Taro, { memo } from '@tarojs/taro';
import Chart from 'taro-echarts';
// import { View } from '@tarojs/components';

interface Props {
  timeSpanIndex: number;
  measureBasicList: any[];
}

const getCurrentWeek = () => {
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  let now = new Date();

  let spli = week.splice(0, now.getDay() + 1);

  return [...week, ...spli];
};

const DataSingleLine = ({
  timeSpanIndex,
  measureBasicList
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
          data: timeSpanIndex ?
            ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30']
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
    />);
}

export default memo(DataSingleLine);