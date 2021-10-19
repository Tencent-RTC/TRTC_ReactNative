import { Alert } from 'react-native';
import TRTCCloud, {
  TRTCParams,
  TRTCCloudDef,
  TXVoiceChangerType,
  TXVoiceReverbType,
} from 'react-native-trtc-react-native-sdk';
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
      const userId = 'lexuslin';
      const userSig = getLatestUserSig(userId).userSig;
      const params = new TRTCParams({
        sdkAppId: SDKAPPID,
        userId,
        userSig,
        roomId: 2366,
        role: TRTCCloudDef.TRTCRoleAudience,
      });
      trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_LIVE);
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
      // trtcCloud.connectOtherRoom();
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
      // trtcCloud.switchRoom();
    },
  },
  {
    title: 'startPublishing',
    handler: async () => {
      // trtcCloud.startPublishing();
    },
  },
  /*
  {
    title: "stopPublishing",
    handler: async () => {
        trtcCloud.stopPublishing();
    }
  },
  {
    title: "startPublishCDNStream",
    handler: async () => {
        trtcCloud.startPublishCDNStream();
    }
  },
  {
    title: "stopPublishCDNStream",
    handler: async () => {
        trtcCloud.stopPublishCDNStream();
    }
  },
  {
    title: "setMixTranscodingConfig",
    handler: async () => {
        trtcCloud.setMixTranscodingConfig();
    }
  },
  {
    title: "muteLocalVideo",
    handler: async () => {
        trtcCloud.muteLocalVideo();
    }
  },
  {
    title: "setVideoMuteImage",
    handler: async () => {
        trtcCloud.setVideoMuteImage();
    }
  },
  {
    title: "startRemoteView",
    handler: async () => {
        trtcCloud.startRemoteView();
    }
  },
  {
    title: "stopRemoteView",
    handler: async () => {
        trtcCloud.stopRemoteView();
    }
  },
  {
    title: "stopAllRemoteView",
    handler: async () => {
        trtcCloud.stopAllRemoteView();
    }
  },
  {
    title: "muteRemoteVideoStream",
    handler: async () => {
        trtcCloud.muteRemoteVideoStream();
    }
  },
  {
    title: "muteAllRemoteVideoStreams",
    handler: async () => {
        trtcCloud.muteAllRemoteVideoStreams();
    }
  },
  {
    title: "setVideoEncoderParam",
    handler: async () => {
        trtcCloud.setVideoEncoderParam();
    }
  },
  {
    title: "setNetworkQosParam",
    handler: async () => {
        trtcCloud.setNetworkQosParam();
    }
  },
  {
    title: "setLocalRenderParams",
    handler: async () => {
        trtcCloud.setLocalRenderParams();
    }
  },
  {
    title: "setRemoteRenderParams",
    handler: async () => {
        trtcCloud.setRemoteRenderParams();
    }
  },
  {
    title: "setVideoEncoderRotation",
    handler: async () => {
        trtcCloud.setVideoEncoderRotation();
    }
  },
  {
    title: "setVideoEncoderMirror",
    handler: async () => {
        trtcCloud.setVideoEncoderMirror();
    }
  },
  {
    title: "setGSensorMode",
    handler: async () => {
        trtcCloud.setGSensorMode();
    }
  },
  {
    title: "enableEncSmallVideoStream",
    handler: async () => {
        trtcCloud.enableEncSmallVideoStream();
    }
  },
  {
    title: "setRemoteVideoStreamType",
    handler: async () => {
        trtcCloud.setRemoteVideoStreamType();
    }
  },
  {
    title: "snapshotVideo",
    handler: async () => {
        trtcCloud.snapshotVideo();
    }
  },
  */
  {
    title: 'startLocalAudio',
    handler: async () => {
      trtcCloud.startLocalAudio(100);
    },
  },
  {
    title: 'stopLocalAudio',
    handler: async () => {
      trtcCloud.stopLocalAudio();
    },
  },
  {
    title: 'muteLocalAudio',
    handler: async () => {
      trtcCloud.muteLocalAudio(true);
    },
  },
  {
    title: 'muteRemoteAudio',
    handler: async () => {
      trtcCloud.muteRemoteAudio('lexuslin3', true);
    },
  },
  {
    title: 'muteAllRemoteAudio',
    handler: async () => {
      trtcCloud.muteAllRemoteAudio(true);
    },
  },
  {
    title: 'setRemoteAudioVolume',
    handler: async () => {
      trtcCloud.setRemoteAudioVolume('lexuslin3', 80);
    },
  },
  {
    title: 'setAudioCaptureVolume',
    handler: async () => {
      trtcCloud.setAudioCaptureVolume(80);
    },
  },
  {
    title: 'getAudioCaptureVolume',
    handler: async () => {
      trtcCloud.getAudioCaptureVolume();
    },
  },
  {
    title: 'setAudioPlayoutVolume',
    handler: async () => {
      trtcCloud.setAudioPlayoutVolume(80);
    },
  },
  {
    title: 'getAudioPlayoutVolume',
    handler: async () => {
      trtcCloud.getAudioPlayoutVolume();
    },
  },
  {
    title: 'enableAudioVolumeEvaluation',
    handler: async () => {
      trtcCloud.enableAudioVolumeEvaluation(300);
    },
  },
  {
    title: 'startAudioRecording',
    handler: async () => {
      // trtcCloud.startAudioRecording();
    },
  },
  {
    title: 'stopAudioRecording',
    handler: async () => {
      trtcCloud.stopAudioRecording();
    },
  },
  /*
  {
    title: "setWatermarkstartScreenCapture",
    handler: async () => {
        trtcCloud.setWatermarkstartScreenCapture();
    }
  },
  {
    title: "stopScreenCapture",
    handler: async () => {
        trtcCloud.stopScreenCapture();
    }
  },
  {
    title: "pauseScreenCapture",
    handler: async () => {
        trtcCloud.pauseScreenCapture();
    }
  },
  {
    title: "resumeScreenCapture",
    handler: async () => {
        trtcCloud.resumeScreenCapture();
    }
  },
  */
  {
    title: 'sendCustomCmdMsg',
    handler: async () => {
      // trtcCloud.sendCustomCmdMsg();
    },
  },
  {
    title: 'sendSEIMsg',
    handler: async () => {
      // trtcCloud.sendSEIMsg();
    },
  },
  {
    title: 'startSpeedTest',
    handler: async () => {
      // trtcCloud.startSpeedTest();
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
      // trtcCloud.callExperimentalAPI();
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
    title: 'setVoiceCaptureVolume',
    handler: async () => {
      txAudioManager.setVoiceCaptureVolume(80);
    },
  },
  {
    title: 'startPlayMusic',
    handler: async () => {
      // txAudioManager.startPlayMusic();
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
      txAudioManager.getMusicCurrentPosInMS(1001);
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
      txAudioManager.getMusicDurationInMS('');
    },
  },

  // andio menager end
  // device manager begin
  {
    title: 'isFrontCamera',
    handler: async () => {
      const res = await txDeviceManager.isFrontCamera();
      Alert.alert(res.toString());
    },
  },
  {
    title: 'switchCamera',
    handler: async () => {
      txDeviceManager.switchCamera(true);
    },
  },
  {
    title: 'getCameraZoomMaxRatio',
    handler: async () => {
      txDeviceManager.getCameraZoomMaxRatio();
    },
  },
  {
    title: 'setCameraZoomRatio',
    handler: async () => {
      txDeviceManager.setCameraZoomRatio(2);
    },
  },
  {
    title: 'enableCameraAutoFocus',
    handler: async () => {
      txDeviceManager.enableCameraAutoFocus(true);
    },
  },
  {
    title: 'isAutoFocusEnabled',
    handler: async () => {
      txDeviceManager.isAutoFocusEnabled();
    },
  },
  {
    title: 'setCameraFocusPosition',
    handler: async () => {
      txDeviceManager.setCameraFocusPosition(100, 100);
    },
  },
  {
    title: 'enableCameraTorch',
    handler: async () => {
      txDeviceManager.enableCameraTorch(true);
    },
  },
  {
    title: 'setSystemVolumeType',
    handler: async () => {
      txDeviceManager.setSystemVolumeType(
        TRTCCloudDef.TRTCSystemVolumeTypeAuto
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
