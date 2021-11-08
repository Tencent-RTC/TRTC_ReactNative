import AVFoundation
import TXLiteAVSDK_TRTC


@objc(TrtcReactNativeSdk)
class TrtcReactNativeSdk: RCTEventEmitter, TRTCCloudDelegate {
	
	private var hasListeners = false
	
	private var txCloudManager: TRTCCloud = TRTCCloud.sharedInstance();
	private var txAudioEffectManager: TXAudioEffectManager = TRTCCloud.sharedInstance().getAudioEffectManager();
	private var txDeviceManager: TXDeviceManager = (TRTCCloud.sharedInstance()?.getDeviceManager())!;
	private var txBeautyManager: TXBeautyManager = (TRTCCloud.sharedInstance()?.getBeautyManager())!;
	
	override func supportedEvents() -> [String]! {
		return ["onListener"]
	}
	
	// sdk manager begin
	@objc(sharedInstance:withRejecter:)
	func sharedInstance(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.delegate = self;
		resolve(0);
	}
	
	@objc(getSDKVersion:withRejecter:)
	func getSDKVersion(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		resolve(TRTCCloud.getSDKVersion());
	}
	
	@objc(enterRoom:withScene:withResolver:withRejecter:)
	func enterRoom(param: NSDictionary, scene: Int, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let sdkAppId = param["sdkAppId"] as? UInt32,
		   let userId = param["userId"] as? String,
		   let userSig = param["userSig"] as? String,
		   let roomId = param["roomId"] as? UInt32,
		   let strRoomId = param["strRoomId"] as? String,
		   let role = param["role"] as? Int,
		   let streamId = param["streamId"] as? String,
		   let userDefineRecordId = param["userDefineRecordId"] as? String,
		   let privateMapKey = param["privateMapKey"] as? String,
		   let businessInfo = param["businessInfo"] as? String {
			let params = TRTCParams();
			params.sdkAppId = sdkAppId;
			params.userId = userId;
			params.userSig = userSig;
			params.roomId = roomId;
			params.strRoomId = strRoomId;
			params.streamId = streamId;
			params.userDefineRecordId = userDefineRecordId;
			params.privateMapKey = privateMapKey;
			params.bussInfo = businessInfo;
			params.role = TRTCRoleType(rawValue: role)!;
			
			txCloudManager.enterRoom(params, appScene: TRTCAppScene(rawValue: role)!);
			txCloudManager.callExperimentalAPI("{\"api\": \"setFramework\", \"params\": {\"framework\": 22}}");
			result(0);
		} else {
			result(-1);
		}
	}
	
	@objc(exitRoom:withRejecter:)
	func exitRoom(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.exitRoom();
		resolve(0);
	}

  @objc(getAudioEffectManager:withRejecter:)
	func getAudioEffectManager(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.getAudioEffectManager();
		resolve(0);
	}

  @objc(getDeviceManager:withRejecter:)
	func getDeviceManager(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.getDeviceManager();
		txCloudManager.getDeviceManager();
		resolve(0);
	}
	
	@objc(getBeautyManager:withRejecter:)
	func getBeautyManager(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.getBeautyManager();
		resolve(0);
	}
	
	/**
	* 跨房通话
	*/
  @objc(connectOtherRoom:withResolver:withRejecter:)
	func connectOtherRoom(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let param = param["param"] as? String {
			txCloudManager.connectOtherRoom(param);
			result(nil);
		}
	}
	
	/**
	* 退出跨房通话
	*/
  @objc(disconnectOtherRoom:withRejecter:)
	func disconnectOtherRoom(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.disconnectOtherRoom();
		result(nil);
	}
	
	/**
	* 切换房间
	*/
  @objc(switchRoom:withResolver:withRejecter:)
	func switchRoom(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		let config = JsonUtil.getDictionaryFromJSONString(jsonString: (param["config"] as? String)!);
		
		if let userSig = config["userSig"] as? String,
		   let roomId = config["roomId"] as? UInt32,
		   let strRoomId = config["strRoomId"] as? String,
		   let privateMapKey = config["privateMapKey"] as? String {
			let params = TRTCSwitchRoomConfig();
			params.userSig = userSig;
			params.roomId = roomId;
			params.strRoomId = strRoomId;
			params.privateMapKey = privateMapKey;
			
			txCloudManager.switchRoom(params);
			result(nil);
		}
	}
	
	/**
	* 切换角色，仅适用于直播场景（TRTC_APP_SCENE_LIVE 和 TRTC_APP_SCENE_VOICE_CHATROOM）
	*/
  @objc(switchRole:withResolver:withRejecter:)
	func switchRole(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let role = param["role"] as? Int {
			txCloudManager.switch(TRTCRoleType(rawValue: role)!);
			result(nil);
		}
	}
	
	/**
	* 设置音视频数据接收模式，需要在进房前设置才能生效
	*/
  // @objc(setDefaultStreamRecvMode:withResolver:withRejecter:)
	// func setDefaultStreamRecvMode(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
	// 	if let autoRecvAudio = param["autoRecvAudio"] as? Bool,
	// 	   let autoRecvVideo = param["autoRecvVideo"] as? Bool {
	// 		txCloudManager.setDefaultStreamRecvMode(autoRecvAudio, video: autoRecvVideo);
	// 		result(nil);
	// 	}
	// }
	
	/**
	* 静音/取消静音指定的远端用户的声音
	*/
  @objc(muteRemoteAudio:withResolver:withRejecter:)
	func muteRemoteAudio(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let userId = param["userId"] as? String,
		   let mute = param["mute"] as? Bool {
			txCloudManager.muteRemoteAudio(userId, mute: mute);
			result(nil);
		}
	}
	
	/**
	* 静音/取消静音所有用户的声音
	*/
  @objc(muteAllRemoteAudio:withResolver:withRejecter:)
	func muteAllRemoteAudio(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let mute = param["mute"] as? Bool {
			txCloudManager.muteAllRemoteAudio(mute);
			result(nil);
		}
	}
	
	/**
	* 设置采集音量
	*/
  @objc(setAudioCaptureVolume:withResolver:withRejecter:)
	func setAudioCaptureVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let volume = param["volume"] as? Int {
			txCloudManager.setAudioCaptureVolume(volume);
			result(nil);
		}
	}
	
	/**
	* 设置某个远程用户的播放音量
	*/
  @objc(setRemoteAudioVolume:withResolver:withRejecter:)
	func setRemoteAudioVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let userId = param["userId"] as? String,
		   let volume = param["volume"] as? Int32 {
			txCloudManager.setRemoteAudioVolume(userId, volume: volume);
			result(nil);
		}
	}
	
	/**
	* 设置播放音量
	*/
  @objc(setAudioPlayoutVolume:withResolver:withRejecter:)
	func setAudioPlayoutVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let volume = param["volume"] as? Int {
			txCloudManager.setAudioPlayoutVolume(volume);
			result(nil);
		}
	}
	
	/**
	* 获取采集音量
	*/
  @objc(getAudioCaptureVolume:withRejecter:)
	func getAudioCaptureVolume(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		let volume = txCloudManager.getAudioCaptureVolume();
		result(volume);
	}
	
	/**
	* 获取播放音量
	*/
  @objc(getAudioPlayoutVolume:withRejecter:)
	func getAudioPlayoutVolume(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		let volume = txCloudManager.getAudioPlayoutVolume();
		result(volume);
	}
	
	/**
	* 开启本地音频的采集和上行
	*/
  @objc(startLocalAudio:withResolver:withRejecter:)
	func startLocalAudio(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let quality = param["quality"] as? Int {
			txCloudManager.startLocalAudio(TRTCAudioQuality(rawValue: quality)!);
			result(nil);
		}
	}
	
	/**
	* 关闭本地音频的采集和上行
	*/
  @objc(stopLocalAudio:withRejecter:)
	func stopLocalAudio(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.stopLocalAudio();
		result(nil);
	}
	
	/**
	* 本地视频渲染设置
	*/
  @objc(setLocalRenderParams:withResolver:withRejecter:)
	func setLocalRenderParams(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let param = param["param"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
			let data = TRTCRenderParams();
			if dict["rotation"] != nil {
				data.rotation = TRTCVideoRotation(rawValue: dict["rotation"] as! Int)!;
			}
			if dict["fillMode"] != nil {
				data.fillMode = TRTCVideoFillMode(rawValue: dict["fillMode"] as! Int)!;
			}
			if dict["mirrorType"] != nil {
				data.mirrorType = TRTCVideoMirrorType(rawValue: dict["mirrorType"] as! UInt)!;
			}
			txCloudManager.setLocalRenderParams(data);
			result(nil);
		}
	}
	
	/**
	* 远程视频渲染设置
	*/
  @objc(setRemoteRenderParams:withResolver:withRejecter:)
	func setRemoteRenderParams(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let userId = param["userId"] as? String,
		   let streamType = param["streamType"] as? Int,
		   let param = param["param"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
			let data = TRTCRenderParams();
			if dict["rotation"] != nil {
				data.rotation = TRTCVideoRotation(rawValue: dict["rotation"] as! Int)!;
			}
			if dict["fillMode"] != nil {
				data.fillMode = TRTCVideoFillMode(rawValue: dict["fillMode"] as! Int)!;
			}
			if dict["mirrorType"] != nil {
				data.mirrorType = TRTCVideoMirrorType(rawValue: dict["mirrorType"] as! UInt)!;
			}
			txCloudManager.setRemoteRenderParams(userId, streamType: TRTCVideoStreamType(rawValue: streamType)!,  params: data);
			result(nil);
		}
	}
	
	/**
	* 停止显示所有远端视频画面，同时不再拉取远端用户的视频数据流
	*/
  @objc(stopAllRemoteView:withResolver:withRejecter:)
	func stopAllRemoteView(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.stopAllRemoteView();
		result(nil);
	}
	
	/**
	* 暂停/恢复接收指定的远端视频流
	*/
  @objc(muteRemoteVideoStream:withResolver:withRejecter:)
	func muteRemoteVideoStream(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let userId = param["userId"] as? String,
		   let mute = param["mute"] as? Bool {
			txCloudManager.muteRemoteVideoStream(userId, mute: mute);
			result(nil);
		}
	}
	
	/**
	* 暂停/恢复接收所有远端视频流
	*/
  @objc(muteAllRemoteVideoStreams:withResolver:withRejecter:)
	func muteAllRemoteVideoStreams(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let mute = param["mute"] as? Bool {
			txCloudManager.muteAllRemoteVideoStreams(mute);
			result(nil);
		}
	}
	
	/**
	* 设置视频编码器相关参数
	*/
  @objc(setVideoEncoderParam:withResolver:withRejecter:)
	func setVideoEncoderParam(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let param = param["param"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
			let data = TRTCVideoEncParam();
			if dict["videoBitrate"] != nil {
				data.videoBitrate = dict["videoBitrate"] as! Int32;
			}
			if dict["videoResolution"] != nil {
				data.videoResolution = TRTCVideoResolution(rawValue: dict["videoResolution"] as! Int)!;
			}
			if dict["videoResolutionMode"] != nil {
				data.resMode = TRTCVideoResolutionMode(rawValue: dict["videoResolutionMode"] as! Int)!;
			}
			if dict["videoFps"] != nil {
				data.videoFps = dict["videoFps"] as! Int32;
			}
			txCloudManager.setVideoEncoderParam(data);
			result(nil);
		}
	}
	
	/**
	* 开始向腾讯云的直播 CDN 推流
	*/
  @objc(startPublishing:withResolver:withRejecter:)
	func startPublishing(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let streamType = param["streamType"] as? Int,
		   let streamId = param["streamId"] as? String {
			txCloudManager.startPublishing(streamId, type: TRTCVideoStreamType(rawValue: streamType)!);
			result(nil);
			
		}
	}
	
	/**
	* 开始向腾讯云的直播 CDN 推流
	*/
  @objc(startPublishCDNStream:withResolver:withRejecter:)
	func startPublishCDNStream(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		let param = param["param"] as! String;
		let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
		
		if let appId = dict["appId"] as? Int32,
		   let bizId = dict["bizId"] as? Int32,
		   let url = dict["url"] as? String {
			let params = TRTCPublishCDNParam();
			params.appId = appId;
			params.bizId = bizId;
			params.url = url;
			
			txCloudManager.startPublishCDNStream(params);
			result(nil);
		}
	}
	
	/**
	* 停止向腾讯云的直播 CDN 推流
	*/
  @objc(stopPublishCDNStream:withRejecter:)
	func stopPublishCDNStream(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.stopPublishCDNStream();
		result(nil);
	}
	
	/**
	* 停止向腾讯云的直播 CDN 推流
	*/
  @objc(stopPublishing:withResolver:withRejecter:)
	func stopPublishing(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.stopPublishing();
		result(nil);
	}
	
	/**
	* 设置云端的混流转码参数
	*/
  @objc(setMixTranscodingConfig:withResolver:withRejecter:)
	func setMixTranscodingConfig(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let param = param["config"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
			let backgroundImage = dict["backgroundImage"] as? String;
			let streamId = dict["streamId"] as? String;
			
			if let appId = dict["appId"] as? Int32,
			   let bizId = dict["bizId"] as? Int32,
			   let videoWidth = dict["videoWidth"] as? Int32,
			   let mode = dict["mode"] as? Int,
			   let videoHeight = dict["videoHeight"] as? Int32,
			   let videoFramerate = dict["videoFramerate"] as? Int32,
			   let videoGOP = dict["videoGOP"] as? Int32,
			   let backgroundColor = dict["backgroundColor"] as? Int32,
			   let videoBitrate = dict["videoBitrate"] as? Int32,
			   let audioBitrate = dict["audioBitrate"] as? Int32,
			   let audioSampleRate = dict["audioSampleRate"] as? Int32,
			   let audioChannels = dict["audioChannels"] as? Int32,
			   let mixUsers = dict["mixUsers"] as? Array<AnyObject> {
				
				let config = TRTCTranscodingConfig();
				var users: [TRTCMixUser] = [];
				
				config.appId = appId;
				config.bizId = bizId;
				config.videoWidth = videoWidth;
				config.mode = TRTCTranscodingConfigMode(rawValue: mode)!;
				config.videoHeight = videoHeight;
				config.videoFramerate = videoFramerate;
				config.videoGOP = videoGOP;
				config.backgroundImage = backgroundImage;
				config.backgroundColor = backgroundColor;
				config.videoBitrate = videoBitrate;
				config.audioBitrate = audioBitrate;
				config.audioSampleRate = audioSampleRate;
				config.audioChannels = audioChannels;
				config.streamId = streamId;
				
				for item in mixUsers {
					let user = TRTCMixUser();
					user.userId = item["userId"] as! String;
					user.roomID = item["roomId"] as? String;
					user.rect = CGRect(x: item["x"] as! Int, y: item["y"] as! Int, width: item["width"] as! Int, height: item["height"] as! Int);
					user.zOrder = item["zOrder"] as! Int32;
					user.streamType = TRTCVideoStreamType(rawValue: item["streamType"] as! Int)!;
					user.pureAudio = false;
					users.append(user);
				}
				
				config.mixUsers = users;
				txCloudManager.setMix(config);
				
				result(nil);
			}
		}
	}
	
	/**
	* 设置网络流控相关参数
	*/
  @objc(setNetworkQosParam:withResolver:withRejecter:)
	func setNetworkQosParam(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let param = param["param"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
			let param = TRTCNetworkQosParam();
			
			if !(dict["preference"] is NSNull) &&  dict["preference"] != nil {
				param.preference = TRTCVideoQosPreference(rawValue: dict["preference"] as! Int)!;
			}
			if !(dict["controlMode"] is NSNull) &&  dict["controlMode"] != nil {
				param.controlMode = TRTCQosControlMode(rawValue: dict["controlMode"] as! Int)!;
			}
			
			txCloudManager.setNetworkQosParam(param);
			result(nil);
		}
	}
	
	/**
	* 设置暂停推送本地视频时要推送的图片
	*/
  @objc(setVideoMuteImage:withResolver:withRejecter:)
	func setVideoMuteImage(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		let imageUrl = param["imageUrl"] as? String;
		if 	let fps = param["fps"] as? Int,
			   let type = param["type"] as? String {
			if(imageUrl == nil) {
				txCloudManager.setVideoMuteImage(nil, fps: fps);
			} else {
				if type == "local" {
//					let img = UIImage(contentsOfFile: self.getFlutterBundlePath(assetPath: imageUrl!)!)!;
//					txCloudManager.setVideoMuteImage(img, fps: fps);
				} else {
					let queue = DispatchQueue(label: "setVideoMuteImage")
					queue.async {
						let url: NSURL = NSURL(string: imageUrl!)!
						let data: NSData = NSData(contentsOf: url as URL)!
						let img = UIImage(data: data as Data, scale: 1)!
						self.txCloudManager.setVideoMuteImage(img, fps: fps);
					}
				}
			}
			result(nil);
		}
	}
	
	/**
	* 设置视频编码输出的画面方向，即设置远端用户观看到的和服务器录制的画面方向
	*/
  @objc(setVideoEncoderRotation:withResolver:withRejecter:)
	func setVideoEncoderRotation(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let rotation = param["rotation"] as? Int {
			txCloudManager.setVideoEncoderRotation(TRTCVideoRotation(rawValue: rotation)!);
			result(nil);
		}
	}
	
	/**
	* 设置编码器输出的画面镜像模式
	*/
  @objc(setVideoEncoderMirror:withResolver:withRejecter:)
	func setVideoEncoderMirror(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let mirror = param["mirror"] as? Bool {
			txCloudManager.setVideoEncoderMirror(mirror);
			result(nil);
		}
	}
	
	/**
	* 设置重力感应的适应模式
	*/
  @objc(setGSensorMode:withResolver:withRejecter:)
	func setGSensorMode(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let mode = param["mode"] as? Int {
			txCloudManager.setGSensorMode(TRTCGSensorMode(rawValue: mode)!);
			result(nil);
		}
	}
	
	/**
	* 开启大小画面双路编码模式
	*/
  @objc(enableEncSmallVideoStream:withResolver:withRejecter:)
	func enableEncSmallVideoStream(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let enable = param["enable"] as? Bool,
		   let smallVideoEncParam = param["smallVideoEncParam"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: smallVideoEncParam);
			let data = TRTCVideoEncParam();
			if !(dict["videoBitrate"] is NSNull) &&  dict["videoBitrate"] != nil {
				data.videoBitrate = dict["videoBitrate"] as! Int32;
			}
			if !(dict["videoResolution"] is NSNull)  &&  dict["videoResolution"] != nil  {
				data.videoResolution = TRTCVideoResolution(rawValue: dict["videoResolution"] as! Int)!;
			}
			if !(dict["videoResolutionMode"] is NSNull)  &&  dict["videoResolutionMode"] != nil  {
				data.resMode = TRTCVideoResolutionMode(rawValue: dict["videoResolutionMode"] as! Int)!;
			}
			if !(dict["videoFps"] is NSNull)  &&  dict["videoFps"] != nil  {
				data.videoFps = dict["videoFps"] as! Int32;
			}
			
			let ret = txCloudManager.enableEncSmallVideoStream(enable, withQuality: data);
			result(ret);
		}
	}
	
	/**
	* 选定观看指定 uid 的大画面或小画面
	*/
  @objc(setRemoteVideoStreamType:withResolver:withRejecter:)
	func setRemoteVideoStreamType(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let userId = param["userId"] as? String,
		   let streamType = param["streamType"] as? Int {
			txCloudManager.setRemoteVideoStreamType(userId, type: TRTCVideoStreamType(rawValue: streamType)!);
			result(nil);
		}
	}
	
	/**
	* 视频画面截图
	*/
  @objc(snapshotVideo:withResolver:withRejecter:)
	func snapshotVideo(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
//		let userId = param["userId"] as? String;
//		if let streamType = param["streamType"] as? Int,
//		   let path = param["path"] as? String {
//
//			txCloudManager.snapshotVideo(userId, type: TRTCVideoStreamType(rawValue: streamType)!, completionBlock: {
//				(image) -> Void in
//
//				let data: Data
//				let url = URL(fileURLWithPath: "path")
//
//				if path.hasSuffix(".png") {
//					data = (image?.pngData()!
//				} else {
//					data = (image?.jpegData(compressionQuality: CGFloat(1))!
//				}
//
//				do {
//					try data.write(to: url)
//					TencentTRTCCloud.invokeListener(type: ListenerType.onSnapshotComplete, params: ["errCode": 0, "path": path]);
//				} catch {
//					CommonUtils.logError(call: call, errCode: -1, errMsg: "\(error)")
//					TencentTRTCCloud.invokeListener(type: ListenerType.onSnapshotComplete, params: ["errCode": -1, "errMsg": "\(error)", "path": nil]);
//				}
//			});
//			result(nil);
//		}
	}
	
	/**
	* 静音/取消静音本地的音频
	*/
  @objc(muteLocalAudio:withResolver:withRejecter:)
	func muteLocalAudio(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let mute = param["mute"] as? Bool {
			txCloudManager.muteLocalAudio(mute);
			result(nil);
		}
	}
	
	/**
	* 暂停/恢复推送本地的视频数据
	*/
  @objc(muteLocalVideo:withResolver:withRejecter:)
	func muteLocalVideo(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let mute = param["mute"] as? Bool {
			txCloudManager.muteLocalVideo(mute);
			result(nil);
		}
	}
	
	/**
	* 启用音量大小提示
	*/
  @objc(enableAudioVolumeEvaluation:withResolver:withRejecter:)
	func enableAudioVolumeEvaluation(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let intervalMs = param["intervalMs"] as? UInt {
			txCloudManager.enableAudioVolumeEvaluation(intervalMs);
			result(nil);
		}
	}
	
	/**
	* 开始录音
	*/
  @objc(startAudioRecording:withResolver:withRejecter:)
	func startAudioRecording(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let param = param["param"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: param);
			let data = TRTCAudioRecordingParams();
			data.filePath = dict["filePath"] as! String;
			result(txCloudManager.startAudioRecording(data));
		}
	}
	
	/**
	* 停止录音
	*/
  @objc(stopAudioRecording:withRejecter:)
	func stopAudioRecording(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.stopAudioRecording();
		result(nil);
	}
    
	/**
	* 设置水印
	*/
  @objc(setWatermark:withResolver:withRejecter:)
	func setWatermark(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let imageUrl = param["imageUrl"] as? String,
		   let streamType = param["streamType"] as? Int,
		   let x = param["x"] as? String,
		   let y = param["y"] as? String,
		   let width = param["width"] as? String,
		   let type = param["type"] as? String {
			
			let fx = CGFloat.init(Float.init(x)!)
			let fy = CGFloat.init(Float.init(y)!)
			let fwidth = CGFloat.init(Float.init(width)!)
			let rect = CGRect(x: fx, y: fy, width: fwidth, height: fwidth)
			
			if type == "local" {
//				txCloudManager.setWatermark(UIImage.init(contentsOfFile: self.getFlutterBundlePath(assetPath: imageUrl)!), streamType: TRTCVideoStreamType.init(rawValue: streamType)!, rect: rect)
			} else {
				let queue = DispatchQueue(label: "setWatermark")
				queue.async {
					let url: NSURL = NSURL(string: imageUrl)!
					let data: NSData = NSData(contentsOf: url as URL)!
					let img = UIImage(data: data as Data, scale: 1)!
					self.txCloudManager.setWatermark(img, streamType: TRTCVideoStreamType.init(rawValue: streamType)!, rect: rect)
				}
			}
			
			result(nil);
		}
	}
	
	/**
	* 开始应用内的屏幕分享（该接口仅支持 iOS 13.0 及以上的 iPhone 和 iPad）
	*/
  @objc(startScreenCaptureInApp:withResolver:withRejecter:)
	func startScreenCaptureInApp(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let encParams = param["encParams"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: encParams);
			let data = TRTCVideoEncParam();
			if dict["videoResolution"] != nil {
				data.videoResolution = TRTCVideoResolution(rawValue: dict["videoResolution"] as! Int)!;
			}
			if dict["videoFps"] != nil {
				data.videoFps = dict["videoFps"] as! Int32;
			}
			if dict["videoBitrate"] != nil {
				data.videoBitrate = dict["videoBitrate"] as! Int32;
			}
			if dict["enableAdjustRes"] != nil {
				data.enableAdjustRes = dict["enableAdjustRes"] as! Bool;
			}
			if #available(iOS 13.0,*){
				txCloudManager.startScreenCapture(inApp:data);
			}
		}else{
			if #available(iOS 13.0,*){
				txCloudManager.startScreenCapture(inApp:nil);
			}
		}
		result(nil);
	}
	
	/**
	* 开始全系统的屏幕分享（该接口支持 iOS 11.0 及以上的 iPhone 和 iPad）
	*/
  @objc(startScreenCaptureByReplaykit:withResolver:withRejecter:)
	func startScreenCaptureByReplaykit(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		let appGroup = param["appGroup"] as! String;
		if let encParams = param["encParams"] as? String {
			let dict = JsonUtil.getDictionaryFromJSONString(jsonString: encParams);
			let data = TRTCVideoEncParam();
			if dict["videoResolution"] != nil {
				data.videoResolution = TRTCVideoResolution(rawValue: dict["videoResolution"] as! Int)!;
			}
			if dict["videoFps"] != nil {
				data.videoFps = dict["videoFps"] as! Int32;
			}
			if dict["videoBitrate"] != nil {
				data.videoBitrate = dict["videoBitrate"] as! Int32;
			}
			if dict["enableAdjustRes"] != nil {
				data.enableAdjustRes = dict["enableAdjustRes"] as! Bool;
			}
			if #available(iOS 11.0,*){
				txCloudManager.startScreenCapture(byReplaykit:data,appGroup:appGroup);
			}
		}else{
			if #available(iOS 11.0,*){
				txCloudManager.startScreenCapture(byReplaykit:nil,appGroup:appGroup);
			}
		}
		result(nil);
	}

	/**
	* 开始桌面端屏幕分享（该接口仅支持 Mac OS 桌面系统）.不支持
	*/
  @objc(startScreenCapture:withResolver:withRejecter:)
	func startScreenCapture(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		//txCloudManager.startScreenCapture();
		result(nil);
	}

	/**
	* 停止屏幕采集
	*/
  @objc(stopScreenCapture:withResolver:withRejecter:)
	func stopScreenCapture(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if #available(iOS 11.0,*){
			result(txCloudManager.stopScreenCapture());
		}else{
			result(-1)
		}
	}

	/**
	* 暂停屏幕分享
	*/
  @objc(pauseScreenCapture:withResolver:withRejecter:)
	func pauseScreenCapture(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if #available(iOS 11.0,*){
			result(txCloudManager.pauseScreenCapture());
		}else{
			result(-1)
		}
	}

	/**
	* 恢复屏幕分享
	*/
  @objc(resumeScreenCapture:withResolver:withRejecter:)
	func resumeScreenCapture(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if #available(iOS 11.0,*){
			result(txCloudManager.resumeScreenCapture());
		}else{
			result(-1)
		}
	}

	/**
	* 发送自定义消息给房间内所有用户
	*/
  @objc(sendCustomCmdMsg:withResolver:withRejecter:)
	func sendCustomCmdMsg(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let cmdID = param["cmdID"] as? Int,
		   let dataStr = param["data"] as? String,
		   let reliable = param["reliable"] as? Bool,
		   let ordered = param["ordered"] as? Bool {
			let nsdata = dataStr.data(using: String.Encoding.utf8);
			result(txCloudManager.sendCustomCmdMsg(cmdID, data: nsdata, reliable: reliable, ordered: ordered));
		}
	}
	
	/**
	* 将小数据量的自定义数据嵌入视频帧中
	*/
  @objc(sendSEIMsg:withResolver:withRejecter:)
	func sendSEIMsg(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if  let dataStr = param["data"] as? String,
			let repeatCount = param["repeatCount"] as? Int32 {
			let nsdata = dataStr.data(using: String.Encoding.utf8);
			result(txCloudManager.sendSEIMsg(nsdata, repeatCount: repeatCount));
		}
	}
	
	/**
	* 开始进行网络测速（视频通话期间请勿测试，以免影响通话质量）
	*/
  @objc(startSpeedTest:withResolver:withRejecter:)
	func startSpeedTest(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		if let sdkAppId = param["sdkAppId"] as? UInt32,
		   let userId = param["userId"] as? String,
		   let userSig = param["userSig"] as? String {
			txCloudManager.startSpeedTest(sdkAppId, userId: userId, userSig: userSig, completion: {
				(result, completedCount, totalCount) -> Void in
				print(result as Any, completedCount, totalCount)
				
			});
			result(nil);
			
		}
	}
	
	/**
	* 停止服务器测速
	*/
  @objc(stopSpeedTest:withRejecter:)
	func stopSpeedTest(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		txCloudManager.stopSpeedTest();
		result(nil);
	}
    
  /**
  * 调用实验性 API 接口
  */
  @objc(callExperimentalAPI:withResolver:withRejecter:)
  func callExperimentalAPI(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
      if let jsonStr = param["jsonStr"] as? String {
          txCloudManager.callExperimentalAPI(jsonStr);
          result(nil);
      }
  }
	// kamar xxx
	// sdk manager end
	// audio begin
	/**
	  * 开始播放背景音乐
	  */
	@objc(startPlayMusic:withResolver:withRejecter:)
	  public func startPlayMusic(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let musicParam = param["musicParam"] as? String {
			  let musicParam = JsonUtil.getDictionaryFromJSONString(jsonString: musicParam);
			  let param = TXAudioMusicParam();
			  
			  param.id = musicParam["id"] as! Int32
			  param.path = musicParam["path"] as! String
			  param.loopCount = musicParam["loopCount"] as? Int ?? 0
			  param.publish = musicParam["publish"] as? Bool ?? false
			  param.isShortFile = musicParam["isShortFile"] as? Bool ?? false
			  param.startTimeMS = musicParam["startTimeMS"] as? Int ?? 0
			  param.endTimeMS = musicParam["endTimeMS"] as? Int ?? 0
			  
			  txAudioEffectManager.startPlayMusic(param, onStart: {
				  (errCode) -> Void in
				  
				self.sendEventFormat(name: "onMusicObserverStart", params: ["id": param.id, "errCode": errCode]);
			  }, onProgress: {
				  (progressMs, durationMs) -> Void in
				  
				self.sendEventFormat(name: "onMusicObserverPlayProgress", params: ["id": param.id, "curPtsMS": progressMs, "durationMS": durationMs]);
			  }, onComplete: {
				  (errCode) -> Void in
				
				self.sendEventFormat(name: "onMusicObserverComplete", params: ["id": param.id, "errCode": errCode]);
			  });
			  result(nil);
		  }
	  }
	  
	  /**
	  * 开启耳返
	  */
	@objc(enableVoiceEarMonitor:withResolver:withRejecter:)
	  public func enableVoiceEarMonitor(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let enable = param["enable"] as? Bool {
			  txAudioEffectManager.enableVoiceEarMonitor(enable);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置耳返音量
	  */
	@objc(setVoiceEarMonitorVolume:withResolver:withRejecter:)
	  public func setVoiceEarMonitorVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let volume = param["volume"] as? Int {
			  txAudioEffectManager.setVoiceEarMonitorVolume(volume);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置人声的混响效果（KTV、小房间、大会堂、低沉、洪亮...）
	  */
	@objc(setVoiceReverbType:withResolver:withRejecter:)
	  public func setVoiceReverbType(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let type = param["type"] as? Int {
			  txAudioEffectManager.setVoiceReverbType(TXVoiceReverbType(rawValue: type)!);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置人声的变声特效（萝莉、大叔、重金属、外国人...）
	  */
	@objc(setVoiceChangerType:withResolver:withRejecter:)
	  public func setVoiceChangerType(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let type = param["type"] as? Int {
			  txAudioEffectManager.setVoiceChangerType(TXVoiceChangeType(rawValue: type)!);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置麦克风采集人声的音量
	  */
	@objc(setVoiceCaptureVolume:withResolver:withRejecter:)
	  public func setVoiceCaptureVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let volume = param["volume"] as? Int {
			  txAudioEffectManager.setVoiceVolume(volume);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 停止播放背景音乐
	  */
	@objc(stopPlayMusic:withResolver:withRejecter:)
	  public func stopPlayMusic(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32 {
			  txAudioEffectManager.stopPlayMusic(id);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 暂停播放背景音乐
	  */
	@objc(pausePlayMusic:withResolver:withRejecter:)
	  public func pausePlayMusic(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32 {
			  txAudioEffectManager.pausePlayMusic(id);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 恢复播放背景音乐
	  */
	@objc(resumePlayMusic:withResolver:withRejecter:)
	  public func resumePlayMusic(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32 {
			  txAudioEffectManager.resumePlayMusic(id);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置背景音乐的远端音量大小，即主播可以通过此接口设置远端观众能听到的背景音乐的音量大小。
	  */
	@objc(setMusicPublishVolume:withResolver:withRejecter:)
	  public func setMusicPublishVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32,
			 let volume = param["volume"] as? Int {
			  txAudioEffectManager.setMusicPublishVolume(id, volume: volume);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置背景音乐的本地音量大小，即主播可以通过此接口设置主播自己本地的背景音乐的音量大小。
	  * volume 音量大小，100为正常音量，取值范围为0 - 100；默认值：100
	  */
	@objc(setMusicPlayoutVolume:withResolver:withRejecter:)
	  public func setMusicPlayoutVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32,
			 let volume = param["volume"] as? Int {
			  txAudioEffectManager.setMusicPlayoutVolume(id, volume: volume);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 设置全局背景音乐的本地和远端音量的大小
	  */
	@objc(setAllMusicVolume:withResolver:withRejecter:)
	  public func setAllMusicVolume(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let volume = param["volume"] as? Int {
			  txAudioEffectManager.setAllMusicVolume(volume);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 调整背景音乐的音调高低
	  * pitch	音调，默认值是0.0f，范围是：[-1 ~ 1] 之间的浮点数
	  */
	@objc(setMusicPitch:withResolver:withRejecter:)
	  public func setMusicPitch(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let volume = param["volume"] as? Int32,
			 let pitch = Double.init((param["pitch"] as? String)!) {
			  txAudioEffectManager.setMusicPitch(volume, pitch: pitch);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 调整背景音乐的变速效果
	  * speedRate	速度，默认值是1.0f，范围是：[0.5 ~ 2] 之间的浮点数
	  */
	@objc(setMusicSpeedRate:withResolver:withRejecter:)
	  public func setMusicSpeedRate(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32,
			 let speedRate = Double.init((param["speedRate"] as? String)!) {
			  txAudioEffectManager.setMusicSpeedRate(id, speedRate: speedRate);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 获取背景音乐当前的播放进度（单位：毫秒）
	  */
	@objc(getMusicCurrentPosInMS:withResolver:withRejecter:)
	  public func getMusicCurrentPosInMS(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32 {
			  let ms = txAudioEffectManager.getMusicCurrentPos(inMS: id);
			  result(ms);
		  }
	  }
	  
	  /**
	  * 设置背景音乐的播放进度（单位：毫秒）
	  */
	@objc(seekMusicToPosInMS:withResolver:withRejecter:)
	  public func seekMusicToPosInMS(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  if let id = param["id"] as? Int32,
			 let pts = param["pts"] as? Int {
			  txAudioEffectManager.seekMusicToPos(inMS: id, pts: pts);
			  result(nil);
		  }
	  }
	  
	  /**
	  * 获取景音乐文件的总时长（单位：毫秒）
	  */
	@objc(getMusicDurationInMS:withResolver:withRejecter:)
	  public func getMusicDurationInMS(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		  let path = ["path"] as? String
		  let res = txAudioEffectManager.getMusicDuration(inMS: path != nil ? path! : "");
		  result(res);
	  }
	// audio end
//	device begin
	/**
		* 切换摄像头
		*/
	  @objc(switchCamera:withResolver:withRejecter:)
		func switchCamera(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let isFrontCamera = param["isFrontCamera"] as? Bool {
				txDeviceManager.switchCamera(isFrontCamera);
				result(nil);
			}
		}
		
		/**
		* 查询是前置摄像头
		*/
	  @objc(isFrontCamera:withRejecter:)
		func isFrontCamera(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			result(txDeviceManager.isFrontCamera());
		}
		
		/**
		* 查询摄像头最大缩放率
		*/
	  @objc(getCameraZoomMaxRatio:withRejecter:)
		func getCameraZoomMaxRatio(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			result(Int(txDeviceManager.getCameraZoomMaxRatio()));
		}
		
		/**
		* 设置摄像头缩放率
		*/
	  @objc(setCameraZoomRatio:withResolver:withRejecter:)
		func setCameraZoomRatio(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let value = param["value"] as? String {
				let ret = txDeviceManager.setCameraZoomRatio(CGFloat(Int(Float(value)!)));
				result(ret);
			}
		}
		
		/**
		* 设置摄像头缩放率
		*/
	  @objc(enableCameraAutoFocus:withResolver:withRejecter:)
		func enableCameraAutoFocus(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let enable = param["enable"] as? Bool {
				result(txDeviceManager.enableCameraAutoFocus(enable));
			}
		}
		
		/**
		* 设置摄像头闪光灯，开启后置摄像头才有效果
		*/
	  @objc(enableCameraTorch:withResolver:withRejecter:)
		func enableCameraTorch(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let enable = param["enable"] as? Bool {
				txDeviceManager.enableCameraTorch(enable);
				result(nil);
			}
		}
		
		/**
		* 设置对焦位置
		*/
	  @objc(setCameraFocusPosition:withResolver:withRejecter:)
		func setCameraFocusPosition(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let x = param["x"] as? Int,
			   let y = param["y"] as? Int {
				txDeviceManager.setCameraFocusPosition(CGPoint(x: CGFloat(x), y: CGFloat(y)));
				result(nil);
			}
		}
		
		/**
		* 查询摄像头是否自动对焦
		*/
	  @objc(isAutoFocusEnabled:withRejecter:)
		func isAutoFocusEnabled(result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			result(txDeviceManager.isAutoFocusEnabled());
		}
		
		/**
		* 设置通话时使用的系统音量类型
		*/
	  @objc(setSystemVolumeType:withResolver:withRejecter:)
		func setSystemVolumeType(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let type = param["type"] as? Int {
				txDeviceManager.setSystemVolumeType(TXSystemVolumeType(rawValue: type)!);
				result(nil);
			}
		}
		
		/**
		* 设置音频路由
		*/
	  @objc(setAudioRoute:withResolver:withRejecter:)
		func setAudioRoute(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let route = param["route"] as? Int {
				txDeviceManager.setAudioRoute(TXAudioRoute(rawValue: route)!);
				result(nil);
			}
		}
//	device end

// beauty manager begin
		/**
		* 设置美颜、美白以及红润效果级别
		*/
		@objc(setBeautyStyle:withResolver:withRejecter:)
		func setBeautyStyle(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let beautyStyle = param["beautyStyle"] as? Int {
				txBeautyManager.setBeautyStyle(TXBeautyStyle(rawValue: beautyStyle)!);
				result(nil);
			}
		}
		/**
		* 设置指定素材滤镜特效
		* image 指定素材，即颜色查找表图片。必须使用 png 格式
		*/
		@objc(setFilter:withResolver:withRejecter:)
		func setFilter(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let imageUrl = param["imageUrl"] as? String {
//				let img = NSImage(contentsOfFile:self.getFlutterBundlePath(assetPath:imageUrl)!)!;
//				txBeautyManager.setFilter(img);
				result(nil);
			}
		}
		/**
		* 设置滤镜浓度
		*/
		@objc(setFilterStrength:withResolver:withRejecter:)
		func setFilterStrength(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let strength = param["strength"] as? String {
				txBeautyManager.setFilterStrength(Float(strength)!);
				result(nil);
			}
		}
		/**
		* 设置美颜级别
		*/
		@objc(setBeautyLevel:withResolver:withRejecter:)
		func setBeautyLevel(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let beautyLevel = param["beautyLevel"] as? Int {
				txBeautyManager.setBeautyLevel(Float(beautyLevel));
				result(nil);
			}
		}
		/**
		* 设置美白级别
		*/
		@objc(setWhitenessLevel:withResolver:withRejecter:)
		func setWhitenessLevel(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let whitenessLevel = param["whitenessLevel"] as? Int {
				txBeautyManager.setWhitenessLevel(Float(whitenessLevel));
				result(nil);
			}
		}
		/**
		* 设置红润级别
		*/
		@objc(setRuddyLevel:withResolver:withRejecter:)
		func setRuddyLevel(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let ruddyLevel = param["ruddyLevel"] as? Float {
				txBeautyManager.setRuddyLevel(ruddyLevel);
				result(nil);
			}
		}
		/**
		* 开启清晰度增强
		*/
		@objc(enableSharpnessEnhancement:withResolver:withRejecter:)
		func enableSharpnessEnhancement(param: NSDictionary, result: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
			if let enable = param["enable"] as? Bool {
				txBeautyManager.enableSharpnessEnhancement(enable);
				result(nil);
			}
		}
// beauty manager end
	
	// Listener begin
	public func sendEventFormat(name: String, params: Any?) {
		sendEvent(withName: "onListener", body: ["type": name, "params": params]);
	}
  /**
	* 错误回调，表示 SDK 不可恢复的错误，一定要监听并分情况给用户适当的界面提示。
	*/
	public func onError(_ errCode: TXLiteAVError, errMsg: String?, extInfo: [AnyHashable: Any]?) {
		sendEventFormat(name: "onError", params: ["errCode": errCode.rawValue, "errMsg": errMsg ?? "", "extraInfo": extInfo as Any]);
	}
	
	/**
	* 警告回调，用于告知您一些非严重性问题，例如出现了卡顿或者可恢复的解码失败。
	*/
	public func onWarning(_ warningCode: TXLiteAVWarning, warningMsg: String?, extInfo: [AnyHashable: Any]?) {
		sendEventFormat(name: "onWarning", params: ["warningCode": warningCode.rawValue, "warningMsg": warningMsg  ?? "", "extraInfo": extInfo as Any]);
	}
	
	/**
	* 已加入房间的回调
	*/
	public func onEnterRoom(_ result: Int) {
		sendEventFormat(name: "onEnterRoom", params: ["result": result]);
	}
	
	/**
	* 离开房间的事件回调
	*/
	public func onExitRoom(_ reason: Int) {
		sendEventFormat(name: "onExitRoom", params: ["reason": reason]);
	}
	
	/**
	* 切换角色的事件回调
	*/
	public func onSwitchRole(_ errCode: TXLiteAVError, errMsg: String?) {
		sendEventFormat(name: "onSwitchRole", params: ["errCode": errCode.rawValue, "errMsg": errMsg ?? ""]);
	}
	
	/**
	* 请求跨房通话（主播 PK）的结果回调
	*/
	public func onConnectOtherRoom(_ userId: String, errCode: TXLiteAVError, errMsg: String?) {
		sendEventFormat(name: "onConnectOtherRoom", params: ["userId": userId, "errCode": errCode.rawValue, "errMsg": errMsg ?? ""]);
	}
	
	/**
	* 切换房间 (switchRoom) 的结果回调
	*/
	public func onSwitchRoom(_ errCode: TXLiteAVError, errMsg: String?) {
		sendEventFormat(name: "onSwitchRoom", params: ["errCode": errCode.rawValue, "errMsg": errMsg ?? ""]);
	}
	
	/**
	* 结束跨房通话（主播 PK）的结果回调
	*/
	public func onDisconnectOtherRoom(_ errCode: TXLiteAVError, errMsg: String?) {
		sendEventFormat(name: "onDisConnectOtherRoom", params: ["errCode": errCode.rawValue, "errMsg": errMsg ?? ""]);
	}
	
	/**
	* 有用户加入当前房间
	*/
	public func onRemoteUserEnterRoom(_ userId: String) {
		sendEventFormat(name: "onRemoteUserEnterRoom", params: ["userId": userId]);
	}
	
	/**
	* 有用户离开当前房间
	*/
	public func onRemoteUserLeaveRoom(_ userId: String, reason: Int) {
		sendEventFormat(name: "onRemoteUserLeaveRoom", params: ["userId": userId, "reason": reason]);
	}
	
	/**
	* 有用户上传视频数据
	*/
	public func onUserVideoAvailable(_ userId: String, available: Bool) {
		sendEventFormat(name: "onUserVideoAvailable", params: ["userId": userId, "available": available]);
	}
	
	/**
	* 远端用户是否存在可播放的辅路画面（一般用于屏幕分享）
	*/
	public func onUserSubStreamAvailable(_ userId: String, available: Bool) {
		sendEventFormat(name: "onUserSubStreamAvailable", params: ["userId": userId, "available": available]);
	}
	
	/**
	* 远端用户是否存在可播放的音频数据
	*/
	public func onUserAudioAvailable(_ userId: String, available: Bool) {
		sendEventFormat(name: "onUserAudioAvailable", params: ["userId": userId, "available": available]);
	}
	
	/**
	* 开始渲染本地或远程用户的首帧画面。
	*/
	public func onFirstVideoFrame(_ userId: String, streamType: TRTCVideoStreamType, width: Int32, height: Int32) {
		sendEventFormat(name: "onFirstVideoFrame", params: ["userId": userId, "streamType": streamType.rawValue, "width": width, "height": height]);
	}
	
	/**
	* 开始播放远程用户的首帧音频（本地声音暂不通知）
	*/
	public func onFirstAudioFrame(_ userId: String) {
		sendEventFormat(name: "onFirstAudioFrame", params: ["userId": userId]);
	}
	
	/**
	* 首帧本地视频数据已经被送出
	*/
	public func onSendFirstLocalVideoFrame(_ streamType: TRTCVideoStreamType) {
		sendEventFormat(name: "onSendFirstLocalVideoFrame", params: ["streamType": streamType.rawValue]);
	}
	
	/**
	* 首帧本地音频数据已经被送出
	*/
	public func onSendFirstLocalAudioFrame() {
		sendEventFormat(name: "onSendFirstLocalAudioFrame", params: nil);
	}
	
	/**
	* 网络质量：该回调每2秒触发一次，统计当前网络的上行和下行质量。
	*/
	public func onNetworkQuality(_ localQuality: TRTCQualityInfo, remoteQuality: [TRTCQualityInfo]) {
		var array: [Any] = [];
		
		for item in remoteQuality {
			array.append(["userId": item.userId as Any, "quality": item.quality.rawValue]);
		}
		
		sendEventFormat(name: "onNetworkQuality", params: [
			"localQuality": [
				"userId": localQuality.userId as Any,
				"quality": localQuality.quality.rawValue
			],
			"remoteQuality": array
		]);
	}
	
	/**
	* 技术指标统计回调
	*/
	public func onStatistics(_ statistics: TRTCStatistics) {
		var localArray: [Any] = [];
		var remoteArray: [Any] = [];
		
		for item in statistics.localStatistics {
			localArray.append([
				"width": item.width,
				"height": item.height,
				"frameRate": item.frameRate,
				"videoBitrate": item.videoBitrate,
				"audioSampleRate": item.audioSampleRate,
				"audioBitrate": item.audioBitrate,
				"streamType": item.streamType.rawValue
			]);
		}
		
		for item in statistics.remoteStatistics {
			remoteArray.append([
				"userId": item.userId as Any,
				"finalLoss": item.finalLoss,
				"width": item.width,
				"height": item.height,
				"frameRate": item.frameRate,
				"videoBitrate": item.videoBitrate,
				"audioSampleRate": item.audioSampleRate,
				"audioBitrate": item.audioBitrate,
				"jitterBufferDelay": item.jitterBufferDelay,
				"audioTotalBlockTime": item.audioTotalBlockTime,
				"audioBlockRate": item.audioBlockRate,
				"videoTotalBlockTime": item.videoTotalBlockTime,
				"videoBlockRate": item.videoBlockRate,
				"streamType": item.streamType.rawValue
			]);
		}
		sendEventFormat(name: "onStatistics", params: [
			"upLoss": statistics.upLoss,
			"downLoss": statistics.downLoss,
			"appCpu": statistics.appCpu,
			"systemCpu": statistics.systemCpu,
			"rtt": statistics.rtt,
			"receivedBytes": statistics.receivedBytes,
			"sendBytes": statistics.sentBytes,
			"localArray": localArray,
			"remoteArray": remoteArray
		]);
	}
	
	/**
	* SDK 跟服务器的连接断开
	*/
	public func onConnectionLost() {
		sendEventFormat(name: "onConnectionLost", params: nil);
	}
	
	/**
	* SDK 尝试重新连接到服务器
	*/
	public func onTryToReconnect() {
		sendEventFormat(name: "onTryToReconnect", params: nil);
	}
	
	/**
	* SDK 跟服务器的连接恢复
	*/
	public func onConnectionRecovery() {
		sendEventFormat(name: "onConnectionRecovery", params: nil);
	}
	
	/**
	* 摄像头准备就绪
	*/
	public func onCameraDidReady() {
		sendEventFormat(name: "onCameraDidReady", params: nil);
	}
	
	/**
	* 麦克风准备就绪
	*/
	public func onMicDidReady() {
		sendEventFormat(name: "onMicDidReady", params: nil);
	}
	
	/**
	* 音频路由发生变化（仅 iOS），音频路由即声音由哪里输出（扬声器或听筒）
	*/
	public func onAudioRouteChanged(_ route: TRTCAudioRoute, from fromRoute: TRTCAudioRoute) {
		sendEventFormat(name: "onAudioRouteChanged", params: ["newRoute": route.rawValue, "oldRoute": fromRoute.rawValue]);
	}
	
	
	/**
	* 用于提示音量大小的回调，包括每个 userId 的音量和远端总音量
	*/
	public func onUserVoiceVolume(_ userVolumes: [TRTCVolumeInfo], totalVolume: Int) {
		var userVolumeArray: [Any] = [];
		for item in userVolumes {
			userVolumeArray.append([
				"userId": (item.userId == nil) ? "" : (item.userId!),
				"volume": item.volume
			]);
		}
		
		sendEventFormat(name: "onUserVoiceVolume", params: ["userVolumes": userVolumeArray, "totalVolume": totalVolume]);
	}
	
	/**
	* 收到自定义消息回调
	*/
	public func onRecvCustomCmdMsgUserId(_ userId: String, cmdID: Int, seq: UInt32, message: Data) {
		sendEventFormat(name: "onRecvCustomCmdMsg", params: [
			"userId": userId,
			"cmdID": cmdID,
			"seq": seq,
			"message": (String(data: message, encoding: String.Encoding.utf8) as String?) ?? ""
		]);
	}
	
	/**
	* 自定义消息丢失回调
	*/
	public func onMissCustomCmdMsgUserId(_ userId: String, cmdID: Int, errCode: Int, missed: Int) {
		sendEventFormat(name: "onMissCustomCmdMsg", params: [
			"userId": userId,
			"cmdID": cmdID,
			"errCode": errCode,
			"missed": missed
		]);
	}
	
	/**
	* 收到 SEI 消息的回调
	*/
	public func onRecvSEIMsg(_ userId: String, message: Data) {
		sendEventFormat(name: "onRecvSEIMsg", params: [
			"userId": userId,
			"message": (String(data: message, encoding: String.Encoding.utf8) as String?) ?? ""
		]);
	}
	
	/**
	* 开始向腾讯云的直播 CDN 推流的回调，对应于 TRTCCloud 中的 startPublishing() 接口
	*/
	public func onStartPublishing(_ err: Int32, errMsg: String) {
		sendEventFormat(name: "onStartPublishing", params: [
			"errCode": err,
			"errMsg": errMsg
		]);
	}
	
	/**
	* 停止向腾讯云的直播 CDN 推流的回调，对应于 TRTCCloud 中的 stopPublishing() 接口
	*/
	public func onStopPublishing(_ err: Int32, errMsg: String) {
		sendEventFormat(name: "onStopPublishing", params: [
			"errCode": err,
			"errMsg": errMsg
		]);
	}
	
	/**
	* 开始向腾讯云的直播 CDN 推流的回调，对应于 TRTCCloud 中的 startPublishing() 接口
	*/
	public func onStartPublishCDNStream(_ err: Int32, errMsg: String) {
		sendEventFormat(name: "onStartPublishCDNStream", params: [
			"errCode": err,
			"errMsg": errMsg
		]);
	}
	
	/**
	* 停止向腾讯云的直播 CDN 推流的回调，对应于 TRTCCloud 中的 stopPublishing() 接口
	*/
	public func onStopPublishCDNStream(_ err: Int32, errMsg: String) {
		sendEventFormat(name: "onStopPublishCDNStream", params: [
			"errCode": err,
			"errMsg": errMsg
		]);
	}
	
	/**
	* 设置云端的混流转码参数的回调，对应于 TRTCCloud 中的 setMixTranscodingConfig() 接口。
	*/
	public func onSetMixTranscodingConfig(_ err: Int32, errMsg: String) {
		sendEventFormat(name: "onSetMixTranscodingConfig", params: [
			"errCode": err,
			"errMsg": errMsg
		]);
	}
	
	/**
	* 播放音效结束回调
	*/
	public func onAudioEffectFinished(_ effectId: Int32, code: Int32) {
		sendEventFormat(name: "onAudioEffectFinished", params: [
			"effectId": effectId,
			"errCode": code
		]);
	}
	
	/**
	* 当屏幕分享开始时，SDK 会通过此回调通知
	*/
	public func onScreenCaptureStarted() {
		sendEventFormat(name: "onScreenCaptureStarted", params:nil);
	}

	/**
	* 当屏幕分享暂停时，SDK 会通过此回调通知
	*/
	public func onScreenCapturePaused(_ reason:Int32) {
		sendEventFormat(name: "onScreenCapturePaused", params:reason);
	}

	/**
	* 当屏幕分享恢复时，SDK 会通过此回调通知
	*/
	public func onScreenCaptureResumed(_ reason:Int32) {
		sendEventFormat(name: "onScreenCaptureResumed", params:reason);
	}

	/**
	* 当屏幕分享停止时，SDK 会通过此回调通知
	*/
	public func onScreenCaptureStoped(_ reason:Int32) {
		sendEventFormat(name: "onScreenCaptureStoped", params:reason);
	}
	// Listener end
}
