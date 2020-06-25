import Taro from '@tarojs/taro';

const interceptor = (chain) => {
  const requestParams = chain.requestParams;

  const token = Taro.getStorageSync('token');

  requestParams.header = {
    ...requestParams.header,
    Authorization: `Bearer ${token}`,
  };

  return chain.proceed(requestParams).then((res) => {
    return res;
  });
};

Taro.addInterceptor(interceptor);

export default Taro.request;
