import Taro, { memo } from '@tarojs/taro';
import { View } from '@tarojs/components';

import DeviceDataItem from './item';
import { UXSingleData, UXThreeData } from '../util/data2UXData';

interface Props {
  deviceDataList: string[];
}

const DeviceDataList = ({
  deviceDataList
}: Props) => {
  return (
    <View>
      {deviceDataList && deviceDataList.length
        ? deviceDataList.map((deviceData, index) => {
          return (
            deviceData.length == 30 ?
              <DeviceDataItem
                num={index}
                type='single'
                key={deviceData}
                uric={new UXSingleData(deviceData).uric}
                sugar={0}
                fat={0}
                date={new UXSingleData(deviceData).getTimeString()}
              />
              : deviceData.length == 38 ?
                <DeviceDataItem
                  num={index}
                  type='triple'
                  key={deviceData}
                  uric={new UXThreeData(deviceData).uric}
                  sugar={new UXThreeData(deviceData).sugar}
                  fat={new UXThreeData(deviceData).fat}
                  date={new UXThreeData(deviceData).getTimeString()}
                />
                : null
          );
        }) : null
      }
    </View>);
}

export default memo(DeviceDataList);