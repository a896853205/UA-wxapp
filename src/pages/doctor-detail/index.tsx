import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtButton, AtToast, AtMessage } from 'taro-ui';
import { useDispatch } from '@tarojs/redux';

import { changeSelectedDoctor } from '../../actions/doctor';
import './doctor-detail.css';
import meTopBackground from '../../assets/image/me-top-background.png';

import {
  DOCTOR_DETAIL,
  DOCTOR_BIND,
} from '../../constants/api-constants';
import http from '../../util/http';

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

  const [headPortrait, setHeadPortrait] = useState('');
  const [totalPatientNumber, setTotalPatientNumber] = useState('');
  const [name, setName] = useState('');
  const [skill, setSkill] = useState('');
  const [intro, setIntro] = useState('');
  const [selected, setSelected] = useState(false);
  const [getDataLoading, setGetDataLoading] = useState(false);
  const doctorUuid = Taro.getStorageSync('viewDoctor');
  const patientUuid = Taro.getStorageSync('activePatient');
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (doctorUuid) {
        setGetDataLoading(true);

        const res = await http({
          url: DOCTOR_DETAIL,
          method: 'GET',
          data: {
            doctor_uuid: doctorUuid,
            patient_uuid: patientUuid,
          },
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取医生详情失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          setHeadPortrait(res.data.data.avartar);
          setTotalPatientNumber(res.data.data.total_patient_number);
          setName(res.data.data.name);
          setSkill(res.data.data.skill);
          setIntro(res.data.data.intro);
          setSelected(res.data.data.selected);
        }

        setGetDataLoading(false);
      } else {
        Taro.atMessage({
          message: '选择医生失败',
          type: 'error',
        });
      }
    })();
  }, [doctorUuid, patientUuid]);

  const handleBind = async () => {
    const res = await http({
      url: DOCTOR_BIND,
      method: 'POST',
      data: {
        doctor_uuid: doctorUuid,
      },
    });

    if (res.statusCode === 500) {
      Taro.atMessage({
        message: '修改绑定医生失败',
        type: 'error',
      });
    } else if (res.statusCode === 200) {
      dispatch(changeSelectedDoctor(true));
      if (!selected) {
        Taro.reLaunch({ url: '/pages/index/index?cur=0' });
      }
    }
  };

  return (
    <View className="me-box">
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="医生详细信息加载中..."
      />
      <AtMessage />
      <Image src={meTopBackground} className="me-background" mode="widthFix" />
      <View className="me-list">
        <View className="me-item me-profile">
          <Image
            src={headPortrait}
            className="me-head-profile"
            mode="widthFix"
          />
          <View className="me-describe">
            <Text>{name}</Text>
            <Text className="me-position">{`累计服务人数: ${totalPatientNumber}`}</Text>
          </View>
        </View>
        <View className="me-item">
          <View className="item-title">个人简介</View>
          <View className="item-name">
            {intro}
          </View>
        </View>
        <View className="me-item">
          <View className="item-title">擅长方向</View>
          <View className="item-name">
            {skill}
          </View>
        </View>
        {selected ? null : (
          <View className="me-item">
            <AtButton type="primary" onClick={handleBind}>
              选择该医生
            </AtButton>
          </View>
        )}
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
