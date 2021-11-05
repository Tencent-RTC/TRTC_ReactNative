import React, { useState } from 'react';
import {
  StyleSheet,
  Button,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  TextInput,
  View,
  ScrollView,
  Alert,
} from 'react-native';

import TRTCCloud, {
  TRTCCloudDef,
  TRTCCloudListener,
  TRTCParams,
  TXVideoView,
} from '../../src/trtc_cloud';
import { demoParamsGroup } from './demoParamsGroup';

// @ts-ignore
import getLatestUserSig from './debug/index';
// @ts-ignore
import { SDKAPPID } from './debug/config';

export default function App() {
  const [meetId, setMeetId] = React.useState('6868');
  const [userId, setUserId] = React.useState('');
  const [isEnter, setIsEnter] = useState(false);
  const [remoteUserId, setRemoteUserId] = useState(null);
  const [remoteVideo, setRemoteVideo] = useState(false);
  const [remoteSub, setRemoteSub] = useState(false);
  React.useEffect(() => {
    initInfo();
    return () => {
      console.log('destroy');
      const trtcCloud = TRTCCloud.sharedInstance();
      trtcCloud.unRegisterListener(onRtcListener);
    };
  }, []);

  async function initInfo() {
    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //音频需要
        PermissionsAndroid.PERMISSIONS.CAMERA, // 视频需要
      ]);
    }
    const trtcCloud = TRTCCloud.sharedInstance();
    trtcCloud.registerListener(onRtcListener);
  }

  function onRtcListener(type: TRTCCloudListener, params: any) {
    if (type === TRTCCloudListener.onEnterRoom) {
      console.log('==onEnterRoom');
      if (params.result > 0) {
        setIsEnter(true);
      }
    }
    if (type === TRTCCloudListener.onExitRoom) {
      setIsEnter(false);
      setRemoteUserId(null);
    }
    if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
      setRemoteUserId(params.userId);
    }
    if (type === TRTCCloudListener.onRemoteUserLeaveRoom) {
      setRemoteUserId(null);
    }
    if (type === TRTCCloudListener.onUserVideoAvailable) {
      setRemoteVideo(params.available);
    }
    if (type === TRTCCloudListener.onUserSubStreamAvailable) {
      setRemoteSub(params.available);
    }
    if (
      type !== TRTCCloudListener.onNetworkQuality &&
      type !== TRTCCloudListener.onStatistics
    ) {
      console.log(type, params);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ padding: 20 }}>
        <TextInput
          style={{ height: 40, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => setMeetId(text)}
          value={meetId}
          placeholder="请输入房间id"
        />
        <TextInput
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            marginTop: 10,
            marginBottom: 10,
          }}
          onChangeText={(text) => setUserId(text)}
          value={userId}
          placeholder="请输入用户id"
        />
        <View style={styles.fixToText}>
          <Button
            title="进入房间"
            onPress={() => {
              if (!SDKAPPID) {
                Alert.alert('请配置SDKAPPID信息');
                return;
              }
              if (!meetId || !userId) {
                Alert.alert('请输入房间id和用户id');
                return;
              }
              const userSig = getLatestUserSig(userId).userSig;
              const params = new TRTCParams({
                sdkAppId: SDKAPPID,
                userId,
                userSig,
                roomId: Number(meetId),
              });
              const trtcCloud = TRTCCloud.sharedInstance();
              trtcCloud.enterRoom(
                params,
                TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL
              );
              // trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
            }}
          />
          <Button
            title="退出房间"
            onPress={() => {
              const trtcCloud = TRTCCloud.sharedInstance();
              trtcCloud.exitRoom();
            }}
          />
        </View>
      </View>
      {isEnter && (
        <TXVideoView.LocalView
          style={styles.video}
          renderParams={{
            rotation: TRTCCloudDef.TRTC_VIDEO_ROTATION_0,
          }}
        />
      )}
      {remoteUserId && remoteVideo && (
        <TXVideoView.RemoteView
          userId={remoteUserId}
          viewType={TRTCCloudDef.TRTC_VideoView_SurfaceView}
          streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
          renderParams={{
            rotation: TRTCCloudDef.TRTC_VIDEO_ROTATION_90,
          }}
          style={styles.video}
        />
      )}
      {remoteUserId && remoteSub && (
        <TXVideoView.RemoteView
          userId={remoteUserId}
          viewType={TRTCCloudDef.TRTC_VideoView_SurfaceView}
          streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB}
          style={styles.video}
        />
      )}
      <ScrollView style={styles.scrollView}>
        {demoParamsGroup.map((value) => {
          return (
            <Button
              title={value.title}
              key={value.title}
              onPress={() => {
                value.handler();
              }}
            />
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scrollView: {
    backgroundColor: 'white',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  video: {
    width: 240,
    height: 180,
  },
});
