import Taro from '@tarojs/taro';

export function inArray(arr, key, val) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) {
      return i;
    }
  }
  return -1;
}

export function hex2buffer(hex) {
  const typedArray = new Uint8Array(
    hex.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16);
    })
  );

  return typedArray.buffer;
}

// ArrayBuffer转16进度字符串示例
export function buf2hex(buffer) {
  return Array.prototype.map
    .call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2))
    .join('');
}

// 监听找到设备函数
export const onBluetoothDeviceFound = (callback) => {
  Taro.onBluetoothDeviceFound((res) => {
    console.log('onBluetoothDeviceFound', res);
    callback(res);
  });
};

// 蓝牙功能开启
export const openBluetoothAdapter = () => {
  return new Promise((resolve, reject) => {
    Taro.openBluetoothAdapter({
      success: () => {
        resolve();
      },
      fail: (res) => {
        if (res.errCode === 10001) {
          Taro.onBluetoothAdapterStateChange((res2) => {
            console.log('onBluetoothAdapterStateChange', res2);
            if (res2.available) {
              resolve();
            } else {
              reject();
            }
          });
          // state: 4, errCode: 10001
        }
      },
    });
  });
};

// 停止蓝牙扫描
export const stopBluetoothDevicesDiscovery = () => {
  Taro.stopBluetoothDevicesDiscovery();
};
