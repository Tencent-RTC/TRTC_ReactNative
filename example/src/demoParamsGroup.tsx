import { Alert } from 'react-native';
import TRTCCloud, {
  TRTCParams,
  TRTCCloudDef,
  TXVoiceChangerType,
  TXVoiceReverbType,
  TRTCSwitchRoomConfig,
  TRTCPublishCDNParam,
  TRTCAudioRecordingParams,
  AudioMusicParam,
  TXSystemVolumeType,
} from '../../src/trtc_cloud';
// @ts-ignore
import getLatestUserSig from './debug/index';
// @ts-ignore
import { SDKAPPID } from './debug/config';
type Config = {
  title: string;
  handler: Function;
};

// 创建 TRTCCloud 单例
const trtcCloud = TRTCCloud.sharedInstance();
// 获取设备管理模块
const txDeviceManager = trtcCloud.getDeviceManager();
// 获取美颜管理对象
// const txBeautyManager = trtcCloud.getBeautyManager();
// 获取音效管理类 TXAudioEffectManager
const txAudioManager = trtcCloud.getAudioEffectManager();
const userId = '4545';
const userSig = getLatestUserSig(userId).userSig;

// 注册事件回调
// trtcCloud.registerListener(onRtcListener);
const demoParamsGroup: Array<Config> = [
  {
    title: 'getSDKVersion',
    handler: async () => {
      const version = await trtcCloud.getSDKVersion();
      Alert.alert(version);
    },
  },
  {
    title: 'enterRoom',
    handler: async () => {
      const params = new TRTCParams({
        sdkAppId: SDKAPPID,
        userId,
        userSig,
        roomId: 3366,
        // role: TRTCCloudDef.TRTCRoleAudience,
      });
      trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);
    },
  },
  {
    title: 'exitRoom',
    handler: async () => {
      trtcCloud.exitRoom();
    },
  },
  // cloud manager begin
  {
    title: 'connectOtherRoom',
    handler: async () => {
      const otherRoom = {
        roomId: 2288,
        userId: '345',
      };
      trtcCloud.connectOtherRoom(JSON.stringify(otherRoom));
    },
  },
  {
    title: 'disconnectOtherRoom',
    handler: async () => {
      trtcCloud.disconnectOtherRoom();
    },
  },
  {
    title: 'switchRole-anchor',
    handler: async () => {
      trtcCloud.switchRole(TRTCCloudDef.TRTCRoleAnchor);
    },
  },
  {
    title: 'switchRole-audience',
    handler: async () => {
      trtcCloud.switchRole(TRTCCloudDef.TRTCRoleAudience);
    },
  },
  {
    title: 'setDefaultStreamRecvMode',
    handler: async () => {
      trtcCloud.setDefaultStreamRecvMode(true, true);
    },
  },
  {
    title: 'switchRoom',
    handler: async () => {
      const roomConfig: TRTCSwitchRoomConfig = {
        userSig,
        roomId: 2288,
      };
      trtcCloud.switchRoom(roomConfig);
    },
  },
  {
    title: 'startPublishing',
    handler: async () => {
      trtcCloud.startPublishing(
        'clavie_stream_001',
        TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG
      );
    },
  },
  {
    title: 'stopPublishing',
    handler: async () => {
      trtcCloud.stopPublishing();
    },
  },
  {
    title: 'startPublishCDNStream',
    handler: async () => {
      const param: TRTCPublishCDNParam = {
        appId: 112,
        bizId: 233,
        url: 'https://www.baidu.com',
      };
      trtcCloud.startPublishCDNStream(param);
    },
  },
  {
    title: 'stopPublishCDNStream',
    handler: async () => {
      trtcCloud.stopPublishCDNStream();
    },
  },
  {
    title: 'startLocalAudio',
    handler: async () => {
      trtcCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
    },
  },
  {
    title: 'stopLocalAudio',
    handler: async () => {
      trtcCloud.stopLocalAudio();
    },
  },
  {
    title: 'muteLocalAudio-true',
    handler: async () => {
      trtcCloud.muteLocalAudio(true);
    },
  },
  {
    title: 'muteLocalAudio-false',
    handler: async () => {
      trtcCloud.muteLocalAudio(false);
    },
  },
  {
    title: 'muteRemoteAudio-true',
    handler: async () => {
      trtcCloud.muteRemoteAudio('345', true);
    },
  },
  {
    title: 'muteRemoteAudio-false',
    handler: async () => {
      trtcCloud.muteRemoteAudio('345', false);
    },
  },
  {
    title: 'muteAllRemoteAudio',
    handler: async () => {
      trtcCloud.muteAllRemoteAudio(true);
    },
  },
  {
    title: 'setRemoteAudioVolume-80',
    handler: async () => {
      trtcCloud.setRemoteAudioVolume('345', 80);
    },
  },
  {
    title: 'setRemoteAudioVolume-0',
    handler: async () => {
      trtcCloud.setRemoteAudioVolume('345', 0);
    },
  },
  {
    title: 'setAudioCaptureVolume-80',
    handler: async () => {
      trtcCloud.setAudioCaptureVolume(80);
    },
  },
  {
    title: 'getAudioCaptureVolume',
    handler: async () => {
      let volume = await trtcCloud.getAudioCaptureVolume();
      Alert.alert(volume.toString());
    },
  },
  {
    title: 'setAudioPlayoutVolume-80',
    handler: async () => {
      trtcCloud.setAudioPlayoutVolume(80);
    },
  },
  {
    title: 'getAudioPlayoutVolume',
    handler: async () => {
      let volume = await trtcCloud.getAudioPlayoutVolume();
      Alert.alert(volume.toString());
    },
  },
  {
    title: 'enableAudioVolumeEvaluation-300',
    handler: async () => {
      trtcCloud.enableAudioVolumeEvaluation(300);
    },
  },
  {
    title: 'enableAudioVolumeEvaluation-0',
    handler: async () => {
      trtcCloud.enableAudioVolumeEvaluation(0);
    },
  },
  {
    title: 'startAudioRecording',
    handler: async () => {
      const param: TRTCAudioRecordingParams = {
        filePath: '/Users/linzhi/Downloads/xxx/a',
      };
      let number = await trtcCloud.startAudioRecording(param);
      Alert.alert(number.toString());
    },
  },
  {
    title: 'stopAudioRecording',
    handler: async () => {
      trtcCloud.stopAudioRecording();
    },
  },
  {
    title: 'startSpeedTest',
    handler: async () => {
      trtcCloud.startSpeedTest(SDKAPPID, userId, userSig);
    },
  },
  {
    title: 'stopSpeedTest',
    handler: async () => {
      trtcCloud.stopSpeedTest();
    },
  },
  {
    title: 'setLogLevel',
    handler: async () => {
      trtcCloud.setLogLevel(TRTCCloudDef.TRTC_LOG_LEVEL_NULL);
    },
  },
  {
    title: 'setConsoleEnabled',
    handler: async () => {
      trtcCloud.setConsoleEnabled(true);
    },
  },
  {
    title: 'setLogCompressEnabled',
    handler: async () => {
      trtcCloud.setLogCompressEnabled(true);
    },
  },
  {
    title: 'setLogDirPath',
    handler: async () => {
      trtcCloud.setLogDirPath('~/Downloads/trtc-react-natibe-sdk-log');
    },
  },
  {
    title: 'callExperimentalAPI',
    handler: async () => {
      trtcCloud.callExperimentalAPI('223');
    },
  },

  // cloud manager end
  // audio manager begin
  {
    title: 'enableVoiceEarMonitor',
    handler: async () => {
      txAudioManager.enableVoiceEarMonitor(true);
    },
  },
  {
    title: 'setVoiceEarMonitorVolume',
    handler: async () => {
      txAudioManager.setVoiceEarMonitorVolume(100);
    },
  },
  {
    title: 'setVoiceReverbType',
    handler: async () => {
      txAudioManager.setVoiceReverbType(
        TXVoiceReverbType.TXLiveVoiceReverbType_1
      );
    },
  },
  {
    title: 'setVoiceChangerType',
    handler: async () => {
      txAudioManager.setVoiceChangerType(
        TXVoiceChangerType.TXLiveVoiceChangerType_1
      );
    },
  },
  {
    title: 'setVoiceCaptureVolume-100',
    handler: async () => {
      txAudioManager.setVoiceCaptureVolume(100);
    },
  },
  {
    title: 'setVoiceCaptureVolume-0',
    handler: async () => {
      txAudioManager.setVoiceCaptureVolume(0);
    },
  },
  {
    title: 'startPlayMusic',
    handler: async () => {
      let audioParam: AudioMusicParam = {
        id: 1001,
        publish: true,
        path: 'https://imgcache.qq.com/operation/dianshi/other/daoxiang.72c46ee085f15dc72603b0ba154409879cbeb15e.mp3',
      };
      txAudioManager.startPlayMusic(audioParam);
    },
  },
  {
    title: 'stopPlayMusic',
    handler: async () => {
      txAudioManager.stopPlayMusic(1001);
    },
  },
  {
    title: 'pausePlayMusic',
    handler: async () => {
      txAudioManager.pausePlayMusic(1001);
    },
  },
  {
    title: 'resumePlayMusic',
    handler: async () => {
      txAudioManager.resumePlayMusic(1001);
    },
  },
  {
    title: 'setMusicPublishVolume',
    handler: async () => {
      txAudioManager.setMusicPublishVolume(1001, 80);
    },
  },
  {
    title: 'setMusicPlayoutVolume',
    handler: async () => {
      txAudioManager.setMusicPlayoutVolume(1001, 80);
    },
  },
  {
    title: 'setAllMusicVolume',
    handler: async () => {
      txAudioManager.setAllMusicVolume(80);
    },
  },
  {
    title: 'setMusicPitch',
    handler: async () => {
      txAudioManager.setMusicPitch(1001, 0.5);
    },
  },
  {
    title: 'setMusicSpeedRate',
    handler: async () => {
      txAudioManager.setMusicSpeedRate(1001, 2);
    },
  },
  {
    title: 'getMusicCurrentPosInMS',
    handler: async () => {
      let time = await txAudioManager.getMusicCurrentPosInMS(1001);
      Alert.alert(time.toString());
    },
  },
  {
    title: 'seekMusicToPosInMS',
    handler: async () => {
      txAudioManager.seekMusicToPosInMS(1001, 3000);
    },
  },
  {
    title: 'getMusicDurationInMS',
    handler: async () => {
      let time = await txAudioManager.getMusicDurationInMS(
        'https://imgcache.qq.com/operation/dianshi/other/daoxiang.72c46ee085f15dc72603b0ba154409879cbeb15e.mp3'
      );
      Alert.alert(time.toString());
    },
  },
  {
    title: 'setSystemVolumeType',
    handler: async () => {
      txDeviceManager.setSystemVolumeType(
        TXSystemVolumeType.TXSystemVolumeTypeAuto
      );
    },
  },
  {
    title: 'setAudioRoute',
    handler: async () => {
      txDeviceManager.setAudioRoute(TRTCCloudDef.TRTC_AUDIO_ROUTE_SPEAKER);
    },
  },
  // device manager end
];

export { demoParamsGroup };
