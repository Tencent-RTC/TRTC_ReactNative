import { NativeModules } from 'react-native';
import type {
  // TRTCParams,
  // TRTCCloudDef,
  // TRTCSwitchRoomConfig,
  // TRTCVideoEncParam,
  // TRTCNetworkQosParam,
  // TRTCRenderParams,
  // TRTCMixUser,
  // TRTCTranscodingConfig,
  TXVoiceChangerType,
  TXVoiceReverbType,
  AudioMusicParam,
  // TRTCAudioRecordingParams,
  // TRTCPublishCDNParam,
  // CustomLocalRender,
  // CustomRemoteRender,
} from './trtc_cloud_def';
const { TrtcReactNativeSdk } = NativeModules;

/// 腾讯云视频通话功能音乐和人声设置接口
export default class TXAudioEffectManager {
  constructor() {}

  /// 开启耳返
  ///
  /// 开启后会在耳机里听到自己的声音。
  ///
  /// 注意：仅在戴耳机时有效，暂时仅支持部分采集延迟较低的机型
  ///
  /// 参数：
  ///
  /// enable	true：开启；false：关闭
  enableVoiceEarMonitor(enable: boolean): Promise<void> {
    return TrtcReactNativeSdk.enableVoiceEarMonitor({ enable });
  }

  /// 设置耳返音量。
  ///
  /// 参数：
  ///
  /// volume	音量大小，取值0 - 100，默认值为100
  setVoiceEarMonitorVolume(volume: number): Promise<void> {
    return TrtcReactNativeSdk.enableVoiceEarMonitor({ volume });
  }

  /// 设置人声的混响效果（KTV、小房间、大会堂、低沉、洪亮...）
  ///
  /// 参数：
  ///
  /// 默认为TXVoiceReverbType.TXLiveVoiceReverbType_0，详情见trtc_cloud.def文件中TXVoiceReverbType参数定义
  setVoiceReverbType(type: TXVoiceReverbType): Promise<void> {
    return TrtcReactNativeSdk.setVoiceReverbType({ type });
  }

  /// 设置人声的变声特效（萝莉、大叔、重金属、外国人...）
  ///
  /// 参数：
  ///
  /// 默认为TXVoiceChangerType.TXLiveVoiceChangerType_0,详情见trtc_cloud.def文件中TXVoiceChangerType参数定义
  setVoiceChangerType(type: TXVoiceChangerType): Promise<void> {
    return TrtcReactNativeSdk.setVoiceChangerType({ type });
  }

  /// 设置麦克风采集人声的音量
  ///
  /// 参数：
  ///
  /// volume	音量大小，1为正常音量，范围是：[0 ~ 100] 之间的浮点数
  setVoiceCaptureVolume(volume: number): Promise<void> {
    return TrtcReactNativeSdk.setVoiceCaptureVolume(volume);
  }

  /// 开始播放背景音乐
  ///
  /// 每个音乐都需要您指定具体的 ID，您可以通过该 ID 对音乐的开始、停止、音量等进行设置。
  ///
  /// 注意：若您想同时播放多个音乐，请分配不同的 ID 进行播放。 如果使用同一个 ID 播放不同音乐，SDK 会先停止播放旧的音乐，再播放新的音乐。
  ///
  /// 参数：
  /// musicParam	音乐参数，详情见trtc_cloud.dart中AudioMusicParam参数定义
  ///
  /// 返回：
  ///
  /// true: 成功; false: 失败
  startPlayMusic(musicParam: AudioMusicParam): Promise<void> {
    return TrtcReactNativeSdk.startPlayMusic(musicParam);
  }

  /// 停止播放背景音乐
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  stopPlayMusic(id: number): Promise<void> {
    return TrtcReactNativeSdk.stopPlayMusic({ id: id });
  }

  /// 暂停播放背景音乐
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  pausePlayMusic(id: number): Promise<void> {
    return TrtcReactNativeSdk.pausePlayMusic({ id: id });
  }

  /// 恢复播放背景音乐
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  resumePlayMusic(id: number): Promise<void> {
    return TrtcReactNativeSdk.resumePlayMusic({ id: id });
  }

  /// 设置背景音乐的远端音量大小，即主播可以通过此接口设置远端观众能听到的背景音乐的音量大小。
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  ///
  /// volume	音量大小，100为正常音量，取值范围为0 - 100；默认值：100
  setMusicPublishVolume(id: number, volume: number): Promise<void> {
    return TrtcReactNativeSdk.setMusicPublishVolume({ id: id, volume: volume });
  }

  /// 设置背景音乐的本地音量大小，即主播可以通过此接口设置主播自己本地的背景音乐的音量大小。
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  ///
  /// volume	音量大小，100为正常音量，取值范围为0 - 100；默认值：100
  setMusicPlayoutVolume(id: number, volume: number): Promise<void> {
    return TrtcReactNativeSdk.setMusicPublishVolume({ id: id, volume: volume });
  }

  /// 设置全局背景音乐的本地和远端音量的大小
  ///
  /// 参数：
  ///
  /// volume	音量大小，100为正常音量，取值范围为0 - 100；默认值：100
  setAllMusicVolume(volume: number): Promise<void> {
    return TrtcReactNativeSdk.setAllMusicVolume({ volume: volume });
  }

  /// 调整背景音乐的音调高低
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  ///
  /// pitch	音调，默认值是0.0f，范围是：[-1 ~ 1] 之间的浮点数；
  setMusicPitch(id: number, pitch: number): Promise<void> {
    return TrtcReactNativeSdk.setMusicPitch({
      id: id,
      pitch: pitch.toString(),
    });
  }

  /// 调整背景音乐的变速效果
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  ///
  /// speedRate	速度，默认值是1.0f，范围是：[0.5 ~ 2] 之间的浮点数；
  setMusicSpeedRate(id: number, speedRate: number): Promise<void> {
    return TrtcReactNativeSdk.setMusicSpeedRate({
      id: id,
      speedRate: speedRate.toString(),
    });
  }

  /// 获取背景音乐当前的播放进度（单位：毫秒）
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  ///
  /// 返回：成功返回当前播放时间，单位：毫秒，失败返回-1
  getMusicCurrentPosInMS(id: number): Promise<number> {
    return TrtcReactNativeSdk.getMusicCurrentPosInMS({ id: id });
  }

  /// 设置背景音乐的播放进度（单位：毫秒）
  ///
  /// 注意：请尽量避免频繁地调用该接口，因为该接口可能会再次读写音乐文件，耗时稍高。 当配合进度条使用时，请在进度条拖动完毕的回调中调用，而避免在拖动过程中实时调用。
  ///
  /// 参数：
  ///
  /// id	音乐 ID
  ///
  /// pts	单位: 毫秒
  seekMusicToPosInMS(id: number, pts: number): Promise<void> {
    return TrtcReactNativeSdk.getMusicCurrentPosInMS({ id: id, pts: pts });
  }

  /// 获取景音乐文件的总时长（单位：毫秒）
  ///
  /// 参数：
  ///
  /// path	音乐文件路径，如果 path 为空，那么返回当前正在播放的 music 时长。
  ///
  /// 返回：成功返回时长，失败返回-1
  getMusicDurationInMS(path: string): Promise<number> {
    return TrtcReactNativeSdk.getMusicCurrentPosInMS({ path: path });
  }
}
