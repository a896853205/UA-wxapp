import Taro, { memo } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { useSelector } from '@tarojs/redux';

// 样式
import { AtGrid } from 'taro-ui';
import './preview.css';

// icon
import refresh from '../../../../assets/icon/refresh.png';
import aim from '../../../../assets/icon/aim.png';
import bar from '../../../../assets/icon/bar.png';
import clock from '../../../../assets/icon/clock.png';
import config from '../../../../assets/icon/config.png';
import doctor from '../../../../assets/icon/doctor.png';

interface IMeasure {
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

const Preview = () => {
  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );

  return (
    <View className="page">
      {/* TODO: 根据redux中的值展示单项还是多项 */}
      {measureType === 'single' ? (
        <View className="value-preview-box">
          <View className="measure-preview">
            351<Text className="measure-unit">mmol/L</Text>
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
              <Text className="value-num">351</Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">10</Text>天
            </Text>
          </View>
          <View className="row">
            <Text className="measure-project">血脂</Text>
            <Text className="measure-value">
              <Text className="value-num">351</Text>
              <Text className="measure-unit">mmol/L</Text>
            </Text>
            <Text>
              <Text className="day">10</Text>天
            </Text>
          </View>
          <View className="row">
            <Text className="measure-project">血糖</Text>
            <Text className="measure-value">
              <Text className="value-num">352</Text>
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
