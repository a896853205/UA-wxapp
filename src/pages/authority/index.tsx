import Taro, { memo, useEffect, useState } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';
import { AtButton } from 'taro-ui';

import './authority.css';
import http from '../../util/http';
import { AUTHORIZE } from '../../constants/api-constants';

// import authority1 from '../../assets/image/authority1.jpg';
// import authority2 from '../../assets/image/authority2.jpg';
// import authority3 from '../../assets/image/authority3.jpg';

const Authority = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Taro.setNavigationBarColor({
      backgroundColor: '#fff',
      frontColor: '#000000',
    });
    Taro.setNavigationBarTitle({
      title: '登录授权',
    });
  }, []);

  const tobegin = async (res) => {
    if (res.detail.userInfo) {
      // 返回的信息中包含用户信息则证明用户允许获取信息授权
      console.log('授权成功');
      // 保存用户信息微信登录
      Taro.setStorageSync('userInfo', res.detail.userInfo);

      if (!loading) {
        setLoading(!loading);
        const resLogin = await Taro.login();
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (resLogin.code) {
          // 登录
          const res = await http({
            url: AUTHORIZE,
            method: 'POST',
            data: {
              js_code: resLogin.code,
            },
          });
          if (res.statusCode === 200) {
            // 设置 token
            Taro.setStorageSync('token', res.data.data.token);
            // 登录成功返回首页并刷新首页数据
            if (res.data.data.registerd) {
              Taro.reLaunch({ url: '/pages/index/index' });
            } else {
              Taro.reLaunch({ url: '/pages/register/index' });
            }
          } else {
            Taro.showToast({
              title: '登录失败，请稍后重试',
              icon: 'none',
              mask: true,
            });
          }
        } else {
          Taro.showToast({
            title: '登录失败，请稍后重试',
            icon: 'none',
            mask: true,
          });
        }
        setLoading(false);
      }
    } else {
      Taro.switchTab({ url: '/pages/index/index' });
    }
  };

  return (
    <View className="authority-box">
      <Swiper
        className="swiper"
        indicatorColor="#ddd"
        indicatorActiveColor="#6190e8"
        circular
        indicatorDots
        autoplay
      >
        <SwiperItem>
          <View className="swiper-item">
            <Image
              className="img"
              mode="aspectFill"
              src="https://s1.ax1x.com/2020/04/13/GjQAN4.jpg"
            />
            <View>为您提供一站式服务</View>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className="swiper-item">
            <Image
              className="img"
              mode="aspectFill"
              src="https://s1.ax1x.com/2020/04/13/GjQkEF.jpg"
            />
            <View>您的健康安心掌握</View>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className="swiper-item">
            <Image
              className="img"
              mode="aspectFill"
              src="https://s1.ax1x.com/2020/04/13/GjQiHU.jpg"
            />
            <View>时刻关注您的健康</View>
          </View>
        </SwiperItem>
      </Swiper>
      <AtButton
        openType="getUserInfo"
        customStyle={{
          border: 0,
        }}
        onGetUserInfo={tobegin}
      >
        <View
          className="btn primary"
          onClick={() => {
            Taro.redirectTo({
              url: '../../pages/index/index',
            });
          }}
        >
          患者授权
        </View>
      </AtButton>
    </View>
  );
};

export default memo(Authority);
