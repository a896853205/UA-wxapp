import Taro, { memo, useEffect, useState } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';
import {
  AtList,
  AtListItem,
  AtCard,
  AtToast,
  AtMessage,
  AtSearchBar,
} from 'taro-ui';
import { changeSelectedDoctor } from '../../actions/doctor';

import './doctor.css';

import selected from '../../assets/icon/selected.png';

import http from '../../util/http';
import { DOCTOR_LIST, DOCTOR_ACTIVE, HOSPITAL_SEARCH } from '../../constants/api-constants';
import TaroTwoLevelRegionPicker from '../../util/taro-twolevel-region-picker';

interface Idoctor {
  isChanged: boolean;
}
interface Istatus {
  doctor: Idoctor;
}

const DOCTOR_LIST_SIZE = 999;
const HOSPITAL_LIST_SIZE = 999;

const Doctor = () => {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */

  const { isChanged } = useSelector<Istatus, Idoctor>((state) => state.doctor);
  const [doctorList, setDoctorList] = useState<any>([]);
  const [activeDoctor, setActiveDoctor] = useState<any>([]);
  const [activeDoctorLoading, setActiveDoctorLoading] = useState(true);
  const [getDataLoading, setGetDataLoading] = useState(true);
  const [isNeedRefresh, setIsNeedRefresh] = useState(true);
  const [doctorName, setDoctorName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [hospital, setHospital] = useState('');
  const [hospitalList, setHospitalList] = useState<any>([]);
  const [isSearch, setIsSearch] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (isSearch) {
        setGetDataLoading(true);

        let data;
        if (doctorName) {
          data = {
            page: 0,
            limit: DOCTOR_LIST_SIZE,
            like: doctorName,
          };
        } else if (hospital && hospital != '未选择医院') {
          data = {
            page: 0,
            hospital: hospital,
            limit: HOSPITAL_LIST_SIZE,
          };
        } else {
          data = {
            page: 0,
            limit: DOCTOR_LIST_SIZE,
          };
        }

        const res = await http({
          url: DOCTOR_LIST,
          method: 'GET',
          data,
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取列表失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          setDoctorList(res.data.data.rows);
        }

        setIsSearch(false);
        setGetDataLoading(false);
      }
    })();
  }, [isSearch]);

  useEffect(() => {
    (async () => {
      if (city) {
        let data;
        data = {
          page: 0,
          limit: HOSPITAL_LIST_SIZE,
          city: city,
          province: province,
        };

        const res = await http({
          url: HOSPITAL_SEARCH,
          method: 'GET',
          data,
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取列表失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          setHospitalList(res.data.data.rows.map((item)=>{
              return item.hospital
          }));     
        }
      }
    })();
  }, [city]);

  useEffect(() => {
    (async () => {
      if (isNeedRefresh) {
        setActiveDoctorLoading(true);

        const res = await http({
          url: DOCTOR_ACTIVE,
          method: 'GET',
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取选择列表失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          setActiveDoctor(res.data.data);
        }

        setActiveDoctorLoading(false);
        setIsNeedRefresh(false);
      }
    })();
  }, [isNeedRefresh]);

  useEffect(() => {
    if (isChanged) {
      setIsNeedRefresh(true);
      dispatch(changeSelectedDoctor(false));
    }
  }, [isChanged, dispatch]);

  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: '选择医生',
    });
  }, []);

  return (
    <View className="doctor-box">
      <AtToast
        isOpened={activeDoctorLoading}
        hasMask
        status="loading"
        text="已选择医生信息加载中..."
      />
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="医生信息加载中..."
      />
      <AtMessage />
      <View className="doctor-search-box">
        <AtSearchBar
          value={doctorName}
          onChange={(e) => {
            setDoctorName(e);
            setHospital('未选择医院');
          }}
          onActionClick={() => {
            setHospital('未选择医院')
            setIsSearch(true);
          }}
          onClear={() => {
            setDoctorName('');
            setIsSearch(true);
          }}
        />
      </View>
      <View className="current-doctor-box">
        <AtCard thumb={selected} title="当前医生选择">
          {activeDoctor && activeDoctor.uuid ? (
            <AtList hasBorder={false}>
              <AtListItem
                key={activeDoctor.uuid}
                title={activeDoctor.name}
                arrow="right"
                note={activeDoctor.hospital}
                thumb={activeDoctor.avartar}
                extraText="查看详情"
                onClick={() => {
                  Taro.setStorageSync('viewDoctor', activeDoctor.uuid);
                  Taro.navigateTo({
                    url: '/pages/doctor-detail/index',
                  });
                }}
              />
            </AtList>
          ) : <div>无</div>}
        </AtCard>
      </View>
      <View className="region-hospital-box">
        <AtCard title="按医院搜索">
          <TaroTwoLevelRegionPicker
            style={{ textAlign: 'left', borderTop: 0 }}
            // regionSelf={region}
            onGetRegion={(_region) => {
              const re = _region.split(' - ');
              setCity(re[1]);
              setProvince(re[0]);
              setHospital('未选择医院');
              console.log(re);
            }}
          />
          <AtList>
            <Picker
              mode="selector"
              range={hospitalList}
              onChange={(e) => {
                if (hospitalList.length) {
                  setHospital(hospitalList[+e.detail.value]);
                  setDoctorName('');
                  // setDoctorName('');
                  setIsSearch(true);
                }
              }}
              value={hospital.length ? hospital : '未选择医院'}
            >
              <View style='padding: 30rpx 0 0 0'>
                <AtListItem
                  title="选择医院："
                  extraText={hospital}
                  arrow="right"
                />
              </View>
            </Picker>
          </AtList>
        </AtCard>
      </View>
      <AtList>
        {doctorList.map((doctorItem) => (
          <AtListItem
            key={doctorItem.uuid}
            title={doctorItem.name}
            arrow="right"
            note={doctorItem.hospital}
            thumb={doctorItem.avartar}
            extraText="查看详情"
            onClick={() => {
              Taro.setStorageSync('viewDoctor', doctorItem.uuid);
              Taro.navigateTo({
                url: '/pages/doctor-detail/index',
              });
            }}
          />
        ))}
      </AtList>
    </View>
  );
};

// #region 导出注意
//
// 经过上面的声明后需要将导出的 Taro.Component 子类修改为子类本身的 props 属性
// 这样在使用这个子类时 Ts 才不会提示缺少 JSX 类型参数错误
//
// #endregion

export default memo(Doctor);
