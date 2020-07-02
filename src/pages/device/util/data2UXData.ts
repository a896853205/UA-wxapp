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
const dataSplit = (data: string): string[] => {
  const strArr: string[] = [];

  const dit = 2;

  for (let i = 0, len = data.length; i < len / dit; i++) {
    strArr.push(data.slice(dit * i, dit * (i + 1)));
  }
  return strArr;
};

// 把数组每一个字符串转为10进制的数
const dataToDecimal = (data: string[]): number[] =>
  data.map((item) => parseInt(item, 16));

const hex2Data = (data: string): UXData => {
  const dataArray: number[] = dataToDecimal(dataSplit(data));

  // 尿酸值
  const uricAcidValue: number = dataArray[6] * 10 + dataArray[7] * 0.1;

  // 时间提取
  const time: Date = new Date(
    `20${dataArray[8]}-${dataArray[9]}-${dataArray[10]} ${dataArray[11]}:${dataArray[12]}:00`
  );

  // 时间转换时间戳
  const timestamp: number = time.setHours(time.getHours());

  // 输出对象
  return {
    type: 'single',
    uric: uricAcidValue,
    timestamp,
  };
};

const UXThreeData = (data: string): string => {
  return data;
};

/**
 * 尿酸单项数据转成正常数据
 * @param data 16进制数据
 */
const UXSingleData = (data: string): UXData => {
  if (data.length !== 30) {
    throw Error('数据格式错误');
  } else {
    return hex2Data(data);
  }
};

export { UXThreeData, UXSingleData };
