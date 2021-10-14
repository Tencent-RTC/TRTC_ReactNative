export class TRTCCloudDef {
  static TRTCRoleAnchor: number = 20;
}

/// 进房参数
///
/// 作为 TRTC SDK 的进房参数，只有该参数填写正确，才能顺利进入 roomId 所指定的音视频房间
export class TRTCParams {
  /// 【字段含义】应用标识 [必填]，腾讯视频云基于 sdkAppId 进行计费统计。
  ///
  /// 【推荐取值】在 实时音视频控制台 创建应用后可以在账号信息页面中得到该 ID
  sdkAppId: number;

  /// 【字段含义】用户标识 [必填]，当前用户的 userId，相当于用户名。
  ///
  /// 推荐取值】限制长度为32字节，只允许包含大小写英文字母（a-zA-Z）、数字（0-9）及下划线和连词符。
  userId: string; // 用户id

  /// 【字段含义】用户签名 [必填]，当前 userId 对应的验证签名，相当于使用云服务的登录密码。
  ///
  /// 【推荐取值】具体计算方法请参见 [如何计算UserSig](https://cloud.tencent.com/document/product/647/17275)。
  userSig: string; // 用户签名

  ///【字段含义】房间号码 [必填] ，在同一个房间里的用户（userId）可以彼此看到对方并进行视频通话
  ///
  /// 【推荐取值】取值范围：1 - 4294967294。
  roomId?: number; // 房间号

  /// 字符串房间号码，在同一个房间内的用户（userId）可以看到彼此并进行视频通话。
  ///
  /// 推荐取值：限制长度为64字节。以下为支持的字符集范围（共 89 个字符）: -大小写英文字母（a-zA-Z）； -数字（0-9）； -空格、"!"、"#"、"$"、"%"、"&"、"("、")"、"+"、"-"、":"、";"、"<"、"="、"."、">"、"?"、"@"、"["、"]"、"^"、"_"、" {"、"}"、"|"、"~"、","。
  ///
  /// roomId 与 strRoomId 必填一个，若您选用 strRoomId，则 roomId 需要填写为0。若两者都填，将优先选用 roomId。 请注意，同一个 sdkAppId 互通时，请务必选用同一种房间号码类型，避免影响互通。
  strRoomId?: string; // 房间号

  /// 【字段含义】直播场景下的角色，SDK 用这个参数确定用户是主播还是观众[直播场景下必填，通话场景下不填写]。
  ///
  /// 【特别说明】仅适用于直播场景（TRTC_APP_SCENE_LIVE 和 TRTC_APP_SCENE_VOICE_CHATROOM），通话场景（AUDIOCALL 和 VIDEOCALL）下指定无效。
  ///
  /// 【推荐取值】默认值：主播（TRTCRoleAnchor）
  role?: number; // 角色

  /// 【字段含义】绑定腾讯云直播 CDN 流 ID[非必填]，设置之后，您就可以在腾讯云直播 CDN 上通过标准直播方案（FLV或HLS）播放该用户的音视频流。
  ///
  /// 【推荐取值】限制长度为64字节，可以不填写，一种推荐的方案是使用 “sdkappid_roomid_userid_main” 作为 streamid，这样比较好辨认且不会在您的多个应用中发生冲突。
  ///
  /// 【特殊说明】要使用腾讯云直播 CDN，您需要先在控制台 中的功能配置页开启“启用旁路直播”开关。
  ///
  /// 【参考文档】[CDN 旁路直播](https://cloud.tencent.com/document/product/647/16826)。
  streamId?: string; // 自定义流id

  /// [字段含义】云端录制开关，用于指定是否要在云端将该用户的音视频流录制成指定格式的文件。
  ///
  /// 【推荐取值】限制长度为64字节，只允许包含大小写英文字母（a-zA-Z）、数字（0-9）及下划线和连词符。
  ///
  /// 【参考文档】[云端录制](https://cloud.tencent.com/document/product/647/16823)。
  userDefineRecordId?: string; // 云端录制开关，用于指定是否要在云端将该用户的音视频流录制成指定格式的文件

  /// 【字段含义】房间签名 [非必填]，当您希望某个房间只能让特定的 userId 进入时，需要使用 privateMapKey 进行权限保护。
  ///
  /// 【推荐取值】仅建议有高级别安全需求的客户使用，更多详情请参见 [进房权限保护](https://cloud.tencent.com/document/product/647/32240)。
  privateMapKey?: string; // 房间签名 [非必填]，当您希望某个房间只能让特定的 userId 进入时，需要使用 privateMapKey 进行权限保护。

  /// 业务数据 [非必填] 某些非常用的特殊需求才需要用到此字段。
  ///
  /// 【推荐取值】不建议使用
  businessInfo?: string; // 业务数据 [非必填] 某些非常用的特殊需求才需要用到此字段。

  constructor(params: {
    sdkAppId: number;
    userId: string;
    userSig: string;
    roomId?: number;
    strRoomId?: string;
    role?: number;
    streamId?: string;
    userDefineRecordId?: string;
    privateMapKey?: string;
    businessInfo?: string;
  }) {
    this.sdkAppId = params.sdkAppId;
    this.userId = params.userId;
    this.userSig = params.userSig;
    this.roomId = params.roomId ? params.roomId : 0;
    this.strRoomId = params.strRoomId ? params.strRoomId : '';
    this.role = params.role ? params.role : TRTCCloudDef.TRTCRoleAnchor;
    this.streamId = params.streamId ? params.streamId : '';
    this.userDefineRecordId = params.userDefineRecordId
      ? params.userDefineRecordId
      : '';
    this.privateMapKey = params.privateMapKey ? params.privateMapKey : '';
    this.businessInfo = params.businessInfo ? params.businessInfo : '';
    console.log('this', this);
  }
}
