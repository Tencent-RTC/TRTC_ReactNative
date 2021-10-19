import TXLiteAVSDK_TRTC

@objc(TrtcReactNativeSdk)
class TrtcReactNativeSdk: RCTEventEmitter, TRTCCloudDelegate {
	private var hasListeners = false
	
	override func supportedEvents() -> [String]! {
//		var events = [String]()
//		RtcEngineEvents.toMap().forEach { key, value in
//			events.append("\(RtcEngineEventHandler.PREFIX)\(value)")
//		}
		return ["EventReminder"]
	}

	

	
	
	
	private var txCloudManager: TRTCCloud = TRTCCloud.sharedInstance();

	@objc(sharedInstance:withRejecter:)
	func sharedInstance(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
//		cloudManager = CloudManager(registrar: TencentTRTCCloud.registrar);
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
		resolve(0);
	}
	
	
	@objc(isFrontCamera:withRejecter:)
	func isFrontCamera(resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
		resolve(txCloudManager.getDeviceManager()?.isFrontCamera());
	}
	
	
	
	public func sendEventFormat(name: String, params: Any?) {
		sendEvent(withName: "EventReminder", body: ["type": name, "params": params]);
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
		sendEventFormat(name: "onEnterRoom", params: result);
	}
	
	/**
	* 离开房间的事件回调
	*/
	public func onExitRoom(_ reason: Int) {
		sendEventFormat(name: "onExitRoom", params: reason);
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
		sendEventFormat(name: "onRemoteUserEnterRoom", params: userId);
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
		sendEventFormat(name: "onFirstAudioFrame", params: userId);
	}
	
	/**
	* 首帧本地视频数据已经被送出
	*/
	public func onSendFirstLocalVideoFrame(_ streamType: TRTCVideoStreamType) {
		sendEventFormat(name: "onSendFirstLocalVideoFrame", params: streamType.rawValue);
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
}
