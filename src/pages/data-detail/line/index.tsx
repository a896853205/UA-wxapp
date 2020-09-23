// TODO: 将data-detail的折线组件抽象到这里
import Taro, { useState, memo, useEffect } from '@tarojs/taro';
import { View, Picker, Text } from '@tarojs/components';
import {
  AtButton,
  AtList,
  AtListItem,
  AtToast,
  AtModalContent,
  AtModal,
} from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';
// import Chart from 'taro-echarts';

import { CHART_LINE } from '../../../constants/api-constants';
import http from '../../../util/http';
import { addMeasureData } from '../../../actions/addMeasure';
import SingleLine from './components/single-line';

import './line.css';

interface IMeasure {
  measureText: string;
  measureType: string;
}
interface IStatus {
  measure: IMeasure;
}

interface IAdd {
  isAdded: boolean;
}
interface Istatus {
  addMeasure: IAdd;
}

const TIME_RANGE = ['过去一周', '过去一个月'];

const getCurrentWeek = () => {
  const week = ['日', '一', '二', '三', '四', '五', '六'];
  let now = new Date();

  let spli = week.splice(0, now.getDay() + 1);

  return [...week, ...spli];
};

const Line = () => {
  const [timeSpanIndex, setTimeSpanIndex] = useState(0);
  const [measureBasicList, setMeasureBasicList] = useState<any>([]);
  const [getDataLoading, setGetDataLoading] = useState(false);

  const [fat, setFat] = useState<any>([]);
  const [sugar, setSugar] = useState<any>([]);
  const [uric, setUric] = useState<any>([]);
  // const [isNeedRefresh, setIsNeedRefresh] = useState(true);

  const [baseIsOpened, setBaseIsOpened] = useState(false);
  const [uricIsOpened, setUricIsOpened] = useState(false);
  const [fatIsOpened, setFatIsOpened] = useState(false);
  const [sugarIsOpened, setSugarIsOpened] = useState(false);

  // const [singleUricHigh, setSingleUricHigh] = useState('');
  // const [singleUricLow, setSingleUricLow] = useState('');
  // const [uricHigh, setUricHigh] = useState('');
  // const [uricLow, setUricLow] = useState('');
  // const [sugarHigh, setSugarHigh] = useState('');
  // const [sugarLow, setSugarLow] = useState('');
  // const [fatHigh, setFatHigh] = useState('');
  // const [fatLow, setFatLow] = useState('');

  const { measureType } = useSelector<IStatus, IMeasure>(
    (state) => state.measure
  );
  const { isAdded } = useSelector<Istatus, IAdd>((state) => state.addMeasure);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(addMeasureData(true));
  }, [])

  // useEffect(() => {
  //   (async () => {
  //     setGetDataLoading(true);

  //     const res = await http({
  //       url: ME,
  //       method: 'GET',
  //     });

  //     if (res) {
  //       if (measureType === 'single') {
  //         setSingleUricHigh(res.data.data.uric_high.toString());
  //         setSingleUricLow(res.data.data.uric_low.toString());
  //       } else {
  //         setUricHigh(res.data.data.uric_high.toString());
  //         setUricLow(res.data.data.uric_low.toString());
  //         setSugarHigh(res.data.data.sugar_high.toString());
  //         setSugarLow(res.data.data.sugar_low.toString());
  //         setFatHigh(res.data.data.fat_high.toString());
  //         setFatLow(res.data.data.fat_low.toString());
  //       }
  //     }

  //     setGetDataLoading(false);
  //   })();
  // }, []);

  useEffect(() => {
    (async () => {
      if (isAdded && !getDataLoading) {
        setGetDataLoading(true);

        const res = await http({
          url: CHART_LINE,
          method: 'GET',
          data: {
            type: measureType === 'single' ? measureType : 'triple',
            days: timeSpanIndex ? 30 : 7,
          },
        });

        if (res.statusCode === 500) {
          Taro.atMessage({
            message: '获取列表失败',
            type: 'error',
          });
        } else if (res.statusCode === 200) {
          if (measureType === 'single') {
            setMeasureBasicList(res.data.data);
          } else {
            // 设置三个数组
            setFat(res.data.data.fat);
            setSugar(res.data.data.sugar);
            setUric(res.data.data.uric);
          }
        }

        setGetDataLoading(false);
        dispatch(addMeasureData(false));
        // setIsNeedRefresh(false);
      }
    })();
  }, [timeSpanIndex, isAdded]);

  return (
    <View>
      <AtToast
        isOpened={getDataLoading}
        hasMask
        status="loading"
        text="患者健康数据加载中..."
      />
      {/* FIXME: 多一个自定义时间,点到自定义时间时就多出一个Picker */}
      {/* <Picker
        mode="selector"
        range={TIME_RANGE}
        onChange={(e) => {
          setTimeSpanIndex(+e.detail.value);
        }}
        value={timeSpanIndex}
      > */}
      <AtList>
        <Picker
          mode="selector"
          range={TIME_RANGE}
          onChange={(e) => {
            setTimeSpanIndex(+e.detail.value);
            dispatch(addMeasureData(true));
          }}
          value={timeSpanIndex}
        >
          <View style="padding: 30rpx 0 0 0">
            <AtListItem
              title="时间段选择："
              extraText={TIME_RANGE[timeSpanIndex]}
              arrow="right"
              hasBorder={false}
            />
          </View>
        </Picker>
      </AtList>
      {/* </Picker> */}
      {measureType === 'single' ? (
        <View className="line-box" >
          <View className="line-title">
            <Text>尿酸</Text>
            {/* {timeSpanIndex ? null : ( */}
            <Text
              onClick={() => {
                setBaseIsOpened(true);
              }}
            >
              查看详情 &gt;
              </Text>
            {/* )} */}
          </View>
          <View style={{ display: baseIsOpened ? 'none' : 'block' }}>
            <SingleLine
              timeSpanIndex={timeSpanIndex}
              measureBasicList={measureBasicList}
            />
          </View>
        </View>
      ) : null}

      <AtModal isOpened={baseIsOpened} onClose={() => setBaseIsOpened(false)}>
        <AtModalContent>
          <AtList>
            {timeSpanIndex ? measureBasicList.map((item, index) => {
              return (
                <AtListItem
                  title={`第${index + 1}天`}
                  extraText={item ? `${item}` : '0'}
                  key={index}
                />
              )
            }) :
              measureBasicList.map((item, index) => {
                return (
                  <AtListItem
                    title={`星期${getCurrentWeek()[index]}`}
                    extraText={item ? `${item}` : '0'}
                    key={index}
                  />
                );
              })}
          </AtList>
        </AtModalContent>
      </AtModal>

      {measureType === 'joint' ? (
        <View className="line-box">
          <View className="line-title">
            <Text>尿酸</Text>
            {/* {timeSpanIndex ? null : ( */}
            <Text
              onClick={() => {
                setUricIsOpened(true);
              }}
            >
              查看详情 &gt;
              </Text>
            {/* )} */}
          </View>
          <View style={{ display: uricIsOpened || fatIsOpened || sugarIsOpened ? 'none' : 'block' }}>
            <SingleLine
              timeSpanIndex={timeSpanIndex}
              measureBasicList={uric}
            />
          </View>
          <AtModal
            isOpened={uricIsOpened}
            onClose={() => setUricIsOpened(false)}
          >
            <AtModalContent>
              <AtList>
                {timeSpanIndex ? uric.map((item, index) => {
                  return (
                    <AtListItem
                      title={`第${index + 1}天`}
                      extraText={item ? `${item}` : '0'}
                      key={index}
                    />
                  )
                }) :
                  uric.map((item, index) => {
                    return (
                      <AtListItem
                        title={`星期${getCurrentWeek()[index]}`}
                        extraText={item ? `${item}` : '0'}
                        key={index}
                      />
                    );
                  })}
              </AtList>
            </AtModalContent>
          </AtModal>

          <View className="line-title">
            <Text>血脂</Text>
            {/* {timeSpanIndex ? null : ( */}
            <Text
              onClick={() => {
                setFatIsOpened(true);
              }}
            >
              查看详情 &gt;
              </Text>
            {/* )} */}
          </View>
          <View style={{ display: uricIsOpened || fatIsOpened || sugarIsOpened ? 'none' : 'block' }}>
            <SingleLine
              timeSpanIndex={timeSpanIndex}
              measureBasicList={fat}
            />
          </View>
          <AtModal isOpened={fatIsOpened} onClose={() => setFatIsOpened(false)}>
            <AtModalContent>
              <AtList>
                {timeSpanIndex ? fat.map((item, index) => {
                  return (
                    <AtListItem
                      title={`第${index + 1}天`}
                      extraText={item ? `${item}` : '0'}
                      key={index}
                    />
                  )
                }) : fat.map((item, index) => {
                  return (
                    <AtListItem
                      title={`星期${getCurrentWeek()[index]}`}
                      extraText={item ? `${item}` : '0'}
                      key={index}
                    />
                  );
                })}
              </AtList>
            </AtModalContent>
          </AtModal>

          <View className="line-title">
            <Text>血糖</Text>
            {/* {timeSpanIndex ? null : ( */}
            <Text
              onClick={() => {
                setSugarIsOpened(true);
              }}
            >
              查看详情 &gt;
              </Text>
            {/* )} */}
          </View>
          <View style={{ display: uricIsOpened || fatIsOpened || sugarIsOpened ? 'none' : 'block' }}>
            <SingleLine
              timeSpanIndex={timeSpanIndex}
              measureBasicList={sugar}
            />
          </View>
          <AtModal
            isOpened={sugarIsOpened}
            onClose={() => setSugarIsOpened(false)}
          >
            <AtModalContent>
              <AtList>
                {timeSpanIndex ? sugar.map((item, index) => {
                  return (
                    <AtListItem
                      title={`第${index + 1}天`}
                      extraText={item ? `${item}` : '0'}
                      key={index}
                    />
                  )
                }) : sugar.map((item, index) => {
                  return (
                    <AtListItem
                      title={`星期${getCurrentWeek()[index]}`}
                      extraText={item ? `${item}` : '0'}
                      key={index}
                    />
                  );
                })}
              </AtList>
            </AtModalContent>
          </AtModal>
        </View>
      ) : null}
      <AtButton
        type="primary"
        size="normal"
        full={true}
        onClick={() => {
          Taro.navigateTo({ url: '/pages/save-data/index' });
        }}
      >
        手动添加数据
      </AtButton>
    </View>
  );
};

export default memo(Line);
