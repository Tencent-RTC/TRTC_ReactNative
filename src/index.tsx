import { NativeModules, NativeEventEmitter } from 'react-native';
import { TRTCParams } from './trtc_cloud_def';
import TXAudioEffectManager from './tx_audio_effect_manager';
import TXDeviceManager from './tx_device_manager';
const { TrtcReactNativeSdk } = NativeModules;
const TRTCEventEmitter = new NativeEventEmitter(TrtcReactNativeSdk);

export default class TRTCCloud {
  private _listeners: Map<any, any>;
  static _trtcCloud: TRTCCloud | undefined;
  constructor() {
    this._listeners = new Map();
  }
  /// 创建 TRTCCloud 单例。
  static sharedInstance() {
    if (!this._trtcCloud) {
      this._trtcCloud = new TRTCCloud();
      TrtcReactNativeSdk.sharedInstance();
    }
    return this._trtcCloud;
  }

  /// 销毁 TRTCCloud 单例。
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
  registerListener(event: any, listener: any) {
    const callback = (res: any) => {
      listener(res);
    };
    let map = this._listeners.get(event);
    if (map === undefined) {
      map = new Map();
      this._listeners.set(event, map);
    }
    TRTCEventEmitter.addListener(event, callback);
    map.set(listener, callback);
    return {
      remove: () => {
        this.unRegisterListener(event, listener);
      },
    };
  }

  /**
   * 移除事件
   * @param event
   * @param listener
   */
  unRegisterListener(event: any, listener: any) {
    const map = this._listeners.get(event);
    if (map === undefined) return;
    TRTCEventEmitter.removeListener(event, map.get(listener));
    map.delete(listener);
  }

  /**
   * 移除所有事件
   * @param event
   */
  unRegisterAllListener(event: any) {
    if (event === undefined) {
      this._listeners.forEach((key) => {
        TRTCEventEmitter.removeAllListeners(key);
      });
      this._listeners.clear();
      return;
    }
    TRTCEventEmitter.removeAllListeners(event);
    this._listeners.delete(event);
  }

  static invokeMethod(method: string, scene: number) {
    return TrtcReactNativeSdk.invokeMethod(method, scene);
  }

  /// 进入房间
  ///
  /// 调用接口后，您会收到来自 TRTCCloudListener 中的 onEnterRoom(result) 回调：
  ///
  /// 如果加入成功，result 会是一个正数（result > 0），表示加入房间所消耗的时间，单位是毫秒（ms）。
  ///
  /// 如果加入失败，result 会是一个负数（result < 0），表示进房失败的错误码。
  ///
  /// 参数：
  ///
  /// param	进房参数，请参考 trtc_cloud_def.dart文件中的TRTCParams参数定义
  ///
  /// scene	应用场景，目前支持视频通话（VideoCall）、在线直播（Live）、语音通话（AudioCall）、语音聊天室（VoiceChatRoom）四种场景。
  ///
  /// 注意：
  ///
  /// 1.当 scene 选择为 TRTC_APP_SCENE_LIVE 或 TRTC_APP_SCENE_VOICE_CHATROOM 时，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。
  ///
  /// 2.不管进房是否成功，enterRoom 都必须与 exitRoom 配对使用，在调用 exitRoom 前再次调用 enterRoom 函数会导致不可预期的错误问题。
  enterRoom(params: TRTCParams, scene: number): Promise<void> {
    return TrtcReactNativeSdk.enterRoom(params, scene);
  }

  /// 离开房间。
  ///
  /// 调用 exitRoom() 接口会执行退出房间的相关逻辑，例如释放音视频设备资源和编解码器资源等。 待资源释放完毕，SDK 会通过 onExitRoom() 回调通知到您。
  ///
  /// 如果您要再次调用 enterRoom() 或者切换到其他的音视频 SDK，请等待 onExitRoom() 回调到来之后再执行相关操作。 否则可能会遇到摄像头或麦克风被占用等各种异常问题，例如常见的 Android 媒体音量和通话音量切换问题等等。
  exitRoom(): Promise<void> {
    return TrtcReactNativeSdk.exitRoom();
  }

  /// 获取音效管理类 TXAudioEffectManager。
  getAudioEffectManager(): TXAudioEffectManager {
    TrtcReactNativeSdk.getAudioEffectManager();
    return new TXAudioEffectManager();
  }

  /// 获取设备管理模块。
  getDeviceManager(): TXDeviceManager {
    TrtcReactNativeSdk.getDeviceManager();
    return new TXDeviceManager();
  }

  getSDKVersion(): Promise<string> {
    return TrtcReactNativeSdk.getSDKVersion();
  }
}
export { TRTCParams };
