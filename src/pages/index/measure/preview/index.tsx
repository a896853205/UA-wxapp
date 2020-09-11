import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';

import { addLatestMeasure } from '../../../../actions/add-latest-measure';

// 样式
import { AtGrid, AtToast } from 'taro-ui';
import './preview.css';

// icon
import refresh from '../../../../assets/icon/refresh.png';
import aim from '../../../../assets/icon/aim.png';
import bar from '../../../../assets/icon/bar.png';
import clock from '../../../../assets/icon/clock.png';
import doctor from '../../../../assets/icon/doctor.png';
import waiting from '../../../../assets/icon/waiting.png';

import { MEASURE_LATEST } from '../../../../constants/api-constants';
import http from '../../../../util/http';

interface IMeasure {
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

interface IAddLatest {
  isAdded: boolean;
}
interface Istatus {
  addLatestMeasure: IAddLatest;
}

const Preview = () => {
  const [tripleMeasure, setTripleMeasure] = useState<any>([]);
  const [singleUric, setSingleUric] = useState<any>([]);
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [level, setLevel] = useState<{
    uric: string;
    sugar: string;
    fat: string;
  }>();
  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );
  const { isAdded } = useSelector<Istatus, IAddLatest>((state) => state.addLatestMeasure);
  const dispatch = useDispatch();

  const [uricLast, setUricLast] = useState(0);
  const [TUircLast, setTUircLast] = useState(0);
  const [fatLast, setFatLast] = useState(0);
  const [sugarLast, setSugarLast] = useState(0);
  const [isNeedRefresh, setIsNeedRefresh] = useState(true);

  const measureClass = (levelString?: string) => {
    switch (levelString) {
      case 'high':
        return 'measure-red';
      case 'normal':
        return 'measure-green';
      case 'low':
        return 'measure-blue';

      default:
        return 'measure-green';
    }
  };

  useEffect(() => {
    (async () => {
      if (isNeedRefresh) {
        setGetDataLoading(true);

        const res = await http({
          url: MEASURE_LATEST,
          method: 'GET',
          data: {
            type: measureType === 'single' ? measureType : 'triple',
          },
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取列表失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          if (measureType === 'single') {
            setSingleUric(res.data.data.measure);
            setUricLast(res.data.data.last.uric);
          } else {
            setTripleMeasure(res.data.data.measure);
            setTUircLast(res.data.data.last.uric);
            setFatLast(res.data.data.last.uric);
            setSugarLast(res.data.data.last.uric);
          }
          setLevel(res.data.data.level);
        }

        setGetDataLoading(false);
        setIsNeedRefresh(false);
      }
    })();
  }, [isNeedRefresh, measureType]);

  useEffect(() => {
    if (isAdded) {
      setIsNeedRefresh(true);
      dispatch(addLatestMeasure(false));
    }
  }, [isAdded, dispatch]);

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
            <Text className={measureClass(level ? level.uric : '')}>
              {singleUric.uric}
            </Text>

            <Text className="measure-unit">μmol/L</Text>
          </View>
          <View className="measure-description">
            连续<Text className="day">{uricLast}</Text>次高于目标值
          </View>
        </View>
      ) : null}
      {measureType === 'joint' ? (
        <View className="value-preview-box measure-joint-preview">
          <View className="row">连续高位</View>
          <View className="row">
            <Text className="measure-project">尿酸</Text>
            <Text className="measure-value">
              <Text
                className={`value-num ${measureClass(level ? level.uric : '')}`}
              >
                {tripleMeasure.uric}
              </Text>
              <Text className="measure-unit">μmol/L</Text>
            </Text>
            <Text>
              <Text className="day">{TUircLast}</Text>次
            </Text>
          </View>
          <View className="row">
            <Text className="measure-project">血脂</Text>
            <Text className="measure-value">
              <Text
                className={`value-num ${measureClass(level ? level.fat : '')}`}
              >
                {tripleMeasure.fat}
              </Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">{fatLast}</Text>次
            </Text>
          </View>
          <View className="row">
            <Text className="measure-project">血糖</Text>
            <Text className="measure-value">
              <Text
                className={`value-num ${measureClass(
                  level ? level.sugar : ''
                )}`}
              >
                {tripleMeasure.sugar}
              </Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">{sugarLast}</Text>次
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
              Taro.navigateTo({ url: '/pages/device/index' });
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
            image: waiting,
            value: '敬请期待',
          },
        ]}
      />
    </View>
  );
};

export default memo(Preview);
