// TODO: 将data-detail的折线组件抽象到这里
import Taro, { useState, memo, useEffect } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { AtButton, AtList, AtListItem, AtToast } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
import Chart from 'taro-echarts';

import { MEASURE_BASIC, CHART_LINE } from '../../../constants/api-constants';
import http from '../../../util/http';
import { addMeasureData } from '../../../actions/addMeasure';

import './line.css';

interface IMeasure {
  measureText: string;
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

interface IAdd {
  isAdded: boolean;
}
interface Istatus {
  addMeasure: IAdd;
}

const TIME_RANGE = ['过去一周', '过去一个月'];

const getCurrentWeek = () => {
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  let now = new Date();

  let spli = week.splice(0, now.getDay());

  return [...week, ...spli];
};

const Line = () => {
  const [timeSpanIndex, setTimeSpanIndex] = useState(0);
  const [measureBasicList, setMeasureBasicList] = useState<any>([]);
  const [getDataLoading, setGetDataLoading] = useState(false);

  const [fat, setFat] = useState<any>([]);
  const [sugar, setSugar] = useState<any>([]);
  const [uric, setUric] = useState<any>([]);
  const [isNeedRefresh, setIsNeedRefresh] = useState(true);
  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );
  const { isAdded } = useSelector<Istatus, IAdd>(
    (state) => state.addMeasure
  );
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (isNeedRefresh) {
        setGetDataLoading(true);

        const res = await http({
          url: CHART_LINE,
          method: 'GET',
          data: {
            type: measureType === 'single' ? measureType : 'triple',
            days: timeSpanIndex ? 30 : 7,
          },
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取列表失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          if (measureType === 'single') {
            setMeasureBasicList(res.data.data);
          } else {
            // 设置三个数组
            setFat(res.data.data.fat);
            setSugar(res.data.data.sugar);
            setUric(res.data.data.uric);
          }
        }

        setGetDataLoading(false);
        setIsNeedRefresh(false);
      }
    })();
  }, [timeSpanIndex, isNeedRefresh]);

  useEffect(() => {
    if (isAdded) {
      setIsNeedRefresh(true);
      dispatch(addMeasureData(false));
    }
  }, [isAdded, dispatch]);

  return (
    <View>
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="患者健康数据加载中..."
      />
      {/* FIXME: 多一个自定义时间,点到自定义时间时就多出一个Picker */}
      {/* <Picker
        mode="selector"
        range={TIME_RANGE}
        onChange={(e) => {
          setTimeSpanIndex(+e.detail.value);
        }}
        value={timeSpanIndex}
      > */}
      <AtList>
        <Picker
          mode="selector"
          range={TIME_RANGE}
          onChange={(e) => {
            setTimeSpanIndex(+e.detail.value);
          }}
          value={timeSpanIndex}
        >
          <View style='padding: 30rpx 0 0 0'>
            <AtListItem
              title="时间段选择："
              extraText={TIME_RANGE[timeSpanIndex]}
              arrow="right"
              hasBorder={false}
            />
          </View>
        </Picker>
      </AtList>
      {/* </Picker> */}
      {measureType === 'single' ? (
        <View className="line-box">
          <View className="line-title">尿酸</View>
          <Chart
            chartId={'1'}
            option={{
              grid: {
                left: '50px',
                right: '50px',
              },
              xAxis: {
                type: 'category',
                data: timeSpanIndex ? new Array(30).fill('') : getCurrentWeek(),
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
                },
              ],
              animation: false,
            }}
          />
        </View>
      ) : null}

      {measureType === 'joint' ? (
        <View className="line-box">
          <View className="line-title">尿酸</View>
          <Chart
            chartId={'1'}
            option={{
              grid: {
                left: '50px',
                right: '50px',
              },
              xAxis: {
                type: 'category',
                data: timeSpanIndex ? new Array(30).fill('') : getCurrentWeek(),
                name: timeSpanIndex ? '天' : '星期',
              },
              yAxis: {
                type: 'value',
                name: 'μmol/L',
              },
              series: [
                {
                  data: uric,
                  type: 'line',
                  connectNulls: true,
                },
              ],
              animation: false,
            }}
          />
          <View className="line-title">血脂</View>
          <Chart
            chartId={'1'}
            option={{
              grid: {
                left: '50px',
                right: '50px',
              },
              xAxis: {
                type: 'category',
                data: timeSpanIndex ? new Array(30).fill('') : getCurrentWeek(),
                name: timeSpanIndex ? '天' : '星期',
              },
              yAxis: {
                type: 'value',
                name: 'mmol/L',
              },
              series: [
                {
                  data: fat,
                  type: 'line',
                  connectNulls: true,
                },
              ],
              animation: false,
            }}
          />
          <View className="line-title">血糖</View>
          <Chart
            chartId={'1'}
            option={{
              grid: {
                left: '50px',
                right: '50px',
              },
              xAxis: {
                type: 'category',
                data: timeSpanIndex ? new Array(30).fill('') : getCurrentWeek(),
                name: timeSpanIndex ? '天' : '星期',
              },
              yAxis: {
                type: 'value',
                name: 'mmol/L',
              },
              series: [
                {
                  data: sugar,
                  type: 'line',
                  connectNulls: true,
                },
              ],
              animation: false,
            }}
          />
        </View>
      ) : null}
      <AtButton
        type="primary"
        size="normal"
        full={true}
        onClick={() => {
          Taro.navigateTo({ url: '/pages/save-data/index' });
        }}
      >
        手动添加数据
      </AtButton>
    </View>
  );
};

export default memo(Line);
