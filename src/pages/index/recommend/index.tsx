import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image, Text } from '@tarojs/components';
import { AtIcon, AtToast, AtMessage } from 'taro-ui';

import { ARTICLE_TOP } from '../../../constants/api-constants';
import http from '../../../util/http';

import './recommend.css';
// #region 书写注意
//
// 目前 typescript 版本还无法在装饰器模式下将 Props 注入到 Taro.Component 中的 props 属性
// 需要显示声明 connect 的参数类型并通过 interface 的方式指定 Taro.Component 子类的 props
// 这样才能完成类型检查和 IDE 的自动提示
// 使用函数模式则无此限制
// ref: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/20796
//
// #endregion

type PageStateProps = {};

type IProps = PageStateProps;

interface Recommend {
  props: IProps;
}

const Recommend = () => {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  const [getDataLoading, setGetDataLoading] = useState(false);
  const [articleList, setArticleList] = useState<any>([]);

  useEffect(() => {
    (async () => {
      setGetDataLoading(true);

      const res = await http({
        url: ARTICLE_TOP,
        method: 'GET',
      });

      if (res.statusCode === 500) {
        Taro.atMessage({
          message: '获取列表失败',
          type: 'error',
        });
      } else if (res.statusCode === 200) {
        setArticleList(res.data.data.rows);
      }

      setGetDataLoading(false);
    })();
  }, []);

  return (
    <View className="recommed-box">
      <View className="recommed-top-box">
        <AtToast
          isOpened={getDataLoading}
          hasMask
          status="loading"
          text="医生信息加载中..."
        />
        <AtMessage />
        <View className="recommend-title">
          <AtIcon value="streaming" color="#6190e8" />
          <Text className="recommend-title-text">精选专题</Text>
        </View>
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
                src="https://hbimg.huabanimg.com/e35445ac296e2f94cd44794d6bd549a7272d0bc73ef61-BvYVv2_fw658"
              />
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className="swiper-item">
              <Image
                className="img"
                mode="aspectFill"
                src="https://hbimg.huabanimg.com/498e7e66ff06ca704ce35a66d4d37c7bc2c3dbc843d19-5w53fb_fw658"
              />
            </View>
          </SwiperItem>
          <SwiperItem>
            <View className="swiper-item">
              <Image
                className="img"
                mode="aspectFill"
                src="https://hbimg.huabanimg.com/7d7099b44e118fb30a523930f9f29fa33da9126b4413e-ALe6jw_fw658"
              />
            </View>
          </SwiperItem>
        </Swiper>
      </View>
      <View className="recommend-list-box">
        {articleList.map((articleItem) => (
          <View className="recommend-item-box">
            <View className="recommend-item-left-box">
              <Text className="recommend-item-title">
                {articleItem.title}
              </Text>
              <Text className="recommend-item-describe">
                <Text>尿酸管理小程序</Text>
                <Text className="read-num">8230阅读</Text>
              </Text>
            </View>
            <Image
              className="recommend-item-right-img"
              mode="aspectFill"
              src={articleItem.cover}
            />
          </View>
        ))}
        {/* <View className="recommend-item-box">
          <View className="recommend-item-left-box">
            <Text className="recommend-item-title">
              糖尿病早期,胰岛细胞损伤具有逆转可能性
            </Text>
            <Text className="recommend-item-describe">
              <Text>尿酸管理小程序</Text>
              <Text className="read-num">8230阅读</Text>
            </Text>
          </View>
          <Image
            className="recommend-item-right-img"
            mode="aspectFill"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586885242694&di=03bb9f38678b8972c97e1c0dfe7201a1&imgtype=0&src=http%3A%2F%2Fr.sinaimg.cn%2Flarge%2Farticle%2F4edc20d43c8574cf8b21e1a4738e1c5e"
          />
        </View>
        <View className="recommend-item-box">
          <View className="recommend-item-left-box">
            <Text className="recommend-item-title">
              糖尿病早期,胰岛细胞损伤具有逆转可能性
            </Text>
            <Text className="recommend-item-describe">
              <Text>尿酸管理小程序</Text>
              <Text className="read-num">8230阅读</Text>
            </Text>
          </View>
          <Image
            className="recommend-item-right-img"
            mode="aspectFill"
            src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1586886007338&di=8057e9bb342bb5f31968d500a207c191&imgtype=0&src=http%3A%2F%2Fn.sinaimg.cn%2Fsinacn19%2F64%2Fw1000h664%2F20181017%2F4967-hmhhnqs8530018.jpg"
          />
        </View>
        <View className="recommend-item-box">
          <View className="recommend-item-left-box">
            <Text className="recommend-item-title">
              糖尿病吃面全攻略,面条吃饱吃好还不升糖
            </Text>
            <Text className="recommend-item-describe">
              <Text>尿酸管理小程序</Text>
              <Text className="read-num">8230阅读</Text>
            </Text>
          </View>
          <Image
            className="recommend-item-right-img"
            mode="aspectFill"
            src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=2397700751,3035183254&fm=26&gp=0.jpg"
          />
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

export default memo(Recommend);
