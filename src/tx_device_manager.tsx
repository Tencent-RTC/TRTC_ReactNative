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
  /*

  /// 切换摄像头。
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 参数：
  ///
  /// isFrontCamera：true 前置摄像头
  ///
  /// isFrontCamera：false 后置摄像头
  Future<int?> switchCamera(bool isFrontCamera) {
    return _channel
        .invokeMethod('switchCamera', {"isFrontCamera": isFrontCamera});
  }

  /// 获取摄像头的缩放因子
  ///
  /// 注意：此接口只支持和Android和iOS平台
  Future<double?> getCameraZoomMaxRatio() {
    return _channel.invokeMethod('getCameraZoomMaxRatio');
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
  Future<int?> setCameraZoomRatio(double value // 取值范围为1 - 5，数值越大，焦距越远。
      ) {
    return _channel.invokeMethod('setCameraZoomRatio', {
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
  Future<int?> enableCameraAutoFocus(bool enable) {
    return _channel.invokeMethod('enableCameraAutoFocus', {
      "enable": enable,
    });
  }

  /// 查询是否支持自动识别人脸位置
  ///
  /// 注意：此接口只支持和Android和iOS平台
  ///
  /// 返回值：true 支持  false：不支持
  Future<bool?> isAutoFocusEnabled() {
    return _channel.invokeMethod('isAutoFocusEnabled');
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
  Future<void> setCameraFocusPosition(int x, int y) {
    return _channel.invokeMethod('setCameraFocusPosition', {
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
  Future<bool?> enableCameraTorch(bool enable // true：开启；false：关闭，默认值：false。
      ) {
    return _channel.invokeMethod('enableCameraTorch', {
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
  Future<void> setSystemVolumeType(
      int type // 系统音量类型，请参考 TRTCSystemVolumeType，默认值：TRTCSystemVolumeTypeAuto。
      ) {
    return _channel.invokeMethod('setSystemVolumeType', {
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
  Future<void> setAudioRoute(int route // 音频路由，即声音由哪里输出（扬声器、听筒）
      ) {
    return _channel.invokeMethod('setAudioRoute', {
      "route": route,
    });
  }

  /// 获取设备列表
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker、TXMediaDeviceTypeCamera。
  Future<Map?> getDevicesList(int type
      ) {
    return _channel.invokeMethod('getDevicesList', {
      "type": type,
    });
  }

  /// 指定当前设备
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker、TXMediaDeviceTypeCamera。
  /// deviceId	从 getDevicesList 中得到的设备 ID
  ///
  /// 返回：
  ///
  /// 0：操作成功 负数：失败
  Future<int?> setCurrentDevice(int type, String deviceId
      ) {
    return _channel.invokeMethod('setCurrentDevice', {
      "type": type,
      "deviceId": deviceId
    });
  }

  /// 获取当前使用的设备
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker、TXMediaDeviceTypeCamera。
  /// deviceId	从 getDevicesList 中得到的设备 ID
  ///
  /// 返回：
  ///
  /// ITRTCDeviceInfo 设备信息，能获取设备 ID 和设备名称
  Future<Map?> getCurrentDevice(int type
      ) {
    return _channel.invokeMethod('getCurrentDevice', {
      "type": type
    });
  }

  /// 设置当前设备的音量
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker。
  ///
  /// volume	音量大小
  ///
  /// 返回：
  ///
  /// ITRTCDeviceInfo 设备信息，能获取设备 ID 和设备名称
  Future<int?> setCurrentDeviceVolume(int type, int volume
      ) {
    return _channel.invokeMethod('setCurrentDeviceVolume', {
      "type": type,
      "volume": volume
    });
  }

  /// 获取当前设备的音量
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker。
  ///
  /// 返回：
  ///
  /// 音量大小
  Future<int?> getCurrentDeviceVolume(int type
      ) {
    return _channel.invokeMethod('getCurrentDeviceVolume', {
      "type": type
    });
  }

  /// 设置当前设备是否静音
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker。
  ///
  /// mute	是否静音/禁画
  ///
  /// 返回：
  ///
  /// 0：操作成功 负数：失败
  Future<int?> setCurrentDeviceMute(int type, bool mute
      ) {
    return _channel.invokeMethod('setCurrentDeviceMute', {
      "type": type,
      "mute": mute
    });
  }

  /// 查询当前设备是否静音
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// type	设备类型，指定需要获取哪种设备的列表。详见TXMediaDeviceType定义，type 只支持 TXMediaDeviceTypeMic、TXMediaDeviceTypeSpeaker。
  ///
  /// 返回：
  ///
  /// true : 当前设备已静音；false : 当前设备未静音
  Future<bool?> getCurrentDeviceMute(int type
      ) {
    return _channel.invokeMethod('getCurrentDeviceMute', {
      "type": type
    });
  }

  /// 开始麦克风测试
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// interval 音量回调间隔，单位为毫秒
  ///
  /// 返回：
  ///
  /// 0：操作成功 负数：失败
  Future<int?> startMicDeviceTest(int interval
      ) {
    return _channel.invokeMethod('startMicDeviceTest', {
      "interval": interval
    });
  }

  /// 结束麦克风测试
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 返回：
  ///
  /// 0：操作成功 负数：失败
  Future<int?> stopMicDeviceTest() {
    return _channel.invokeMethod('stopMicDeviceTest');
  }

  /// 开始扬声器测试
  ///
  /// 该方法播放指定的音频文件测试播放设备是否能正常工作。如果能听到声音，说明播放设备能正常工作。
  ///
  /// 注意：此接口只支持Mac和Windows平台
  ///
  /// 参数：
  ///
  /// filePath		声音文件的路径
  ///
  /// 返回：
  ///
  /// 0：操作成功 负数：失败
  Future<int?> startSpeakerDeviceTest(String filePath
      ) {
    return _channel.invokeMethod('startSpeakerDeviceTest', {
      "filePath": filePath
    });
  }

  /// 停止扬声器测试
  ///
  /// 注意：此接口只支持Windows平台
  ///
  /// 返回：
  ///
  /// 0：操作成功 负数：失败
  Future<int?> stopSpeakerDeviceTest() {
    return _channel.invokeMethod('stopSpeakerDeviceTest');
  }

  /// 设置 Windows 系统音量合成器中当前进程的音量
  ///
  /// 注意：此接口只支持Windows平台
  ///
  /// 参数：
  ///
  /// volume	音量大小，取值范围[0~100]
  ///
  /// 返回：
  ///
  /// 0:成功
  Future<int?> setApplicationPlayVolume(int volume
      ) {
    return _channel.invokeMethod('setApplicationPlayVolume', {
      "volume": volume
    });
  }

  /// 获取 Windows 系统音量合成器中当前进程的音量
  ///
  /// 注意：此接口只支持Windows平台
  ///
  /// 返回：
  ///
  /// 返回音量值，取值范围[0~100]
  Future<int?> getApplicationPlayVolume() {
    return _channel.invokeMethod('getApplicationPlayVolume');
  }

  /// 设置 Windows 系统音量合成器中当前进程的静音状态
  ///
  /// 注意：此接口只支持Windows平台
  ///
  /// 参数：
  ///
  /// bMute	是否设置为静音状态
  ///
  /// 返回：
  ///
  /// 0:成功
  Future<int?> setApplicationMuteState(bool	bMute
      ) {
    return _channel.invokeMethod('setApplicationMuteState', {
      "bMute": bMute
    });
  }

  /// 获取 Windows 系统音量合成器中当前进程的静音状态
  ///
  /// 注意：此接口只支持Windows平台
  ///
  /// 返回：
  ///
  /// 返回静音状态
  Future<bool?> getApplicationMuteState() {
    return _channel.invokeMethod('getApplicationMuteState');
  }
*/
}
