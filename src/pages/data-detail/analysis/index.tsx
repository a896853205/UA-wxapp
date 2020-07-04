// TODO: 上面时间段选择,饼图分析(几次偏高,几次正常),总次数,连续高位次数,最高mmol/L,最长高位次数
// TODO: 将data-detail的折线组件抽象到这里
import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Text, Picker } from '@tarojs/components';
import { AtIcon, AtList, AtListItem, AtToast, AtButton } from 'taro-ui';
import { useSelector } from '@tarojs/redux';
import Chart from 'taro-echarts';

import {
  CHART_PIE,
} from '../../../constants/api-constants';
import http from '../../../util/http';

import './analysis.css';

interface IMeasure {
  measureText: string;
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

const TIME_RANGE = ['过去一周', '过去一个月'];

const Analysis = () => {
  const [timeSpanIndex, setTimeSpanIndex] = useState(0);
  const [fat, setFat] = useState<any>([]);
  const [sugar, setSugar] = useState<any>([]);
  const [uric, setUric] = useState<any>([]);
  const [singleSugar, setSingleSugar] = useState<any>([]);
  const [getDataLoading, setGetDataLoading] = useState(false);
  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );

  useEffect(() => {
    (async () => {
      setGetDataLoading(true);

      const res = await http({
        url: CHART_PIE,
        method: 'GET',
        data: {
          type: measureType === 'single' ? measureType : 'triple',
          days: timeSpanIndex ? 30 : 7
        }
      });

      if (res.statusCode === 500) {
        Taro.atMessage({
          message: '获取列表失败',
          type: 'error',
        });
      } else if (res.statusCode === 200) {

        if (measureType === 'single') {
          setSingleSugar(res.data.data)
        } else {
          setFat(res.data.data.fat);
          setSugar(res.data.data.sugar);
          setUric(res.data.data.uric);
        }
      }

      setGetDataLoading(false);
    })();
  }, [timeSpanIndex]);

  return (
    <View>
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="患者健康数据加载中..."
      />
      {/* FIXME: 多一个自定义时间,点到自定义时间时就多出一个Picker */}
      <Picker
        mode="selector"
        range={TIME_RANGE}
        onChange={(e) => {
          setTimeSpanIndex(+e.detail.value);
        }}
        value={timeSpanIndex}
      >
        <AtList>
          <AtListItem
            title="时间段选择："
            extraText={TIME_RANGE[timeSpanIndex]}
            arrow="right"
          />
        </AtList>
      </Picker>
      {measureType === 'single' ? (
        <View className="analysis-box">
          <View className="analysis-title">尿酸</View>
          <Chart
            chartId={'1'}
            option={{
              series: [
                {
                  data: [
                    {
                      // 数据项的名称
                      name: '偏高',
                      // 数据项值8
                      value: singleSugar.high_times,
                    },
                    {
                      name: '正常',
                      value: singleSugar.normal_times,
                    },
                  ],
                  type: 'pie',
                },
              ],
              color: ['rgb(255, 107, 132)', 'rgb(147, 206, 84)'],
            }}
          />
          <View className="analysis-describe">
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(255, 107, 132)" className="tag" />
              <Text className="tag">
                偏高<Text className="red-num">{singleSugar.high_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(147, 206, 84)" className="tag" />
              <Text className="tag">
                正常<Text className="green-num">{singleSugar.normal_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                总共<Text className="blue-num">{singleSugar.total_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                连续高位<Text className="blue-num">{singleSugar.continue_high_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最高<Text className="blue-num">{singleSugar.highest_value}</Text>mmol/L
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最长高位<Text className="blue-num">{singleSugar.longest_high_times}</Text>次
              </Text>
            </View>
          </View>
        </View>
      ) : null}
      {measureType === 'joint' ? (
        <View className="analysis-box">
          <View className="analysis-title">尿酸</View>
          <Chart
            chartId={'1'}
            option={{
              series: [
                {
                  data: [
                    {
                      // 数据项的名称
                      name: '偏高',
                      // 数据项值8
                      value: uric.high_times,
                    },
                    {
                      name: '正常',
                      value: uric.normal_times,
                    },
                  ],
                  type: 'pie',
                },
              ],
              color: ['rgb(255, 107, 132)', 'rgb(147, 206, 84)'],
            }}
          />
          <View className="analysis-describe">
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(255, 107, 132)" className="tag" />
              <Text className="tag">
                偏高<Text className="red-num">{uric.high_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(147, 206, 84)" className="tag" />
              <Text className="tag">
                正常<Text className="green-num">{uric.normal_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                总共<Text className="blue-num">{uric.total_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                连续高位<Text className="blue-num">{uric.continue_high_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最高<Text className="blue-num">{uric.highest_value}</Text>mmol/L
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最长高位<Text className="blue-num">{uric.longest_high_times}</Text>次
              </Text>
            </View>
          </View>
          <View className="analysis-title">血脂</View>
          <Chart
            chartId={'1'}
            option={{
              series: [
                {
                  data: [
                    {
                      // 数据项的名称
                      name: '偏高',
                      // 数据项值8
                      value: fat.high_times,
                    },
                    {
                      name: '正常',
                      value: fat.normal_times,
                    },
                  ],
                  type: 'pie',
                },
              ],
              color: ['rgb(255, 107, 132)', 'rgb(147, 206, 84)'],
            }}
          />
          <View className="analysis-describe">
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(255, 107, 132)" className="tag" />
              <Text className="tag">
                偏高<Text className="red-num">{fat.high_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(147, 206, 84)" className="tag" />
              <Text className="tag">
                正常<Text className="green-num">{fat.normal_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                总共<Text className="blue-num">{fat.total_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                连续高位<Text className="blue-num">{fat.continue_high_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最高<Text className="blue-num">{fat.highest_value}</Text>mmol/L
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最长高位<Text className="blue-num">{fat.longest_high_times}</Text>次
              </Text>
            </View>
          </View>
          <View className="analysis-title">血糖</View>
          <Chart
            chartId={'1'}
            option={{
              series: [
                {
                  data: [
                    {
                      // 数据项的名称
                      name: '偏高',
                      // 数据项值8
                      value: sugar.high_times,
                    },
                    {
                      name: '正常',
                      value: sugar.normal_times,
                    },
                  ],
                  type: 'pie',
                },
              ],
              color: ['rgb(255, 107, 132)', 'rgb(147, 206, 84)'],
            }}
          />
          <View className="analysis-describe">
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(255, 107, 132)" className="tag" />
              <Text className="tag">
                偏高<Text className="red-num">{sugar.high_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="rgb(147, 206, 84)" className="tag" />
              <Text className="tag">
                正常<Text className="green-num">{sugar.normal_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                总共<Text className="blue-num">{sugar.total_times}</Text>次
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                连续高位<Text className="blue-num">{sugar.continue_high_times}</Text>次
              </Text>
            </View>

            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最高<Text className="blue-num">{sugar.highest_value}</Text>mmol/L
              </Text>
            </View>
            <View className="analysis-describe-item">
              <AtIcon value="tag" color="#6190e8" className="tag" />
              <Text className="tag">
                最长高位<Text className="blue-num">{sugar.longest_high_times}</Text>次
              </Text>
            </View>
          </View>
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

export default memo(Analysis);
