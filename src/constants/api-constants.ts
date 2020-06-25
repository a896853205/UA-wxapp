const DominConfigs = {
  // DOMAIN: 'http://im-here.cn:3222/wx-volunteer',
  DOMAIN: 'https://uricapi.im-here.cn/wx-patient',
};

export const AUTHORIZE = `${DominConfigs.DOMAIN}/login`;
export const REGISTER = `${DominConfigs.DOMAIN}/register`;
export const MEASURE_BASIC = `${DominConfigs.DOMAIN}/measure/basic`;
export const MEASURE_UPDATE = `${DominConfigs.DOMAIN}/measure/update`;