const DominConfigs = {
  // DOMAIN: 'http://im-here.cn:3222/wx-volunteer',
  DOMAIN: 'https://uricapi.jiarry.com/wx-patient',
};

export const AUTHORIZE = `${DominConfigs.DOMAIN}/login`;
export const REGISTER = `${DominConfigs.DOMAIN}/register`;
export const ME = `${DominConfigs.DOMAIN}/me`;
export const ME_UPDATE = `${DominConfigs.DOMAIN}/me/update`;
export const MEASURE_BASIC = `${DominConfigs.DOMAIN}/measure/basic`;
export const MEASURE_UPDATE = `${DominConfigs.DOMAIN}/measure/update`;
export const MEASURE_LATEST = `${DominConfigs.DOMAIN}/measure/latest`;
export const DOCTOR_LIST = `${DominConfigs.DOMAIN}/doctor/list`;
export const DOCTOR_DETAIL = `${DominConfigs.DOMAIN}/doctor/detail`;
export const DOCTOR_BIND = `${DominConfigs.DOMAIN}/doctor/bind`;
export const DOCTOR_ACTIVE = `${DominConfigs.DOMAIN}/doctor/active`;
export const ARTICLE_TOP = `${DominConfigs.DOMAIN}/article/top`;
export const ARTICLE_LIST = `${DominConfigs.DOMAIN}/article/list`;
export const ARTICLE_DETAIL = `${DominConfigs.DOMAIN}/article/detail`;
export const HOSPITAL_SEARCH = `${DominConfigs.DOMAIN}/hospital/search`;

export const CHART_LINE = `${DominConfigs.DOMAIN}/chart/line`;
export const CHART_PIE = `${DominConfigs.DOMAIN}/chart/pie`;
