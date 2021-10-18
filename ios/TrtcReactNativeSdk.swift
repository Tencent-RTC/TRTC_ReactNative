import TXLiteAVSDK_TRTC

@objc(TrtcReactNativeSdk)
class TrtcReactNativeSdk: NSObject {
	
	private var txCloudManager: TRTCCloud = TRTCCloud.sharedInstance();

	@objc(sharedInstance:resolver:withRejecter:)
	func sharedInstance(a: Int, resolve: @escaping RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
//		TRTCCloud.sharedInstance();
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
}
