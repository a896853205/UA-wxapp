import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useSelector } from '@tarojs/redux';

// 样式
import { AtGrid, AtToast } from 'taro-ui';
import './preview.css';

// icon
import refresh from '../../../../assets/icon/refresh.png';
import aim from '../../../../assets/icon/aim.png';
import bar from '../../../../assets/icon/bar.png';
import clock from '../../../../assets/icon/clock.png';
import config from '../../../../assets/icon/config.png';
import doctor from '../../../../assets/icon/doctor.png';

import {
  MEASURE_LATEST,
} from '../../../../constants/api-constants';
import http from '../../../../util/http';

import './analysis.css';

interface IMeasure {
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

const Preview = () => {
  const [tripleMeasure, setTripleMeasure] = useState<any>([]);
  const [singleUric, setSingleUric] = useState<any>([]);
  const [getDataLoading, setGetDataLoading] = useState(false);
  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );

  useEffect(() => {
    (async () => {
      setGetDataLoading(true);

      const res = await http({
        url: MEASURE_LATEST,
        method: 'GET',
        data: {
          type: measureType === 'single' ? measureType : 'triple',
        }
      });

      if (res.statusCode === 500) {
        Taro.atMessage({
          message: '获取列表失败',
          type: 'error',
        });
      } else if (res.statusCode === 200) {

        if (measureType === 'single') {
          setSingleUric(res.data.data);
        } else {
          setTripleMeasure(res.data.data);
        }
      }

      setGetDataLoading(false);
    })();
  }, [measureType]);

  return (
    <View className="page">
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="患者健康数据加载中..."
      />
      {/* TODO: 根据redux中的值展示单项还是多项 */}
      {measureType === 'single' ? (
        <View className="value-preview-box">
          <View className="measure-preview">
            {singleUric.uric}<Text className="measure-unit">mmol/L</Text>
          </View>
          <View className="measure-description">
            连续<Text className="day">10</Text>天高于目标值
          </View>
        </View>
      ) : null}
      {measureType === 'joint' ? (
        <View className="value-preview-box measure-joint-preview">
          <View className="row">连续高位</View>
          <View className="row">
            <Text className="measure-project">尿酸</Text>
            <Text className="measure-value">
              <Text className="value-num">{tripleMeasure.uric}</Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">10</Text>天
            </Text>
          </View>
          <View className="row">
            <Text className="measure-project">血脂</Text>
            <Text className="measure-value">
              <Text className="value-num">{tripleMeasure.fat}</Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">10</Text>天
            </Text>
          </View>
          <View className="row">
            <Text className="measure-project">血糖</Text>
            <Text className="measure-value">
              <Text className="value-num">{tripleMeasure.sugar}</Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">10</Text>天
            </Text>
          </View>
        </View>
      ) : null}
      <AtGrid
        columnNum={3}
        onClick={(_item, index) => {
          console.log(_item, index);
          switch (index) {
            case 0:
              Taro.navigateTo({ url: '/pages/sync-data/index' });
              break;
            case 1:
              Taro.navigateTo({ url: '/pages/data-detail/index?cur=0' });
              break;
            case 2:
              Taro.navigateTo({ url: '/pages/remind/index' });
              break;
            case 3:
              Taro.navigateTo({ url: '/pages/aim/index' });
              break;
            case 4:
              Taro.navigateTo({ url: '/pages/doctor/index' });
              break;
            default:
          }
        }}
        data={[
          {
            image: refresh,
            value: '同步数据',
          },

          {
            image: bar,
            value: '数据详情',
          },
          {
            image: clock,
            value: '提醒设置',
          },
          {
            image: aim,
            value: '目标设置',
          },
          {
            image: doctor,
            value: '选择医生',
          },
          {
            image: config,
            value: '设备设置',
          },
        ]}
      />
    </View>
  );
};

export default memo(Preview);
