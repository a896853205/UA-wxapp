import Taro, { memo, useState } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';

import { MEASURE_UPDATE } from '../../constants/api-constants';
import { addMeasureData } from '../../actions/addMeasure';
import http from '../../util/http';

import { AtButton, AtInput, AtList, AtListItem, AtMessage } from 'taro-ui';
interface IMeasure {
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}
const SaveData = () => {
  const [saveDataLoading, setSaveDataLoading] = useState(false);
  const [uric, setUric] = useState(0);
  const [fat, setFat] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );
  const dispatch = useDispatch();

  const submit = async () => {
    if (!saveDataLoading) {
      setSaveDataLoading(true);

      if (measureType === 'single' ? uric && time && date : uric && fat && sugar && time && date) {
        const timeData = new Date((date + ' ' + time).replace(/-/g, '/'));
        let params;

        if (measureType === 'single') {
          params = {
            type: measureType,
            uric,
            timestamp: Number(timeData),
          };
        } else {
          params = {
            type: 'triple',
            uric,
            fat,
            sugar,
            timestamp: Number(timeData),
          };
        }

        const res = await http({
          url: MEASURE_UPDATE,
          method: 'POST',
          data: {
            datas: [
              {
                ...params,
              },
            ],
          },
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '增加失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          dispatch(addMeasureData(true));
          Taro.navigateBack({});
        }
      } else {
        Taro.atMessage({
          message: '未填写完毕',
          type: 'error',
        });
      }

      setSaveDataLoading(false);
    }
  };

  return (
    <View>
      <AtMessage />
      {measureType === 'single' ? (
        <View>
          <AtInput
            name="UA"
            title="尿酸值"
            type="digit"
            placeholder="请输入尿酸值"
            onChange={(e) => {
              setUric(Number(e));
            }}
          />

          <Picker
            mode="date"
            onChange={(e) => {
              setDate(`${e.detail.value}`);
            }}
            value={''}
          >
            <AtList>
              <AtListItem title="日期选择：" extraText={date} arrow="right" />
            </AtList>
          </Picker>

          <Picker
            mode="time"
            onChange={(e) => {
              setTime(`${e.detail.value}`);
            }}
            value={''}
          >
            <AtList>
              <AtListItem title="时间选择：" extraText={time} arrow="right" />
            </AtList>
          </Picker>

          <AtButton
            onClick={submit}
            type="primary"
            full={true}
            loading={saveDataLoading}
          >
            保存
          </AtButton>
        </View>
      ) : null}
      {measureType === 'joint' ? (
        <View>
          <AtInput
            name="UA"
            title="尿酸值"
            type="digit"
            placeholder="请输入尿酸值"
            onChange={(e) => {
              setUric(Number(e));
            }}
          />
          <AtInput
            name="UA"
            title="血脂值"
            type="digit"
            placeholder="请输入血脂值"
            onChange={(e) => {
              setFat(Number(e));
            }}
          />
          <AtInput
            name="UA"
            title="血糖值"
            type="digit"
            placeholder="请输入血糖值"
            onChange={(e) => {
              setSugar(Number(e));
            }}
          />

          <Picker
            mode="date"
            onChange={(e) => {
              setDate(`${e.detail.value}`);
            }}
            value={''}
          >
            <AtList>
              <AtListItem title="日期选择：" extraText={date} arrow="right" />
            </AtList>
          </Picker>

          <Picker
            mode="time"
            onChange={(e) => {
              setTime(`${e.detail.value}`);
            }}
            value={''}
          >
            <AtList>
              <AtListItem title="时间选择：" extraText={time} arrow="right" />
            </AtList>
          </Picker>

          <AtButton
            onClick={submit}
            type="primary"
            full={true}
            loading={saveDataLoading}
          >
            保存
          </AtButton>
        </View>
      ) : null}
    </View>
  );
};

export default memo(SaveData);
