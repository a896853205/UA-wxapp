import Taro, { memo, useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton, AtForm, AtInput, AtMessage } from 'taro-ui';

import { REGISTER } from '../../constants/api-constants';
import http from '../../util/http';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [saveDataLoading, setSaveDataLoading] = useState(false);

  const submit = async () => {
    if (!saveDataLoading) {
      setSaveDataLoading(true);

      const resLogin = await Taro.login();
      const loginCode = resLogin.code;
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      if (loginCode) {
        const res = await http({
          url: REGISTER,
          method: 'POST',
          data: {
            js_code: loginCode,
            name: name,
            phone: phone,
          },
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '绑定失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          Taro.redirectTo({
            url: '../../pages/index/index',
          });
        }
      }
      setSaveDataLoading(false);
    }
  };

  return (
    <View>
      <AtMessage />
      <AtForm onSubmit={submit}>
        <AtInput
          name="name"
          title="姓名"
          type="text"
          placeholder="患者姓名"
          value={name}
          required
          onChange={(e) => {
            setName(`${e}`);
          }}
        />
        <AtInput
          name="phone"
          title="手机号"
          type="number"
          placeholder="患者本人手机号"
          value={phone}
          required
          onChange={(e) => {
            setPhone(`${e}`);
          }}
        />
        <AtInput
          name="identify"
          title="身份证"
          type="idcard"
          placeholder="患者本人身份证号码"
          value={phone}
          required
          onChange={(e) => {
            setPhone(`${e}`);
          }}
        />
        <AtButton
          full
          formType="submit"
          type="primary"
          loading={saveDataLoading}
        >
          绑定
        </AtButton>
      </AtForm>
    </View>
  );
};

export default memo(Register);
