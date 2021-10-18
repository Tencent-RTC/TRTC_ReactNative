#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(TrtcReactNativeSdk, NSObject)

RCT_EXTERN_METHOD(sharedInstance:(int)a
				 resolver:(RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getSDKVersion: (RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
				  withMap:(NSDictionary)map
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(enterRoom:(NSDictionary)params
				  withScene:(int)scene
				 withResolver:(RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(exitRoom:(RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(getAudioEffectManager:(RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)
                 
RCT_EXTERN_METHOD(getDeviceManager:(RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)


RCT_EXTERN_METHOD(isFrontCamera:(RCTPromiseResolveBlock)resolve
				 withRejecter:(RCTPromiseRejectBlock)reject)




@end
