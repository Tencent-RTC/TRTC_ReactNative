//
//  TRTCVideoView.m
//  RNTRTC
//
//

#import "TRTCVideoView.h"
#import <Foundation/Foundation.h>
#import "TXLiteAVSDK_TRTC/TRTCCloud.h"

@implementation TRTCVideoView

- (instancetype)init{
  
  if (self == [super init]) {
    _rtcEngine = [TRTCCloud sharedInstance];
  }
  
  return self;
}
-(void)setData:(NSDictionary*)data{
	NSLog(@"========>55 %@", self);
	
	
	NSString *userId = [data objectForKey:@"userId"];
	int streamType = [data[@"streamType"] intValue];
	
	if(![@"" isEqual: userId]){
		NSLog(@"========>55  %@ 111 %d 1111", userId, streamType);
		[self.rtcEngine startRemoteView:userId streamType: streamType view:self];
	}else{
		NSLog(@"========>51");
		[self.rtcEngine startLocalPreview: YES  view:self];
	}
}

-(void)setRenderParams:(NSDictionary*)renderParams{
	NSLog(@"========>5 %@", renderParams);
	NSString *userId = [renderParams objectForKey:@"userId"];
	int streamType = [renderParams objectForKey:@"streamType"];
	
	TRTCRenderParams *params = [TRTCRenderParams new];
	
	if ([renderParams objectForKey:@"rotation"]) {
		params.rotation = [renderParams[@"rotation"] intValue];
	}
	if ([renderParams objectForKey:@"fillMode"]) {
		params.fillMode = [renderParams[@"fillMode"] intValue];
	}
	if ([renderParams objectForKey:@"mirrorType"]) {
		params.mirrorType = [renderParams[@"mirrorType"] intValue];
	}
	
	if(![@"" isEqual: userId]){
		NSLog(@"========>54");
		[self.rtcEngine setRemoteRenderParams:userId streamType: streamType params:params];
	}else{
		NSLog(@"========>52");
		[self.rtcEngine setLocalRenderParams: params];
	}
}


@end
