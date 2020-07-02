import Taro, { useState, useEffect, memo, useRouter } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabBar } from 'taro-ui';
import { useSelector } from '@tarojs/redux';

// 样式
import './data-detail.css';

// 组件
import Line from './line';
import Analysis from './analysis';

interface IMeasure {
  measureText: string;
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

const TAB_LIST = [{ title: '折线' }, { title: '统计' }];

const DataDetail = () => {
  const router = useRouter();

  const [tabCur, setTabCur] = useState(-1);

  if (tabCur === -1 && router.params.cur !== undefined) {
    setTabCur(Number.parseInt(router.params.cur));
  }
  const { measureText } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: measureText,
    });
  }, [measureText]);

  return (
    <View>
      <AtTabBar
        tabList={TAB_LIST}
        onClick={(e) => {
          setTabCur(e);
        }}
        current={tabCur}
      />
      {tabCur === 0 ? <Line /> : null}
      {tabCur === 1 ? <Analysis /> : null}
    </View>
  );
};

export default memo(DataDetail);
