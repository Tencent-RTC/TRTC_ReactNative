import { NativeModules } from 'react-native';
const { TrtcReactNativeSdk } = NativeModules;

/// 设备管理
export default class TXDeviceManager {
  /// 是否使用前置摄像头
  ///
  /// 注意：此接口只支持和Android和iOS平台
  isFrontCamera(): Promise<boolean> {
    return TrtcReactNativeSdk.isFrontCamera();
  }
  /// 切换摄像头。
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 参数：
  ///
  /// isFrontCamera：true 前置摄像头
  ///
  /// isFrontCamera：false 后置摄像头

  switchCamera(isFrontCamera: boolean) : Promise<void> {
    return TrtcReactNativeSdk.switchCamera({ isFrontCamera });
  }

  /// 获取摄像头的缩放因子
  ///
  /// 注意：此接口只支持和Android和iOS平台
  getCameraZoomMaxRatio() : Promise<void> {
    return TrtcReactNativeSdk.getCameraZoomMaxRatio();
  }

  /// 设置摄像头缩放因子（焦距）。
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 取值范围1 - 5，取值为1表示最远视角（正常镜头），取值为5表示最近视角（放大镜头）。 最大值推荐为5，若超过5，视频数据会变得模糊不清。
  ///
  /// 参数：
  ///
  /// value	取值范围为1 - 5，数值越大，焦距越远
  ///
  /// 返回  0：操作成功 负数：失败
  setCameraZoomRatio(value: number) : Promise<void> {
    return TrtcReactNativeSdk.setCameraZoomRatio({
      "value": value.toString(),
    });
  }

  /// 设置是否自动识别人脸位置
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 参数：
  ///
  /// enable true：开启；false：关闭，默认值：true
  ///
  /// 返回值：0：操作成功 负数：失败
  enableCameraAutoFocus(enable: boolean) : Promise<void> {
    return TrtcReactNativeSdk.enableCameraAutoFocus({
      "enable": enable,
    });
  }

  /// 查询是否支持自动识别人脸位置
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 返回值：true 支持  false：不支持
  isAutoFocusEnabled() : Promise<boolean> {
    return TrtcReactNativeSdk.isAutoFocusEnabled();
  }

  /// 设置摄像头焦点。
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 参数：
  ///
  /// x	对焦位置 x 坐标
  ///
  /// y	对焦位置 y 坐标
  setCameraFocusPosition(x: number, y: number) : Promise<void> {
    return TrtcReactNativeSdk.setCameraFocusPosition({
      "x": x,
      "y": y,
    });
  }

  /// 开关闪光灯。
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 参数：
  ///
  /// enable	true：开启；false：关闭，默认值：false
  enableCameraTorch(enable: boolean) : Promise<void> {
    return TrtcReactNativeSdk.enableCameraTorch({
      "enable": enable,
    });
  }

  /// 设置通话时使用的系统音量类型。
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 智能手机一般具备两种系统音量类型，即通话音量类型和媒体音量类型。
  ///
  /// SDK 目前提供了三种系统音量类型的控制模式，分别为：
  ///
  ///* TRTCCloudDef.TRTCSystemVolumeTypeAuto： “麦上通话，麦下媒体”，即主播上麦时使用通话音量，观众不上麦则使用媒体音量，适合在线直播场景。 如果您在 enterRoom 时选择的场景为 TRTCCloudDef.TRTC_APP_SCENE_LIVE 或 TRTCCloudDef.TRTC_APP_SCENE_VOICE_CHATROOM，SDK 会自动选择该模式。
  ///
  ///* TRTCCloudDef.TRTCSystemVolumeTypeVOIP： 通话全程使用通话音量，适合多人会议场景。 如果您在 enterRoom 时选择的场景为 TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL 或 TRTCCloudDef.TRTC_APP_SCENE_AUDIOCALL，SDK 会自动选择该模式。
  ///
  ///* TRTCCloudDef.TRTCSystemVolumeTypeMedia： 通话全程使用媒体音量，不常用，适合个别有特殊需求（如主播外接声卡）的应用场景。
  ///
  /// 注意：
  ///
  ///* 需要在调用 startLocalAudio() 之前调用该接口。
  ///
  ///* 如无特殊需求，不推荐您自行设置，您只需通过 enterRoom 设置好适合您的场景，SDK 内部会自动选择相匹配的音量类型。
  ///
  /// 参数：
  ///
  /// type	系统音量类型，如无特殊需求，不推荐您自行设置。
  setSystemVolumeType(type: number) : Promise<void> {
    return TrtcReactNativeSdk.setSystemVolumeType({
      "type": type,
    });
  }

  /// 设置音频路由。
  ///
  /// setSystemVolumeType
  ///
  /// 微信和手机 QQ 视频通话功能的免提模式就是基于音频路由实现的。 一般手机都有两个扬声器，一个是位于顶部的听筒扬声器，声音偏小；一个是位于底部的立体声扬声器，声音偏大。 设置音频路由的作用就是决定声音使用哪个扬声器播放。
  ///
  /// 参数：
  ///
  /// route	音频路由，即声音由哪里输出（扬声器、听筒），请参考 TRTCCloudDef.TRTC_AUDIO_ROUTE_SPEAKER，默认值：TRTCCloudDef.TRTC_AUDIO_ROUTE_SPEAKER
  setAudioRoute(route: number) : Promise<void> {
    return TrtcReactNativeSdk.setSystemVolumeType({
      "route": route,
    });
  }

}
