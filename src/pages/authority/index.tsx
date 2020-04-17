import Taro, { memo, useEffect } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem } from '@tarojs/components';

import './authority.css';

// import authority1 from '../../assets/image/authority1.jpg';
// import authority2 from '../../assets/image/authority2.jpg';
// import authority3 from '../../assets/image/authority3.jpg';

const Authority = () => {
  useEffect(() => {
    Taro.setNavigationBarColor({
      backgroundColor: '#fff',
      frontColor: '#000000',
    });
    Taro.setNavigationBarTitle({
      title: '登录授权',
    });
  }, []);

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
      <View
        className="btn primary"
        onClick={() => {
          Taro.redirectTo({
            url: '../../pages/index/index',
          });
        }}
      >
        我要登录
      </View>
    </View>
  );
};

export default memo(Authority);
