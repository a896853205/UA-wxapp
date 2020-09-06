import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon, AtMessage, AtToast } from 'taro-ui';

import http from '../../../util/http';
import { ME } from '../../../constants/api-constants';

import './me.css';
import patientDefault from '../../../assets/image/patient-default.jpg';

type PageStateProps = {};

type IProps = PageStateProps;

interface Me {
  props: IProps;
}

const Me = () => {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  const [me, setMe] = useState<any>([]);
  const [getDataLoading, setGetDataLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setGetDataLoading(true);

      const res = await http({
        url: ME,
        method: 'GET',
      });

      if (res.statusCode === 500) {
        Taro.atMessage({
          message: '获取信息失败',
          type: 'error',
        });
      } else if (res.statusCode === 200) {
        setMe(res.data.data);
      }

      setGetDataLoading(false);
    })();
  }, []);

  return (
    <View className="me-box">
      <AtMessage />
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="个人信息加载中..."
      />
      <Image
        src="https://s1.ax1x.com/2020/07/02/NbGpy4.png"
        className="me-background"
        mode="widthFix"
      />
      <View className="me-list">
        <View
          className="me-item me-profile"
          onClick={() => {
            Taro.navigateTo({ url: '/pages/me-update/index' });
          }}
        >
          <Image
            src={me.headurl ? me.headurl : patientDefault}
            className="me-head-profile"
          />
          <View className="me-describe">
            <Text>{me.name}</Text>
            <Text className="me-position">
              {me.address ? me.address : '未填写地址'}
            </Text>
          </View>
        </View>
        {/* <View className="me-item">
          <View className="item-title">健康档案</View>
          <View className="item-list">
            <View className="item-cell">
              <AtIcon value="bookmark" size="40" color="#6190e8" />
              <View className="item-name">我的档案</View>
            </View>
          </View>
        </View>
        <View className="me-item">
          <View className="item-title">我的亲友</View>
          <View className="item-list">
            <View className="item-cell">
              <AtIcon value="list" size="40" color="#6190e8" />
              <View className="item-name">亲友列表</View>
            </View>
          </View>
        </View> */}
      </View>
    </View>
  );
};

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default memo(Me);
