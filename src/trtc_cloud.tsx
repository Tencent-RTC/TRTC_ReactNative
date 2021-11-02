import { NativeModules, NativeEventEmitter, Platform } from 'react-native';
import TXAudioEffectManager from './tx_audio_effect_manager';
import TXDeviceManager from './tx_device_manager';
import { TRTCCloudListener } from './trtc_cloud_listener';
import {
  TRTCParams,
  TRTCSwitchRoomConfig,
  AudioMusicParam,
  TRTCAudioRecordingParams,
  TRTCPublishCDNParam,
  TRTCCloudDef,
  TXVoiceChangerType,
  TXVoiceReverbType,
  TXSystemVolumeType,
} from './trtc_cloud_def';
import TXVideoView from './tx_video_view';
const { TrtcReactNativeSdk } = NativeModules;
const TRTCEventEmitter = new NativeEventEmitter(TrtcReactNativeSdk);

export default class TRTCCloud {
  static _trtcCloud: TRTCCloud | undefined;
  constructor() {}
  /**
  创建 TRTCCloud 单例。
  */
  static sharedInstance() {
    if (!this._trtcCloud) {
      this._trtcCloud = new TRTCCloud();
      TrtcReactNativeSdk.sharedInstance();
    }
    return this._trtcCloud;
  }
  /**
  销毁 TRTCCloud 单例。
  */
  static destroySharedInstance() {
    this._trtcCloud = undefined;
    TrtcReactNativeSdk.destroySharedInstance();
  }

  /**
   * 添加事件
   * @param event
   * @param listener
   * @returns {{remove: remove}}
   */
  registerListener(listener: { (type: TRTCCloudListener, params: any): void }) {
    TRTCEventEmitter.addListener('onListener', (args) => {
      let params;
      if (Platform.OS === 'android') {
        try {
          params = JSON.parse(args.params);
        } catch (e) {
          console.log(e);
        }
      } else {
        params = args.params;
      }
      listener(args.type, params);
    });
  }

  /**
   * 移除事件
   * @param event
   * @param listener
   */
  unRegisterListener(listener: {
    (type: TRTCCloudListener, params: any): void;
  }) {
    TRTCEventEmitter.removeListener('onListener', listener);
  }
  /**
  - 进入房间
  - 调用接口后，您会收到来自 TRTCCloudListener 中的 onEnterRoom(result) 回调：
  - 如果加入成功，result 会是一个正数（result > 0），表示加入房间所消耗的时间，单位是毫秒（ms）。
  - 如果加入失败，result 会是一个负数（result < 0），表示进房失败的错误码。
  @param param	进房参数，请参考 trtc_cloud_def.dart文件中的TRTCParams参数定义
  @param scene	应用场景，目前支持视频通话（VideoCall）、在线直播（Live）、语音通话（AudioCall）、语音聊天室（VoiceChatRoom）四种场景。
  - 注意：
  - 1.当 scene 选择为 TRTC_APP_SCENE_LIVE 或 TRTC_APP_SCENE_VOICE_CHATROOM 时，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。
  - 2.不管进房是否成功，enterRoom 都必须与 exitRoom 配对使用，在调用 exitRoom 前再次调用 enterRoom 函数会导致不可预期的错误问题。
  */
  enterRoom(params: TRTCParams, scene: number): Promise<void> {
    if (Platform.OS === 'android') {
      return TrtcReactNativeSdk.enterRoom(
        {
          sdkAppId: params.sdkAppId,
          userId: params.userId,
          userSig: params.userSig,
          roomId: params.roomId!.toString(),
          strRoomId: params.strRoomId,
          role: params.role,
          streamId: params.streamId,
          userDefineRecordId: params.userDefineRecordId,
          privateMapKey: params.privateMapKey,
          businessInfo: params.businessInfo,
          scene: scene,
        },
        scene
      );
    }
    return TrtcReactNativeSdk.enterRoom(params, scene);
  }
  /**
  - 离开房间。
  - 调用 exitRoom() 接口会执行退出房间的相关逻辑，例如释放音视频设备资源和编解码器资源等。 待资源释放完毕，SDK 会通过 onExitRoom() 回调通知到您。
  - 如果您要再次调用 enterRoom() 或者切换到其他的音视频 SDK，请等待 onExitRoom() 回调到来之后再执行相关操作。 否则可能会遇到摄像头或麦克风被占用等各种异常问题，例如常见的 Android 媒体音量和通话音量切换问题等等。
  */
  exitRoom(): Promise<void> {
    return TrtcReactNativeSdk.exitRoom();
  }
  /**
  - 获取音效管理类 TXAudioEffectManager。
  @return TXAudioEffectManager
  */
  getAudioEffectManager(): TXAudioEffectManager {
    TrtcReactNativeSdk.getAudioEffectManager();
    return new TXAudioEffectManager();
  }
  /**
  - 获取设备管理模块。
  @return TXDeviceManager
  */
  getDeviceManager(): TXDeviceManager {
    TrtcReactNativeSdk.getDeviceManager();
    return new TXDeviceManager();
  }

  getSDKVersion(): Promise<string> {
    return TrtcReactNativeSdk.getSDKVersion();
  }
  /**
  - 请求跨房通话（主播 PK）
  - TRTC 中两个不同音视频房间中的主播，可以通过“跨房通话”功能拉通连麦通话功能。使用此功能时， 两个主播无需退出各自原来的直播间即可进行“连麦 PK”。
  - 例如：当房间“001”中的主播 A 通过 connectOtherRoom() 跟房间“002”中的主播 B 拉通跨房通话后， 房间“001”中的用户都会收到主播 B 的 onRemoteUserEnterRoom(B) 回调和 onUserVideoAvailable(B,true) 回调。 房间“002”中的用户都会收到主播 A 的 onRemoteUserEnterRoom(A) 回调和 onUserVideoAvailable(A,true) 回调。
  - 简言之，跨房通话的本质，就是把两个不同房间中的主播相互分享，让每个房间里的观众都能看到两个主播。
  - 跨房通话的参数考虑到后续扩展字段的兼容性问题，暂时采用了 JSON 格式的参数，要求至少包含两个字段：
  - roomId：房间“001”中的主播 A 要跟房间“002”中的主播 B 连麦，主播 A 调用 ConnectOtherRoom() 时 roomId 应指定为“002”。
  - userId：房间“001”中的主播 A 要跟房间“002”中的主播 B 连麦，主播 A 调用 ConnectOtherRoom() 时 userId 应指定为 B 的 userId。
  - 跨房通话的请求结果会通过 onConnectOtherRoom() 回调通知给您。
  - 调用示例：
  - var object = new Map();
  - object['roomId'] = 155;
  - object['userId'] = '57890';
  - trtcCloud.connectOtherRoom(jsonEncode(object));
  @param param	JSON 字符串连麦参数，roomId 代表目标房间号，userId 代表目标用户 ID。
  */
  connectOtherRoom(param: string): Promise<void> {
    return TrtcReactNativeSdk.connectOtherRoom({
      param: param,
    });
  }
  /**
  - 退出跨房通话
  - 跨房通话的退出结果会通过onDisconnectOtherRoom 回调通知给您。
  */
  disconnectOtherRoom(): Promise<void> {
    return TrtcReactNativeSdk.disconnectOtherRoom();
  }
  /**
  - 切换角色，仅适用于直播场景（TRTC_APP_SCENE_LIVE 和 TRTC_APP_SCENE_VOICE_CHATROOM）。
  - 在直播场景下，一个用户可能需要在“观众”和“主播”之间来回切换。 您可以在进房前通过 TRTCParams 中的 role 字段确定角色，也可以通过 switchRole 在进房后切换角色。
  @param role	目标角色，默认为主播：TRTCCloudDef.TRTCRoleAnchor 主播，可以上行视频和音频，一个房间里最多支持50个主播同时上行音视频。TRTCCloudDef.TRTCRoleAudience 观众，只能观看，不能上行视频和音频，一个房间里的观众人数没有上限。
  */
  switchRole(role: number): Promise<void> {
    return TrtcReactNativeSdk.switchRole({
      role: role,
    });
  }
  /**
  - 设置音视频数据接收模式（需要在进房前设置才能生效）。
  - 为实现进房秒开的绝佳体验，SDK 默认进房后自动接收音视频。即在您进房成功的同时，您将立刻收到远端所有用户的音视频数据。 若您没有调用 startRemoteView，视频数据将自动超时取消。 若您主要用于语音聊天等没有自动接收视频数据需求的场景，您可以根据实际需求选择接收模式。
  @param autoRecvAudio	true：自动接收音频数据；false：需要调用 muteRemoteAudio 进行请求或取消。默认值：true。autoRecvVideo	true：自动接收视频数据；false：需要调用 startRemoteView/stopRemoteView 进行请求或取消。默认值：true。注意：需要在进房前设置才能生效。
  */
  setDefaultStreamRecvMode(
    autoRecvAudio: boolean,
    autoRecvVideo: boolean
  ): Promise<void> {
    return TrtcReactNativeSdk.setDefaultStreamRecvMode({
      autoRecvAudio: autoRecvAudio,
      autoRecvVideo: autoRecvVideo,
    });
  }
  /**
  - 切换房间
  - 调用接口后，会退出原来的房间，并且停止原来房间的音视频数据发送和所有远端用户的音视频播放，但不会停止本地视频的预览。 进入新房间成功后，会自动恢复原来的音视频数据发送状态。
  - 接口调用结果会通过onSwitchRoom(errCode, errMsg) 回调。
  */
  switchRoom(config: TRTCSwitchRoomConfig): Promise<void> {
    return TrtcReactNativeSdk.switchRoom({
      config: JSON.stringify(config),
    });
  }
  /**
  - 开始向腾讯云的直播 CDN 推流
  - 该接口会指定当前用户的音视频流在腾讯云 CDN 所对应的 StreamId，进而可以指定当前用户的 CDN 播放地址。
  - 例如：如果我们采用如下代码设置当前用户的主画面 StreamId 为 user_stream_001，那么该用户主画面对应的 CDN 播放地址为： “http://yourdomain/live/user_stream_001.flv”，其中 yourdomain 为您自己备案的播放域名， 您可以在[直播控制台](https://console.cloud.tencent.com/live) 配置您的播放域名，腾讯云不提供默认的播放域名。
  - 您也可以在设置 enterRoom 的参数 TRTCParams 时指定 streamId, 而且我们更推荐您采用这种方案。
  @param streamId	自定义流 ID。
  @param streamType	仅支持 TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG 和 TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB。
  - 注意：
  - 您需要先在实时音视频 [控制台](https://console.cloud.tencent.com/trtc) 中的功能配置页开启“启用旁路推流”才能生效。
  - *若您选择“指定流旁路”，则您可以通过该接口将对应音视频流推送到腾讯云 CDN 且指定为填写的流 ID。
  - *若您选择“全局自动旁路”，则您可以通过该接口调整默认的流 ID。
  */
  startPublishing(streamId: string, streamType: number): Promise<void> {
    return TrtcReactNativeSdk.startPublishing({
      streamId: streamId,
      streamType: streamType,
    });
  }
  /**
  停止向腾讯云的直播 CDN 推流
  */
  stopPublishing(): Promise<void> {
    return TrtcReactNativeSdk.stopPublishing();
  }
  /**
  - 开始向友商云的直播 CDN 转推
  - 该接口跟 startPublishing() 类似，但 startPublishCDNStream() 支持向非腾讯云的直播 CDN 转推。
  - @param	CDN 转推参数，请参考 TRTCPublishCDNParam
  - 注意：
  - 使用 startPublishing() 绑定腾讯云直播 CDN 不收取额外的费用，但使用 startPublishCDNStream() 绑定非腾讯云直播 CDN 需要收取转推费用。
  */
  startPublishCDNStream(param: TRTCPublishCDNParam): Promise<void> {
    return TrtcReactNativeSdk.startPublishCDNStream({
      param: JSON.stringify(param),
    });
  }
  /**
  停止向非腾讯云地址转推
  */
  stopPublishCDNStream(): Promise<void> {
    return TrtcReactNativeSdk.stopPublishCDNStream();
  }
  /**
  - 开启本地音频的采集和上行,并设置音频质量。
  - 该函数会启动麦克风采集，并将音频数据传输给房间里的其他用户。 SDK 不会默认开启本地音频采集和上行，您需要调用该函数开启，否则房间里的其他用户将无法听到您的声音。
  - 主播端的音质越高，观众端的听感越好，但传输所依赖的带宽也就越高，在带宽有限的场景下也更容易出现卡顿。
  */
  startLocalAudio(quality: number): Promise<void> {
    return TrtcReactNativeSdk.startLocalAudio({ quality: quality });
  }
  /**
  - 关闭本地音频的采集和上行。
  - 当关闭本地音频的采集和上行，房间里的其它成员会收到 onUserAudioAvailable(false) 回调通知。
  */
  stopLocalAudio(): Promise<void> {
    return TrtcReactNativeSdk.stopLocalAudio();
  }
  /**
  - 静音/取消静音本地的音频。
  - 当静音本地音频后，房间里的其它成员会收到 onUserAudioAvailable(userId, false) 回调通知。 当取消静音本地音频后，房间里的其它成员会收到 onUserAudioAvailable(userId, true) 回调通知。
  - 与 stopLocalAudio 不同之处在于，muteLocalAudio(true) 并不会停止发送音视频数据，而是继续发送码率极低的静音包。 由于 MP4 等视频文件格式，对于音频的连续性是要求很高的，使用 stopLocalAudio 会导致录制出的 MP4 不易播放。 因此在对录制质量要求很高的场景中，建议选择 muteLocalAudio，从而录制出兼容性更好的 MP4 文件。
  @param mute	true：静音；false：取消静音
  */
  muteLocalAudio(mute: boolean): Promise<void> {
    return TrtcReactNativeSdk.muteLocalAudio({
      mute: mute,
    });
  }
  /**
  - 静音/取消静音指定的远端用户的声音。
  @param userId	对方的用户 ID
  @param mute	true：静音；false：取消静音
  - 注意：静音时会停止接收该用户的远端音频流并停止播放，取消静音时会自动拉取该用户的远端音频流并进行播放。
  */
  muteRemoteAudio(userId: string, mute: boolean): Promise<void> {
    return TrtcReactNativeSdk.muteRemoteAudio({
      userId: userId,
      mute: mute,
    });
  }
  /**
  - 静音/取消静音所有用户的声音。
  @param mute	true：静音；false：取消静音
  - 注意：静音时会停止接收所有用户的远端音频流并停止播放，取消静音时会自动拉取所有用户的远端音频流并进行播放。
  */
  muteAllRemoteAudio(mute: boolean): Promise<void> {
    return TrtcReactNativeSdk.muteAllRemoteAudio({
      mute: mute,
    });
  }
  /**
  - 设置某个远程用户的播放音量
  @param userId	远程用户 ID
  - volume	音量大小，取值0 - 100
  */
  setRemoteAudioVolume(userId: string, volume: number): Promise<void> {
    return TrtcReactNativeSdk.setRemoteAudioVolume({
      userId: userId,
      volume: volume,
    });
  }
  /**
  - 设置 SDK 采集音量。
  @param volume	音量大小，取值0 - 100
  */
  setAudioCaptureVolume(volume: number): Promise<void> {
    return TrtcReactNativeSdk.setAudioCaptureVolume({
      volume: volume,
    });
  }
  /**
  获取 SDK 采集音量。
  */
  getAudioCaptureVolume(): Promise<number> {
    return TrtcReactNativeSdk.getAudioCaptureVolume();
  }
  /**
  - 设置 SDK 播放音量。
  - 该函数会控制最终交给系统播放的声音音量，会影响录制本地音频文件的音量大小，但不会影响耳返的音量。
  @param volume	音量大小，取值0 - 100
  */
  setAudioPlayoutVolume(volume: number): Promise<void> {
    return TrtcReactNativeSdk.setAudioPlayoutVolume({
      volume: volume,
    });
  }
  /**
  获取 SDK 播放音量
  */
  getAudioPlayoutVolume(): Promise<number> {
    return TrtcReactNativeSdk.getAudioPlayoutVolume();
  }
  /**
  - 启用音量大小提示。
  - 开启后会在 onUserVoiceVolume 中获取到 SDK 对音量大小值的评估。如需打开此功能，请在 startLocalAudio() 之前调用。
  @param intervalMs	决定了 onUserVoiceVolume 回调的触发间隔，单位为ms，最小间隔为100ms，如果小于等于0则会关闭回调，建议设置为300ms；详细的回调规则请参考 onUserVoiceVolume 的注释说明
  */
  enableAudioVolumeEvaluation(intervalMs: number): Promise<void> {
    return TrtcReactNativeSdk.enableAudioVolumeEvaluation({
      intervalMs: intervalMs,
    });
  }
  /**
  - 开始录音。
  - 该方法调用后， SDK 会将通话过程中的所有音频（包括本地音频，远端音频，BGM 等）录制到一个文件里。 无论是否进房，调用该接口都生效。 如果调用 exitRoom 时还在录音，录音会自动停止。
  @param TRTCAudioRecordingParams	录音参数
  @return 0：成功；-1：录音已开始；-2：文件或目录创建失败；-3：后缀指定的音频格式不支持; -1001:参数错误
  */
  startAudioRecording(param: TRTCAudioRecordingParams): Promise<number> {
    return TrtcReactNativeSdk.startAudioRecording({
      param: param,
    });
  }
  /**
  - 停止录音。
  - 如果调用 exitRoom 时还在录音，录音会自动停止。
  */
  stopAudioRecording(): Promise<void> {
    return TrtcReactNativeSdk.stopAudioRecording();
  }
  /**
  - 开始进行网络测速（视频通话期间请勿测试，以免影响通话质量）
  - 测速结果将会用于优化 SDK 接下来的服务器选择策略，因此推荐您在用户首次通话前先进行一次测速，这将有助于我们选择最佳的服务器。 同时，如果测试结果非常不理想，您可以通过醒目的 UI 提示用户选择更好的网络。 测试结果通过 TRTCCloudListener.onSpeedTest 回调出来。
  - 注意：测速本身会消耗一定的流量，所以也会产生少量额外的流量费用。
  @param sdkAppId	应用标识
  @param userId	用户标识
  @param userSig	用户签名
  */
  startSpeedTest(
    sdkAppId: number,
    userId: string,
    userSig: string
  ): Promise<void> {
    return TrtcReactNativeSdk.startSpeedTest({
      sdkAppId: sdkAppId,
      userId: userId,
      userSig: userSig,
    });
  }
  /**
  停止服务器测速。
  */
  stopSpeedTest(): Promise<void> {
    return TrtcReactNativeSdk.stopSpeedTest();
  }
  /**
  - 设置 Log 输出级别
  @param level	请参见 TRTC_LOG_LEVEL，默认值：TRTCCloudDef.TRTC_LOG_LEVEL_NULL
  */
  setLogLevel(level: number): Promise<void> {
    return TrtcReactNativeSdk.setLogLevel({ level: level });
  }
  /**
  - 启用或禁用控制台日志打印
  @param enabled	指定是否启用，默认为禁止状态
  */
  setConsoleEnabled(enabled: boolean): Promise<void> {
    return TrtcReactNativeSdk.setConsoleEnabled({
      enabled: enabled,
    });
  }
  /**
  - 启用或禁用 Log 的本地压缩。
  - 开启压缩后，log　存储体积明显减小，但需要腾讯云提供的 Python 脚本解压后才能阅读。 禁用压缩后，log　采用明文存储，可以直接用记事本打开阅读，但占用空间较大。
  @param enabled	指定是否启用，默认为启用状态
  */
  setLogCompressEnabled(enabled: boolean): Promise<void> {
    return TrtcReactNativeSdk.setLogCompressEnabled({
      enabled: enabled,
    });
  }
  /**
  - 修改日志保存路径
  - 日志文件默认保存在 /app私有目录/files/log/tencent/liteav/ 下，如需修改, 必须在所有方法前调用，并且保证目录存在及应用有目录的读写权限。
  @param path 存储日志路径
  */
  setLogDirPath(path: string): Promise<void> {
    return TrtcReactNativeSdk.setLogDirPath({
      path: path,
    });
  }
  /**
  - 调用实验性 API 接口
  - 注意：该接口用于调用一些实验性功能
  @param jsonStr	接口及参数描述的 JSON 字符串
  */
  callExperimentalAPI(jsonStr: string): Promise<void> {
    return TrtcReactNativeSdk.callExperimentalAPI({
      jsonStr: jsonStr,
    });
  }
}
export {
  TXVideoView,
  TRTCParams,
  TRTCCloudDef,
  TXVoiceChangerType,
  TXVoiceReverbType,
  TRTCCloudListener,
  TRTCSwitchRoomConfig,
  TRTCPublishCDNParam,
  TRTCAudioRecordingParams,
  AudioMusicParam,
  TXSystemVolumeType,
};
