# trtc-react-native
该React Native sdk是基于 腾讯云 iOS/Android平台的 SDK进行封装，目前已支持音视频通话。

### sdk类文件说明

* trtc_cloud-腾讯云视频通话功能的主要接口类
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

4.显示本地视频
```
<TXVideoView.LocalView />
```

5.显示远端视频
```
<TXVideoView.RemoteView
  userId={remoteUserId}
  streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG}
/>
```

6.显示远端屏幕分享
```
<TXVideoView.RemoteView
  userId={remoteUserId}
  streamType={TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB}
/>
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

#### 安卓开发调试
1.在Demo目录下启动Metro，本项目是/example
```
npx react-native start
```
2.新开窗口，启动开发调试
```
npx react-native run-android
```

### iOS接入环境说明
根据官网文档指引搭建iOS开发环境。[文档指引](https://reactnative.dev/docs/environment-setup)
#### 配置 App 权限
在 Info.plist 中配置 App 的权限，TRTC SDK 需要以下权限：

```
<key>NSCameraUsageDescription</key>
<string>授权摄像头权限才能正常视频通话</string>
<key>NSMicrophoneUsageDescription</key>
<string>授权麦克风权限才能正常语音通话</string>
```

#### 开发调试

1.启动 Metro, 在你的React Native 项目目录下运行 npx react-native start
```
npx react-native start
```
2.在项目目录里启动新命令行窗口，运行一下代码，程序会自行pod install并编译iOS工程
```
npx react-native run-ios
```
3.如果对iOS目录有任何修改，再次运行yarn ios就可以
4.如果需要调试iOS，在ios目录下，打开.xcworkspace运行
