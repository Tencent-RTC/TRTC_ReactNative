# trtc-react-native
该React Native sdk是基于 腾讯云 iOS/Android平台的 SDK进行封装。目前仅支持音频通话，后续会支持视频。

### sdk类文件说明

* index-腾讯云视频通话功能的主要接口类
* tx_audio_effect_manager-腾讯云音视频通话功能音乐和人声设置接口
* tx_device_manager-设备管理类
* trtc_cloud_def-腾讯云音视频通话功能的关键类型定义
* trtc_cloud_listener-腾讯云音视频通话功能的事件回调监听接口

### 调用示例

1.初始化
```
// 创建 TRTCCloud 单例
const trtcCloud = TRTCCloud.sharedInstance();
// 获取设备管理模块
const txDeviceManager = trtcCloud.getDeviceManager();
// 获取音效管理类
const txAudioManager = trtcCloud.getAudioEffectManager();
```

2.进退房
```
//进房
const params = new TRTCParams({
        sdkAppId: SDKAPPID,//应用id
        userId,//用户id
        userSig,//用户签名
        roomId: 2366,//房间Id
      });
      trtcCloud.enterRoom(params, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);
//退房
trtcCloud.exitRoom();
```

3.事件监听
```
//设置事件监听
trtcCloud.registerListener(onRtcListener);

function onRtcListener(type: TRTCCloudListener, params: any) {
  //进房回调事件
  if (type === TRTCCloudListener.onEnterRoom) {
    if (params.result > 0) {
      //进房成功
    }
  }
  // 远端用户进房
  if (type === TRTCCloudListener.onRemoteUserEnterRoom) {
    //params.userId参数为远端用户userId
  }
  //远端用户是否打开麦克风
  if (type === TRTCCloudListener.onUserAudioAvailable) {
    //param.userId 表示远端用户id
    //param.visible true表示打开麦克风
  }
}
//移除事件监听
trtcCloud.unRegisterListener(onRtcListener);
```

### Android接入环境说明
根据官网文档指引搭建安卓开发环境。[文档指引](https://reactnative.dev/docs/environment-setup)
注意：Android仅支持真机调试
#### 配置 App 权限
在 AndroidManifest.xml 中配置 App 的权限，TRTC SDK 需要以下权限：

```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-feature android:name="android.hardware.camera" />
<uses-feature android:name="android.hardware.camera.autofocus" />
```

>! 请勿设置 `android:hardwareAccelerated="false"`，关闭硬件加速之后，会导致对方的视频流无法渲染。

```
// 安卓音视频权限需要手动申请
if (Platform.OS === 'android') {
  await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, //音频需要
    // PermissionsAndroid.PERMISSIONS.CAMERA, // 视频需要
  ]);
}
```

#### 开发调试
1.To start Metro, run npx react-native start inside your React Native project folder
```
npx react-native start
```
2.Let Metro Bundler run in its own terminal. Open a new terminal inside your React Native project folder. Run the following
```
npx react-native run-android
```
