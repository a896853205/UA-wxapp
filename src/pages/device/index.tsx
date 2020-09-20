import Taro, { memo, useState, useEffect } from '@tarojs/taro';
import { View, Button, Picker } from '@tarojs/components';
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
import { UXSingleData, UXThreeData } from './util/data2UXData';
import http from '../../util/http';
import { MEASURE_UPDATE } from '../../constants/api-constants';
import DeviceDataList from './components/list';
const NUM_RANGE = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

// Todo：添加蓝牙数据获取时防止请求时点击的逻辑
class Device {
  // 设备Id
  static SERVICE_ID = '6E400001-B5A3-F393-E0A9-E50E24DCCA9E';
  // 写入特征值
  static TXD = '6E400002-B5A3-F393-E0A9-E50E24DCCA9E';
  // 读取特征值
  static RXD = '6E400003-B5A3-F393-E0A9-E50E24DCCA9E';
  // 初始指令
  static START = '7b00FF7d0011';

  deviceId: string;
  name: string;
  localName: string;

  constructor(deviceId: string, name: string, localName: string) {
    this.deviceId = deviceId;
    this.name = name;
    this.localName = localName;
  }

  // 与蓝牙设备链接
  createBLEConnection = () => {
    console.log('createBLEConnection', this.deviceId);

    return new Promise((resolve, reject) => {
      Taro.createBLEConnection({
        deviceId: this.deviceId,
        success: () => {
          resolve(this);
        },
      });
    });
  };

  // 判断该设备是否有serviceId
  getBLEDeviceService = (serviceId: string) => {
    return new Promise((resolve, reject) => {
      Taro.getBLEDeviceServices({
        deviceId: this.deviceId,
        success: (res) => {
          console.log(res.services);

          for (let i = 0; i < res.services.length; i++) {
            // 如果有指定服务就读取特征值信息
            if (res.services[i].uuid === serviceId) {
              resolve(true);
            }
          }
          resolve(false);
        },
      });
    });
  };

  getBLEDeviceCharacteristic = async (
    serviceId: string,
    rxd: string,
    callBack: Function
  ) => {
    console.log(this.deviceId, serviceId);

    await Taro.getBLEDeviceCharacteristics({
      deviceId: this.deviceId,
      serviceId: serviceId,
    });

    // 监听RXD
    Taro.notifyBLECharacteristicValueChange({
      state: true,
      deviceId: this.deviceId,
      serviceId: serviceId,
      characteristicId: rxd,
      success() {
        console.log(`已监听服务: ${serviceId}的RXD: ${rxd}`);

        // 操作之前先监听，保证第一时间获取数据
        Taro.onBLECharacteristicValueChange((characteristic) => {
          callBack(characteristic);
        });
      },
      fail(_res) {
        console.log('noteFail', _res);
      },
    });
  };

  // 写数据
  writeBLECharacteristicValue = (hex: string) => {
    // 16进制转buffer
    const buffer = hex2buffer(hex);

    console.log(
      `向设备: ${this.deviceId}的服务: ${Device.SERVICE_ID}的TXD特征值: ${Device.TXD}写入: ${hex}`
    );

    Taro.writeBLECharacteristicValue({
      deviceId: this.deviceId,
      serviceId: Device.SERVICE_ID,
      characteristicId: Device.TXD,
      value: buffer,
      success() {
        console.log('写数据成功');
      },
      fail(err) {
        console.log('fail', err);
      },
    });
  };
}

const DeviceComponent = () => {
  const [discoveryStarted, setDiscoveryStarted] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<Device>();
  const [uploadData, setUploadData] = useState<string[]>([]);
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadText, setLoadText] = useState('');
  const [dataNum, setDataNum] = useState(0);
  const dispatch = useDispatch();

  const selectOneDevice = async (device: Device) => {
    await device.createBLEConnection();

    Taro.setStorageSync('selectedDevice', device);

    setSelectedDevice(device);

    const hasService = await device.getBLEDeviceService(Device.SERVICE_ID);
    let data: string[] = [];

    if (hasService) {
      device.getBLEDeviceCharacteristic(
        Device.SERVICE_ID,
        Device.RXD,
        (characteristic) => {
          console.log(
            `设备的: ${device.deviceId}的服务: ${Device.SERVICE_ID
            }的RXD特征值: ${Device.RXD}读取到: ${buf2hex(characteristic.value)}`
          );

          const hex = buf2hex(characteristic.value);

          console.log('数据条数=', (Taro.getStorageSync('dataNum') + 1));

          if (hex === '7b01ff007df8') {
            data = [];
            device.writeBLECharacteristicValue(`7b00a0${Taro.getStorageSync('dataNum') < 15 ? '0' + (Taro.getStorageSync('dataNum') + 1).toString(16) : (Taro.getStorageSync('dataNum') + 1).toString(16)}7d`);
          }

          if (hex.length === 30 || hex.length === 38) {
            data = [...data, hex];
            // setLoading(false);
          }

          if (hex === '7b0140007d47' || hex.length === 40) {
            setUploadData(data);
            setLoading(false);
          }
        }
      );
    }
    stopBluetoothDevicesDiscovery();
    setIsShow(false);
  };
  // 页面加载的时候看localStorage里有没有,有的话就调用有的
  useEffect(() => {
    const device: Device = Taro.getStorageSync('selectedDevice');

    console.log(device);

    if (!device) {
      return;
    } else {
      (async () => {
        setLoadText('重新连接蓝牙中...');
        setLoading(true);

        const timer = setTimeout(() => {
          stopBluetoothDevicesDiscovery();
          setLoading(false);
        }, 5000);

        await openBluetoothAdapter();

        // 搜索蓝牙设备
        Taro.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: true,
          success: async () => {
            onBluetoothDeviceFound((res) => {
              res.devices.forEach((findDevice) => {
                if (!device.name && !device.localName) {
                  return;
                }

                if (
                  findDevice.deviceId === device.deviceId &&
                  findDevice.name === device.name
                ) {
                  clearTimeout(timer);
                  setLoading(false);

                  selectOneDevice(
                    new Device(device.deviceId, device.name, device.localName)
                  );
                }
              });
            });
          },
        });
      })();
    }
  }, []);

  // '1为一条,5为5条';
  const submit = (_uploadData: string[]) => {
    if (!_uploadData.length) {
      Taro.atMessage({
        message: '请先从设备获取数据',
        type: 'error',
      });
    } else {
      setLoadText('上传数据加载中...');
      setLoading(true);
      let patientData: any[] = _uploadData.map((data, index) => {
        return (
          data.length === 30 ? { source: 1, ...new UXSingleData(_uploadData[index]) }
            : { source: 1, ...new UXThreeData(_uploadData[index]) }
        );
      });

      console.log('上传数据为：', patientData);

      let data: any = new UXSingleData(_uploadData[0]);
      data.source = 1;
      http({
        url: MEASURE_UPDATE,
        method: 'POST',
        data: {
          uuid: Taro.getStorageSync('activePatient'),
          datas: patientData,
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
        setLoading(false);
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

            if (idx === -1) {
              devices.push(
                new Device(device.deviceId, device.name, device.localName)
              );
            }

            setDevices([...devices]);
          });
        });
      },
      fail: () => {
        Taro.atMessage({
          message: '请确认手机是否开启蓝牙和地理获取信息',
          type: 'error',
        });
      },
    });
  };

  const closeBluetoothAdapter = () => {
    Taro.closeBluetoothAdapter();
    setDiscoveryStarted(false);
  };

  const breakBlueTeeth = () => {
    setUploadData([]);
    setSelectedDevice(undefined);
    closeBluetoothAdapter();
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
      <AtToast isOpened={loading} hasMask status="loading" text={loadText} />
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
            {devices.map((item: Device) => {
              return (
                <AtListItem
                  key={item.deviceId}
                  title={item.name}
                  onClick={() => selectOneDevice(item)}
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
            title={`设备名: ${selectedDevice ? selectedDevice.name : ''}`}
            iconInfo={{ size: 25, color: '#78A4FA', value: 'iphone' }}
          />
          <Picker
            mode="selector"
            range={NUM_RANGE}
            onChange={(e) => {
              Taro.setStorageSync('dataNum', +e.detail.value);
              setDataNum(+e.detail.value);
            }}
            value={dataNum}
          >
            <AtListItem
              title="数据数量："
              extraText={NUM_RANGE[Taro.getStorageSync('dataNum') || 0].toString()}
              arrow="right"
              iconInfo={{ size: 25, color: '#78A4FA', value: 'filter' }}
            />
          </Picker>
          {uploadData.length ?
            <DeviceDataList
              deviceDataList={uploadData}
            /> : null}
          {/* <AtListItem
            title={
              uploadData.length === 30
                ? `最新数值为: ${new UXSingleData(uploadData).uric} μmol/L`
                : '请获取最新数值'
            }
            iconInfo={{ size: 25, color: '#78A4FA', value: 'filter' }}
          />
          <AtListItem
            title={
              uploadData.length === 30
                ? `时间为:
                ${new UXSingleData(uploadData).getTimeString()}`
                : '请获取最新数值'
            }
            iconInfo={{ size: 25, color: '#78A4FA', value: 'clock' }}
          /> */}
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
            setLoadText('测量数据加载中...');
            setLoading(true);
            if (selectedDevice) {
              selectedDevice.writeBLECharacteristicValue(Device.START);
            }
          } else if (index === 1) {
            submit(uploadData);
          } else {
            breakBlueTeeth();
          }
        }}
        data={[
          {
            value: '获取最新数据',
          },
          {
            value: '上传数据到云',
          },
          {
            value: '断开蓝牙',
          },
        ]}
      />
    </View>
  );
};

export default memo(DeviceComponent);
