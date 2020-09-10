import Taro, { memo, useEffect, useState } from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { AtToast, AtMessage } from 'taro-ui';

import { ARTICLE_DETAIL } from '../../constants/api-constants';
import http from '../../util/http';

const NewsDetail = () => {
  const newsIndex = Taro.getStorageSync('newsIndex');
  const [getDataLoading, setGetDataLoading] = useState(false);
  const [articleTitle, setArticleTitle] = useState();
  const [content, setContent] = useState('')

  useEffect(() => {
    (async () => {
      setGetDataLoading(true);

      const res = await http({
        url: ARTICLE_DETAIL,
        method: 'GET',
        data: {
          id: newsIndex
        },
      });

      if (res.statusCode === 500) {
        Taro.atMessage({
          message: '获取信息失败',
          type: 'error',
        });
      } else if (res.statusCode === 200) {
        setArticleTitle(res.data.data.title);
        // 这里再请求一下
        const htmlRes = await Taro.request({
          url: res.data.data.content,
          method: 'GET',
        });

        setContent(htmlRes.data)
      }

      setGetDataLoading(false);
    })();
  }, []);

  return (
    <View>
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="新闻文本加载中..."
      />
      <AtMessage />
      {articleTitle}
      <RichText nodes={content} space="emsp" />
    </View>
  );
};

export default memo(NewsDetail);
