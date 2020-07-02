import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Button } from '@tarojs/components';
import { useDispatch } from '@tarojs/redux';
import {
  AtButton,
  AtMessage,
  AtModal,
  AtModalHeader,
  AtModalContent,
  AtModalAction,
  AtList,
  AtListItem,
  AtGrid,
  AtNoticebar,
  AtToast,
} from 'taro-ui';

import { changeSelectedPreview } from '../../actions/preview';
import {
  onBluetoothDeviceFound,
  openBluetoothAdapter,
  hex2buffer,
  buf2hex,
  stopBluetoothDevicesDiscovery,
} from './util/blue-tooth';
import { UXSingleData } from './util/data2UXData';
import http from '../../util/http';
import { MEASURE_UPDATE } from '../../constants/api-constants';

const SERVICE_ID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
// 写入
const TXD = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
// 读取
const RXD = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';

const START = '7b00FF7d0011';

const Device = () => {
  const [discoveryStarted, setDiscoveryStarted] = useState(false);
  const [devices, setDevices] = useState<
    Taro.onBluetoothDeviceFound.CallbackResultBlueToothDevice[]
  >([]);

  const [deviceId, setDeviceId] = useState('');
  const [name, setName] = useState('');
  const [uploadData, setUploadData] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const dispatch = useDispatch();

  // '1为一条,5为5条';

  const submit = (_uploadData: string) => {
    if (_uploadData === '') {
      Taro.atMessage({
        message: '请先从设备获取数据',
        type: 'error',
      });
    } else {
      setSubmitLoading(true);
      http({
        url: MEASURE_UPDATE,
        method: 'POST',
        data: {
          uuid: Taro.getStorageSync('activePatient'),
          datas: [UXSingleData(_uploadData)],
        },
      }).then((res) => {
        console.log(res);
        if (res.statusCode === 500) {
          console.log('数据提交失败');
        } else if (res.statusCode === 200) {
          dispatch(changeSelectedPreview(true));
          Taro.atMessage({
            message: '上传数据成功',
            type: 'success',
          });
          Taro.reLaunch({ url: '/pages/index/index?cur=0' });
        }
        setSubmitLoading(false);
      });
    }
  };

  // 开始查找蓝牙设备
  const startBluetoothDevicesDiscovery = () => {
    if (discoveryStarted) {
      return;
    }
    setDiscoveryStarted(true);
    // 搜索蓝牙设备
    Taro.startBluetoothDevicesDiscovery({
      allowDuplicatesKey: true,
      success: async () => {
        onBluetoothDeviceFound((res) => {
          res.devices.forEach((device) => {
            if (!device.name && !device.localName) {
              return;
            }

            const idx = devices.findIndex(
              (item) => item.deviceId === device.deviceId
            );

            // const idx = inArray(devices, 'deviceId', device.deviceId);

            if (idx === -1) {
              devices.push(device);
            }

            setDevices([...devices]);
          });
        });
      },
    });
  };

  // 写数据
  const writeBLECharacteristicValue = (_deviceId: string, hex: string) => {
    // 16进制转buffer
    const buffer = hex2buffer(hex);

    console.log(
      `向设备: ${_deviceId}的服务: ${SERVICE_ID}的TXD特征值: ${TXD}写入: ${hex}`
    );

    Taro.writeBLECharacteristicValue({
      deviceId: _deviceId,
      serviceId: SERVICE_ID,
      characteristicId: TXD,
      value: buffer,
      success() {
        console.log('写数据成功');
      },
      fail(err) {
        console.log('fail', err);
      },
    });
  };

  const getBLEDeviceCharacteristics = async (_deviceId, serviceId) => {
    console.log(_deviceId, serviceId);
    await Taro.getBLEDeviceCharacteristics({
      deviceId: _deviceId,
      serviceId: serviceId,
    });

    // 监听RXD
    Taro.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: _deviceId,
      serviceId: serviceId,
      characteristicId: RXD,
      success() {
        console.log(`已监听服务: ${serviceId}的RXD: ${RXD}`);

        // 操作之前先监听，保证第一时间获取数据
        Taro.onBLECharacteristicValueChange((characteristic) => {
          console.log(
            `设备的: ${_deviceId}的服务: ${SERVICE_ID}的RXD特征值: ${RXD}读取到: ${buf2hex(
              characteristic.value
            )}`
          );

          const hex = buf2hex(characteristic.value);

          if (hex === '7b01ff007df8') {
            writeBLECharacteristicValue(_deviceId, '7b00A0017d');
          }

          if (hex.length === 30) {
            setUploadData(hex);
            setLoading(false);
          }
        });
      },
      fail(_res) {
        console.log('noteFail', _res);
      },
    });
  };

  // 获取指定蓝牙设备的服务
  const getBLEDeviceServices = (_deviceId) => {
    return new Promise((resolve, reject) => {
      Taro.getBLEDeviceServices({
        deviceId: _deviceId,
        success: (res) => {
          console.log(res.services);
          for (let i = 0; i < res.services.length; i++) {
            // 如果有指定服务就读取特征值信息
            if (res.services[i].uuid === SERVICE_ID) {
              getBLEDeviceCharacteristics(_deviceId, SERVICE_ID);
              resolve();
            }
          }
          resolve();
        },
      });
    });
  };

  // 与蓝牙设备链接
  const createBLEConnection = (_deviceId: string, _name: string) => {
    console.log('createBLEConnection', _deviceId);

    return new Promise((resolve, reject) => {
      Taro.createBLEConnection({
        deviceId: _deviceId,
        success: () => {
          setDeviceId(_deviceId);
          setName(_name);
          resolve();
        },
      });
    });
  };

  // const closeBLEConnection = () => {
  //   Taro.closeBLEConnection({
  //     deviceId: deviceId,
  //   });
  // };

  const closeBluetoothAdapter = () => {
    Taro.closeBluetoothAdapter();
    setDiscoveryStarted(false);
  };

  useEffect(() => {
    return () => {
      setDevices([]);
      closeBluetoothAdapter();
    };
  }, []);

  return (
    <View>
      <AtMessage />
      <AtToast
        isOpened={loading}
        hasMask
        status="loading"
        text="测量数据加载中..."
      />
      <AtToast
        isOpened={submitLoading}
        hasMask
        status="loading"
        text="上传数据加载中..."
      />
      <AtNoticebar>请确认手机是否开启蓝牙和地理获取信息</AtNoticebar>
      <AtButton
        full
        type="primary"
        onClick={async () => {
          try {
            await openBluetoothAdapter();
            setIsShow(true);
            startBluetoothDevicesDiscovery();
          } catch (error) {
            Taro.atMessage({
              message: '请检查是否开启蓝牙,和开启地理位置',
              type: 'error',
            });
          }
        }}
      >
        开始扫描
      </AtButton>
      <AtModal isOpened={isShow}>
        <AtModalHeader>已扫描到的蓝牙</AtModalHeader>
        <AtModalContent>
          <AtList>
            {devices.map((item) => {
              return (
                <AtListItem
                  key={item.deviceId}
                  title={item.name}
                  onClick={async () => {
                    await createBLEConnection(item.deviceId, item.name);
                    await getBLEDeviceServices(item.deviceId);
                    stopBluetoothDevicesDiscovery();
                    setIsShow(false);
                  }}
                />
              );
            })}
          </AtList>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setIsShow(false)}>取消</Button>
        </AtModalAction>
      </AtModal>
      <View>
        <AtList>
          <AtListItem
            title={`设备名: ${name}`}
            iconInfo={{ size: 25, color: '#78A4FA', value: 'iphone' }}
          />
          <AtListItem
            title={
              uploadData.length === 30
                ? `最新数值为: ${UXSingleData(uploadData).uric} μmol/L`
                : '请获取最新数值'
            }
            iconInfo={{ size: 25, color: '#78A4FA', value: 'filter' }}
          />
          <AtListItem
            title={
              uploadData.length === 30
                ? `时间为:
                ${new Date(UXSingleData(uploadData).timestamp).getFullYear()}/${
                    new Date(UXSingleData(uploadData).timestamp).getMonth() + 1
                  }/${new Date(UXSingleData(uploadData).timestamp).getDate()}
                ${new Date(UXSingleData(uploadData).timestamp).getHours()}:
                ${new Date(UXSingleData(uploadData).timestamp).getMinutes()}`
                : '请获取最新数值'
            }
            iconInfo={{ size: 25, color: '#78A4FA', value: 'clock' }}
          />
        </AtList>
      </View>
      <AtGrid
        mode="rect"
        onClick={(_item, index) => {
          if (index === 0) {
            setTimeout(() => {
              if (loading === true) {
                setLoading(false);
                Taro.atMessage({
                  message: '获取数据失败,请确认设备是否链接正确',
                  type: 'error',
                });
              }
            }, 5000);

            setLoading(true);
            writeBLECharacteristicValue(deviceId, START);
          } else {
            submit(uploadData);
          }
        }}
        data={[
          {
            value: '获取最新数据',
          },
          {
            value: '上传数据到云',
          },
        ]}
      />
    </View>
  );
};

export default memo(Device);
