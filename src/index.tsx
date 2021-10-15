import { NativeModules } from 'react-native';
import type {
  TRTCParams,
  TRTCSwitchRoomConfig,
  TRTCVideoEncParam,
  TRTCNetworkQosParam,
  TRTCRenderParams,
  TRTCMixUser,
  TRTCTranscodingConfig,
  AudioMusicParam,
  TRTCAudioRecordingParams,
  TRTCPublishCDNParam,
  CustomLocalRender,
  CustomRemoteRender,
  TRTCCloudDef,
  TXVoiceChangerType,
  TXVoiceReverbType
} from './trtc_cloud_def';

type TrtcReactNativeSdkType = {
  multiply(a: number, b: number): Promise<number>; 
  test(): Promise<string>;
  invokeMethod(method: string, _arguments: any): Promise<string>;
  getSDKVersion(): Promise<string>;
  enterRoom(params: TRTCParams, scene: number): Promise<number>;
};

const { TrtcReactNativeSdk } = NativeModules; 

export default TrtcReactNativeSdk as TrtcReactNativeSdkType;