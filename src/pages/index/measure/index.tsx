import Taro, { useState, useEffect, memo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabBar } from 'taro-ui';
import { useDispatch } from '@tarojs/redux';
import { changeMeasureType } from '../../../actions/measure';
// 组件
import Preview from './preview';
import './measure.css';

// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

// type PageStateProps = {};

// type IProps = PageStateProps;

// interface Measure {
//   props: IProps;
// }

const Measure = () => {
  const [tabCur, setTabCur] = useState(0);
  const dispatch = useDispatch();

  useEffect(() => {
    let measureType = 'single';

    switch (tabCur) {
      case 0:
        break;
      case 1:
        measureType = 'joint';
        break;
    }

    dispatch(changeMeasureType(measureType));
  }, [tabCur]);

  return (
    <View className="measrure-box">
      <AtTabBar
        tabList={[{ title: '尿酸单项' }, { title: '三联检测' }]}
        onClick={(e) => {
          setTabCur(e);
        }}
        current={tabCur}
      />
      <Preview />
    </View>
  );
};

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default memo(Measure);
