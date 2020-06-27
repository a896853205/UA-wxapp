import Taro, { memo, useEffect, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtInput, AtButton, AtForm, AtToast, AtMessage } from 'taro-ui';
import { useSelector } from '@tarojs/redux';

import {
  ME,
  ME_UPDATE
} from '../../constants/api-constants';
import http from '../../util/http';

interface IMeasure {
  measureText: string;
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

const Aim = () => {
  const { measureText, measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );
  const [singleUricHigh, setSingleUricHigh] = useState('');
  const [singleUricLow, setSingleUricLow] = useState('');
  const [uricHigh, setUricHigh] = useState('');
  const [uricLow, setUricLow] = useState('');
  const [sugarHigh, setSugarHigh] = useState('');
  const [sugarLow, setSugarLow] = useState('');
  const [fatHigh, setFatHigh] = useState('');
  const [fatLow, setFatLow] = useState('');
  const [saveDataLoading, setSaveDataLoading] = useState(false);
  const [getDataLoading, setGetDataLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setGetDataLoading(true);

      const res = await http({
        url: ME,
        method: 'GET',
      });

      if (res) {
        if (measureType === 'single') {
          setSingleUricHigh(res.data.data.uric_high.toString());
          setSingleUricLow(res.data.data.uric_low.toString());
        }
        else {
          setUricHigh(res.data.data.uric_high.toString());
          setUricLow(res.data.data.uric_low.toString());
          setSugarHigh(res.data.data.sugar_high.toString());
          setSugarLow(res.data.data.sugar_low.toString());
          setFatHigh(res.data.data.fat_high.toString());
          setFatLow(res.data.data.fat_low.toString());
        }
      }

      setGetDataLoading(false);
    })();
  }, []);

  const submit = async () => {
    if (!saveDataLoading) {
      setSaveDataLoading(true);

      let params;

      if (measureType === 'single') {
        params = {
          uric_high: Number(singleUricHigh),
          uric_low: Number(singleUricLow)
        };
      }
      else {
        params = {
          uric_high: Number(uricHigh),
          uric_low: Number(uricLow),
          sugar_high: Number(sugarHigh),
          sugar_low: Number(sugarLow),
          fat_high: Number(fatHigh),
          fat_low: Number(fatLow),
        };
      };
      console.log('shuchu=', params);


      const res = await http({
        url: ME_UPDATE,
        method: 'POST',
        data: {
          ...params,
        },
      });

      if (res.statusCode === 500) {
        Taro.atMessage({
          message: '修改失败',
          type: 'error',
        });
      } else if (res.statusCode === 200) {
        Taro.redirectTo({
          url: '../../pages/index/index?cur=1',
        });
      }

      setSaveDataLoading(false);
    }
  };

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: `${measureText}目标`,
    });
  }, [measureText]);

  return (
    <View>
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="期望值信息加载中..."
      />
      <AtMessage />
      {measureType === 'single' ? (
        <View>
          <AtForm onSubmit={submit}>
            <AtInput
              name="UA"
              title="尿酸最高值"
              type="number"
              placeholder="请输入尿酸值的目标(最高值)"
              value={singleUricHigh}
              onChange={(e) => { setSingleUricHigh(`${e}`); }}
            />
            <AtInput
              name="UA"
              title="尿酸最低值"
              type="number"
              placeholder="请输入尿酸值的目标(最低值)"
              value={singleUricLow}
              onChange={(e) => { setSingleUricLow(`${e}`); }}
            />
            <AtButton full formType="submit" loading={saveDataLoading} type="primary">
              保存
            </AtButton>
          </AtForm>
        </View>
      ) : null}
      {measureType === 'joint' ? (
        <View>
          <AtForm onSubmit={submit}>
            <AtInput
              name="UA"
              title="尿酸最高值"
              type="number"
              placeholder="请输入尿酸值的目标(最高值)"
              value={uricHigh}
              onChange={(e) => { setUricHigh(`${e}`); }}
            />
            <AtInput
              name="UA"
              title="尿酸最低值"
              type="number"
              placeholder="请输入尿酸值的目标(最低值)"
              value={uricLow}
              onChange={(e) => { setUricLow(`${e}`); }}
            />
            <AtInput
              name="UA"
              title="血糖最高值"
              type="number"
              placeholder="请输入血糖值的目标(最高值)"
              value={sugarHigh}
              onChange={(e) => { setSugarHigh(`${e}`); }}
            />
            <AtInput
              name="UA"
              title="血糖最低值"
              type="number"
              placeholder="请输入血糖值的目标(最低值)"
              value={sugarLow}
              onChange={(e) => { setSugarLow(`${e}`); }}
            />
            <AtInput
              name="UA"
              title="血脂最高值"
              type="number"
              placeholder="请输入血脂值的目标(最高值)"
              value={fatHigh}
              onChange={(e) => { setFatHigh(`${e}`); }}
            />
            <AtInput
              name="UA"
              title="血脂最低值"
              type="number"
              placeholder="请输入血脂值的目标(最低值)"
              value={fatLow}
              onChange={(e) => { setFatLow(`${e}`); }}
            />
            <AtButton full formType="submit" loading={saveDataLoading} type="primary">
              保存
            </AtButton>
          </AtForm>
        </View>
      ) : null}
    </View >
  );
};

export default memo(Aim);
