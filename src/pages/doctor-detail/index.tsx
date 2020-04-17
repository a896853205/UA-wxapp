import Taro, { memo } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtButton } from 'taro-ui';

import './doctor-detail.css';
import meTopBackground from '../../assets/image/me-top-background.png';

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
  return (
    <View className="me-box">
      <Image src={meTopBackground} className="me-background" mode="widthFix" />
      <View className="me-list">
        <View className="me-item me-profile">
          <Image
            src="https://img2.woyaogexing.com/2020/04/14/fa870d305ba64868a585b8ccbd270a5b!400x400.jpeg"
            className="me-head-profile"
            mode="widthFix"
          />
          <View className="me-describe">
            <Text>钱医生</Text>
            <Text className="me-position">累计服务人数 1000+</Text>
          </View>
        </View>
        <View className="me-item">
          <View className="item-title">从事历史</View>
          <View className="item-name">
            生化制药专业,从事健康管理5年,曾进修于北京糖尿病医院.
          </View>
        </View>
        <View className="me-item">
          <View className="item-title">擅长方向</View>
          <View className="item-name">
            熟知糖尿病诊断和预防管理，擅长结合糖尿病饮食计划进行个案调糖管理熟知糖尿病诊断和预防管理，擅长结合糖尿病饮食计划进行个案调糖管理熟知糖尿病诊断和预防管理，擅长结合糖尿病饮食计划进行个案调糖管理
          </View>
        </View>

        <View className="me-item">
          <AtButton type="primary">选择该医生</AtButton>
        </View>
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
