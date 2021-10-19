//
//  TrtcEvents.swift
//  react-native-trtc-react-native-sdk
//
//  Created by 林智 on 2021/10/18.
//

import Foundation
import TXLiteAVSDK_TRTC


class TrtcEvents: RCTEventEmitter, TRTCCloudDelegate {
	override func supportedEvents() -> [String]! {
//		var events = [String]()
//		RtcEngineEvents.toMap().forEach { key, value in
//			events.append("\(RtcEngineEventHandler.PREFIX)\(value)")
//		}
		return ["onListener"]
	}
	

}
