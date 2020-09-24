import Taro, { memo, useEffect, useState } from '@tarojs/taro';
import { View, RichText } from '@tarojs/components';
import { AtToast, AtMessage } from 'taro-ui';
import { useDispatch } from '@tarojs/redux';

import { ARTICLE_DETAIL } from '../../constants/api-constants';
import http from '../../util/http';
import { readNews } from '../../actions/read-news';

const NewsDetail = () => {
  const newsIndex = Taro.getStorageSync('newsIndex');
  const [getDataLoading, setGetDataLoading] = useState(false);
  // const [articleTitle, setArticleTitle] = useState();
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

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
        dispatch(readNews(true));
        // setArticleTitle(res.data.data.title);
        // 这里再请求一下
        const htmlRes = await Taro.request({
          url: res.data.data.content,
          method: 'GET',
        });

        setContent(htmlRes.data);
      }

      setGetDataLoading(false);
    })();
  }, []);


  return (
    <View className='title'>
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="新闻文本加载中..."
      />
      <AtMessage />
      <View style='padding:30rpx'>
        <RichText nodes={content} space="emsp" className='news-detail-box' />
      </View>
    </View>
  );
};

export default memo(NewsDetail);
