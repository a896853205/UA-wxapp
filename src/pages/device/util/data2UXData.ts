// 握手指令返回确认指令
// 7b00FF7d0011

// 数据例子(尿酸单例)
// 7b01a00000001c221406050a317da7

// 数据结束指令
// 7b0140007d47

interface UXData {
  type: string;
  uric: number;
  timestamp: number;
}

// 把数组两两分组
const _dataSplit = (data: string): string[] => {
  const strArr: string[] = [];

  const dit = 2;

  for (let i = 0, len = data.length; i < len / dit; i++) {
    strArr.push(data.slice(dit * i, dit * (i + 1)));
  }
  return strArr;
};

// 把数组每一个字符串转为10进制的数
const _dataToDecimal = (data: string[]): number[] =>
  data.map((item) => parseInt(item, 16));

class UXSingleData {
  type = 'single';
  uric: number;
  timestamp: number;

  /**
   *
   * @param data 16进制特制数据
   * @example
   * // 数据例子(尿酸单例) 7b01a00000001c221406050a317da7
   */
  constructor(data: string) {
    if (data.length !== 30) {
      throw Error('数据格式错误');
    }

    const dataArray: number[] = _dataToDecimal(_dataSplit(data));

    // 尿酸值
    this.uric = dataArray[6] * 10 + dataArray[7] * 0.1;

    // 时间错误处理
    if (!dataArray[9]) {
      dataArray[9]++;
    }
    if (!dataArray[10]) {
      dataArray[10]++;
    }
    // 时间提取
    const time = new Date(
      `20${dataArray[8] >= 10 ? dataArray[8] : '0' + dataArray[8]}-${
        dataArray[9] >= 10 ? dataArray[9] : '0' + dataArray[9]
      }-${dataArray[10] >= 10 ? dataArray[10] : '0' + dataArray[10]} ${
        dataArray[11] >= 10 ? dataArray[11] : '0' + dataArray[11]
      }:${
        dataArray[12] >= 10 ? dataArray[12] : '0' + dataArray[12]
      }:00`.replace(/-/g, '/')
    );

    // 时间转换时间戳
    this.timestamp = time.getTime();
  }

  getTimeString = () => {
    const time = new Date(this.timestamp);

    return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${
      time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()
    }:${time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()}`;
  };
}

class UXThreeData {
  type = 'triple';
  uric: number;
  sugar: number;
  fat: number;
  timestamp: number;

  /**
   *
   * @param data 16进制特制数据
   * @example
   * // 数据例子(尿酸单例) 7b01a00000001c221406050a317da7
   */
  constructor(data: string) {
    if (data.length !== 38) {
      throw Error('数据格式错误');
    }

    const dataArray: number[] = _dataToDecimal(_dataSplit(data));

    // 尿酸值
    this.uric = dataArray[6] * 10 + dataArray[7] * 0.1;
    this.sugar = dataArray[8] * 10 + dataArray[9] * 0.1;
    this.fat = dataArray[10] * 10 + dataArray[11] * 0.1;

    if (!dataArray[13]) {
      dataArray[13]++;
    }
    if (!dataArray[14]) {
      dataArray[14]++;
    }
    // 时间提取
    const time = new Date(
      `20${dataArray[12] >= 10 ? dataArray[12] : '0' + dataArray[12]}-${
        dataArray[13] >= 10 ? dataArray[13] : '0' + dataArray[13]
      }-${dataArray[14] >= 10 ? dataArray[14] : '0' + dataArray[14]} ${
        dataArray[15] >= 10 ? dataArray[15] : '0' + dataArray[15]
      }:${
        dataArray[16] >= 10 ? dataArray[16] : '0' + dataArray[16]
      }:00`.replace(/-/g, '/')
    );

    // 时间转换时间戳
    this.timestamp = time.getTime();
  }

  getTimeString = () => {
    const time = new Date(this.timestamp);

    return `${time.getFullYear()}/${time.getMonth() + 1}/${time.getDate()} ${
      time.getHours() >= 10 ? time.getHours() : '0' + time.getHours()
    }:${time.getMinutes() >= 10 ? time.getMinutes() : '0' + time.getMinutes()}`;
  };
}

export { UXThreeData, UXSingleData };
