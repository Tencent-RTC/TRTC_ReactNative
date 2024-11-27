import { Alert } from 'react-native';
import TRTCCloud, {
  TRTCCloudDef,
  TXVoiceChangerType,
  TXVoiceReverbType,
  TXSystemVolumeType
} from 'trtc-react-native';

import type {
    TRTCSwitchRoomConfig,
    TRTCPublishCDNParam,
    TRTCAudioRecordingParams,
    TRTCVideoEncParam,
    TRTCNetworkQosParam,
    TRTCTranscodingConfig,
    AudioMusicParam
  } from 'trtc-react-native';
// @ts-ignore
import getLatestUserSig from './debug/index';
// @ts-ignore
import { SDKAPPID } from './debug/config';
type Config = {
  title: string;
  handler: Function;
};

const trtcCloud = TRTCCloud.sharedInstance();
const txDeviceManager = trtcCloud.getDeviceManager();
const txAudioManager = trtcCloud.getAudioEffectManager();
const txBeautyManager = trtcCloud.getBeautyManager();

const userId = '4545';
const userSig = getLatestUserSig(userId).userSig;

const demoParamsGroup: Array<Config> = [
  {
    title: 'getSDKVersion',
    handler: async () => {
      const version = await trtcCloud.getSDKVersion();
      Alert.alert(version);
    },
  },
  {
    title: 'isFrontCamera',
    handler: async () => {
      Alert.alert((await txDeviceManager.isFrontCamera()).toString());
    },
  },
  {
    title: 'switchCamera',
    handler: async () => {
      txDeviceManager.switchCamera(false);
    },
  },
  {
    title: 'setCameraZoomRatio',
    handler: async () => {
      txDeviceManager.setCameraZoomRatio(5);
    },
  },
  {
    title: 'enableCameraTorch',
    handler: async () => {
      Alert.alert((await txDeviceManager.enableCameraTorch(true)).toString());
    },
  },
  {
    title: 'setCameraFocusPosition',
    handler: async () => {
      txDeviceManager.setCameraFocusPosition(0, 0);
    },
  },
  {
    title: 'getCameraZoomMaxRatio',
    handler: async () => {
      Alert.alert((await txDeviceManager.getCameraZoomMaxRatio()).toString());
    },
  },
  {
    title: 'enableCameraAutoFocus',
    handler: async () => {
      Alert.alert(
        (await txDeviceManager.enableCameraAutoFocus(true)).toString()
      );
    },
  },
  {
    title: 'setBeautyStyle',
    handler: async () => {
      txBeautyManager.setBeautyStyle(TRTCCloudDef.TRTC_BEAUTY_STYLE_NATURE);
    },
  },
  {
    title: 'setFilter',
    handler: async () => {
      txBeautyManager.setFilter(
        'https://main.qcloudimg.com/raw/3f9146cacab4a019b0cc44b8b22b6a38.png'
      );
    },
  },
  {
    title: 'setFilterStrength',
    handler: async () => {
      txBeautyManager.setFilterStrength(1);
    },
  },
  {
    title: 'setBeautyLevel-9',
    handler: async () => {
      txBeautyManager.setBeautyLevel(9);
    },
  },
  {
    title: 'setBeautyLevel-0',
    handler: async () => {
      txBeautyManager.setBeautyLevel(0);
    },
  },
  {
    title: 'setWhitenessLevel-9',
    handler: async () => {
      txBeautyManager.setWhitenessLevel(9);
    },
  },
  {
    title: 'setWhitenessLevel-0',
    handler: async () => {
      txBeautyManager.setWhitenessLevel(0);
    },
  },
  {
    title: 'setRuddyLevel-9',
    handler: async () => {
      txBeautyManager.setRuddyLevel(9);
    },
  },
  {
    title: 'setRuddyLevel-0',
    handler: async () => {
      txBeautyManager.setRuddyLevel(0);
    },
  },
  {
    title: 'enableSharpnessEnhancement',
    handler: async () => {
      txBeautyManager.enableSharpnessEnhancement(false);
    },
  },
  {
    title: 'setWatermark',
    handler: async () => {
      trtcCloud.setWatermark(
        'https://main.qcloudimg.com/raw/3f9146cacab4a019b0cc44b8b22b6a38.png',
        TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG,
        0.1,
        0.3,
        0.2
      );
    },
  },
  {
    title: 'setVideoMuteImage',
    handler: async () => {
      trtcCloud.setVideoMuteImage(
        'https://main.qcloudimg.com/raw/3f9146cacab4a019b0cc44b8b22b6a38.png',
        15
      );
    },
  },
  {
    title: 'setVideoMuteImage-Not push',
    handler: async () => {
      trtcCloud.setVideoMuteImage('', 15);
    },
  },
  {
    title: 'setMixTranscodingConfig',
    handler: async () => {
      const roomConfig: TRTCTranscodingConfig = {
        mode: TRTCCloudDef.TRTC_TranscodingConfigMode_Template_PresetLayout,
        videoWidth: 720,
        videoHeight: 1280,
        videoBitrate: 1500,
        videoFramerate: 20,
        videoGOP: 2,
        streamId: '22333',
        audioSampleRate: 48000,
        audioBitrate: 64,
        audioChannels: 2,
        mixUsers: [
          {
            width: 720,
            height: 1280,
            x: 0,
            y: 0,
            userId: 'jack', 
            zOrder: 1,
          },
          {
            width: 180,
            height: 240,
            x: 400,
            y: 800,
            userId: '$PLACE_HOLDER_REMOTE$',
            zOrder: 2,
          },
        ],
      };
      trtcCloud.setMixTranscodingConfig(roomConfig);
    },
  },
  {
    title: 'setGSensorMode',
    handler: async () => {
      trtcCloud.setGSensorMode(TRTCCloudDef.TRTC_GSENSOR_MODE_UIFIXLAYOUT);
    },
  },
  {
    title: 'setVideoEncoderParam',
    handler: async () => {
      const roomConfig: TRTCVideoEncParam = {
        videoFps: 15,
        videoBitrate: 1600,
        minVideoBitrate: 0,
        enableAdjustRes: true,
        videoResolutionMode: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_MODE_LANDSCAPE,
        videoResolution: TRTCCloudDef.TRTC_VIDEO_RESOLUTION_640_360,
      };
      trtcCloud.setVideoEncoderParam(roomConfig);
    },
  },
  {
    title: 'setNetworkQosParam',
    handler: async () => {
      const roomConfig: TRTCNetworkQosParam = {
        preference: TRTCCloudDef.TRTC_VIDEO_QOS_PREFERENCE_SMOOTH,
        controlMode: TRTCCloudDef.VIDEO_QOS_CONTROL_CLIENT,
      };
      trtcCloud.setNetworkQosParam(roomConfig);
    },
  },
  {
    title: 'setVideoEncoderRotation',
    handler: async () => {
      trtcCloud.setVideoEncoderRotation(TRTCCloudDef.TRTC_VIDEO_ROTATION_180);
    },
  },
  {
    title: 'setVideoEncoderMirror',
    handler: async () => {
      trtcCloud.setVideoEncoderMirror(true);
    },
  },
  {
    title: 'muteLocalVideo-true',
    handler: async () => {
      trtcCloud.muteLocalVideo(true);
    },
  },
  {
    title: 'muteLocalVideo-false',
    handler: async () => {
      trtcCloud.muteLocalVideo(false);
    },
  },
  {
    title: 'muteRemoteVideoStream-true',
    handler: async () => {
      trtcCloud.muteRemoteVideoStream('345', true);
    },
  },
  {
    title: 'muteRemoteVideoStream-false',
    handler: async () => {
      trtcCloud.muteRemoteVideoStream('345', false);
    },
  },
  {
    title: 'muteAllRemoteVideoStreams-true',
    handler: async () => {
      trtcCloud.muteAllRemoteVideoStreams(true);
    },
  },
  {
    title: 'muteAllRemoteVideoStreams-false',
    handler: async () => {
      trtcCloud.muteAllRemoteVideoStreams(false);
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
    title: 'sendSEIMsg',
    handler: async () => {
      const sampleData = "hello trtc";
      const repeat = 1;
      trtcCloud.sendSEIMsg(sampleData, repeat);
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
