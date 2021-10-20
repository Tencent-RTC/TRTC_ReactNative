// export class TRTCCloudDef {
//   static TRTCRoleAnchor: number = 20;
// }

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
  }
}

/// 关键类型定义变量
export class TRTCCloudDef {
  static TRTC_SDK_VERSION: String = '0.0.0.0';

  // @name 1.1 视频分辨率
  /// 此处仅定义横屏分辨率，如需使用竖屏分辨率（例如360 × 640），需要同时指定 TRTCVideoResolutionMode 为 Portrait。

  // 宽高比1:1
  /// 建议码率 VideoCall:80kbps   LIVE:120kbps
  static TRTC_VIDEO_RESOLUTION_120_120: number = 1;

  /// 建议码率 VideoCall:100kbps  LIVE:150kbps
  static TRTC_VIDEO_RESOLUTION_160_160: number = 3;

  /// 建议码率 VideoCall:200kbps  LIVE:120kbps
  static TRTC_VIDEO_RESOLUTION_270_270: number = 5;

  /// 建议码率 VideoCall:350kbps  LIVE:120kbps
  static TRTC_VIDEO_RESOLUTION_480_480: number = 7;

  // 宽高比4:3
  /// 建议码率 VideoCall:100kbps  LIVE:150kbps
  static TRTC_VIDEO_RESOLUTION_160_120: number = 50;

  /// 建议码率 VideoCall:150kbps  LIVE:225kbps
  static TRTC_VIDEO_RESOLUTION_240_180: number = 52;

  /// 建议码率 VideoCall:200kbps  LIVE:300kbps
  static TRTC_VIDEO_RESOLUTION_280_210: number = 54;

  /// 建议码率 VideoCall:250kbps  LIVE:375kbps
  static TRTC_VIDEO_RESOLUTION_320_240: number = 56;

  /// 建议码率 VideoCall:300kbps  LIVE:450kbps
  static TRTC_VIDEO_RESOLUTION_400_300: number = 58;

  /// 建议码率 VideoCall:400kbps  LIVE:600kbps
  static TRTC_VIDEO_RESOLUTION_480_360: number = 60;

  /// 建议码率 VideoCall:600kbps  LIVE:900kbps
  static TRTC_VIDEO_RESOLUTION_640_480: number = 62;

  /// 建议码率 VideoCall:1000kbps LIVE:1500kbps
  static TRTC_VIDEO_RESOLUTION_960_720: number = 64;

  // 宽高比16:9
  /// 建议码率 VideoCall:150kbps  LIVE:250kbps
  static TRTC_VIDEO_RESOLUTION_160_90: number = 100;

  /// 建议码率 VideoCall:200kbps  LIVE:300kbps
  static TRTC_VIDEO_RESOLUTION_256_144: number = 102;

  /// 建议码率 VideoCall:250kbps  LIVE:400kbps
  static TRTC_VIDEO_RESOLUTION_320_180: number = 104;

  /// 建议码率 VideoCall:350kbps  LIVE:550kbps
  static TRTC_VIDEO_RESOLUTION_480_270: number = 106;

  /// 建议码率 VideoCall:550kbps  LIVE:900kbps
  static TRTC_VIDEO_RESOLUTION_640_360: number = 108;

  /// 建议码率 VideoCall:850kbps  LIVE:1300kbps
  static TRTC_VIDEO_RESOLUTION_960_540: number = 110;

  /// 建议码率 VideoCall:1200kbps LIVE:1800kbps
  static TRTC_VIDEO_RESOLUTION_1280_720: number = 112;

  /// 建议码率 VideoCall:2000kbps LIVE:3000kbps
  static TRTC_VIDEO_RESOLUTION_1920_1080: number = 114;

  /**
   *  @name 1.2 视频宽高比模式
   *
   * - 横屏分辨率：TRTCVideoResolution_640_360 + TRTCVideoResolutionModeLandscape = 640 × 360
   * - 竖屏分辨率：TRTCVideoResolution_640_360 + TRTCVideoResolutionModePortrait  = 360 × 640
   *
   *
   */
  /// 横屏分辨率
  static TRTC_VIDEO_RESOLUTION_MODE_LANDSCAPE: number = 0;

  /// 竖屏分辨率
  static TRTC_VIDEO_RESOLUTION_MODE_PORTRAIT: number = 1;

  /**
   * @name 1.3 视频流类型
   *
   * TRTC 内部有三种不同的音视频流，分别是：
   * - 主画面：最常用的一条线路，一般用来传输摄像头的视频数据。
   * - 小画面：跟主画面的内容相同，但是分辨率和码率更低。
   * - 辅流画面：一般用于屏幕分享，以及远程播片（例如老师放一段视频给学生）。
   *
   * @note
   * - 如果主播的上行网络和性能比较好，则可以同时送出大小两路画面。
   * - SDK 不支持单独开启小画面，小画面必须依附于主画面而存在。
   *
   */
  /// 主画面视频流
  static TRTC_VIDEO_STREAM_TYPE_BIG: number = 0;

  /// 小画面视频流
  static TRTC_VIDEO_STREAM_TYPE_SMALL: number = 1;

  /// 辅流（屏幕分享）
  static TRTC_VIDEO_STREAM_TYPE_SUB: number = 2;

  /**
   * @name 1.4 视频（或网络）质量常量定义
   * TRTC SDK 对画质定义了六种不同的级别，Excellent 代表最好，Down 代表不可用。
   */
  /// 未定义
  static TRTC_QUALITY_UNKNOWN: number = 0;

  /// 最好
  static TRTC_QUALITY_Excellent: number = 1;

  /// 好
  static TRTC_QUALITY_Good: number = 2;

  /// 一般
  static TRTC_QUALITY_Poor: number = 3;

  /// 差
  static TRTC_QUALITY_Bad: number = 4;

  /// 很差
  static TRTC_QUALITY_Vbad: number = 5;

  /// 不可用
  static TRTC_QUALITY_Down: number = 6;

  /**
   * @name 1.5 视频画面填充模式
   * 如果画面的显示分辨率不等于画面的原始分辨率，就需要您设置画面的填充模式:
   * - TRTCVideoFillMode_Fill，图像铺满屏幕，超出显示视窗的视频部分将被裁剪，画面显示可能不完整。
   * - TRTCVideoFillMode_Fit，图像长边填满屏幕，短边区域会被填充黑色，画面的内容完整。
   */
  /// 图像铺满屏幕，超出显示视窗的视频部分将被裁剪
  static TRTC_VIDEO_RENDER_MODE_FILL: number = 0;

  /// 图像长边填满屏幕，短边区域会被填充黑色
  static TRTC_VIDEO_RENDER_MODE_FIT: number = 1;

  /**
   * @name 1.6 视频画面旋转方向
   * TRTC SDK 提供了对本地和远程画面的旋转角度设置 API，下列的旋转角度都是指顺时针方向的。
   */
  /// 不旋转
  static TRTC_VIDEO_ROTATION_0: number = 0;

  /// 顺时针旋转90度
  static TRTC_VIDEO_ROTATION_90: number = 1;

  /// 顺时针旋转180度
  static TRTC_VIDEO_ROTATION_180: number = 2;

  /// 顺时针旋转270度
  static TRTC_VIDEO_ROTATION_270: number = 3;

  /**
   * @name 1.7 美颜（磨皮）算法
   *
   * TRTC SDK 内置多种不同的磨皮算法，您可以选择最适合您产品定位的方案。
   *
   */
  /// 光滑，适用于美女秀场，效果比较明显。
  static TRTC_BEAUTY_STYLE_SMOOTH: number = 0;

  /// 自然，磨皮算法更多地保留了面部细节，主观感受上会更加自然。
  static TRTC_BEAUTY_STYLE_NATURE: number = 1;

  /// P图，磨皮相比光滑更加自然，相比光滑保留更多的皮肤细节。
  static TRTC_BEAUTY_STYLE_PITU: number = 2;

  /**
   * @name 1.8 视频像素格式
   *
   * TRTC SDK 提供针对视频的自定义采集和自定义渲染功能，在自定义采集功能中，您可以用下列枚举值描述您采集的视频像素格式。
   * 在自定义渲染功能中，您可以指定您期望 SDK 回调的视频像素格式。
   *
   */
  /// 未知
  static TRTC_VIDEO_PIXEL_FORMAT_UNKNOWN: number = 0;

  /// YUV I420
  static TRTC_VIDEO_PIXEL_FORMAT_I420: number = 1;

  /// OpenGL 2D 纹理
  static TRTC_VIDEO_PIXEL_FORMAT_Texture_2D: number = 2;

  static TRTC_VIDEO_PIXEL_FORMAT_TEXTURE_EXTERNAL_OES: number = 3;
  static TRTC_VIDEO_PIXEL_FORMAT_NV21: number = 4;

  /**
   * @name 1.9 本地视频画面预览镜像类型
   *
   * TRTC SDK 提供了对本地预览画面的镜像设置功能，默认是AUTO类型。
   */
  /// SDK 决定镜像方式：前置摄像头镜像，后置摄像头不镜像
  static TRTC_VIDEO_MIRROR_TYPE_AUTO: number = 0;

  /// 前置摄像头和后置摄像头都镜像
  static TRTC_VIDEO_MIRROR_TYPE_ENABLE: number = 1;

  /// 前置摄像头和后置摄像头都不镜像
  static TRTC_VIDEO_MIRROR_TYPE_DISABLE: number = 2;

  /**
   * @name 2.1 应用场景
   * TRTC 可用于视频会议和在线直播等多种应用场景，针对不同的应用场景，TRTC SDK 的内部会进行不同的优化配置：
   * - TRTC_APP_SCENE_VIDEOCALL：视频通话场景，适合[1对1视频通话]、[300人视频会议]、[在线问诊]、[视频聊天]、[远程面试]等。
   * - TRTC_APP_SCENE_LIVE：视频互动直播，适合[视频低延时直播]、[十万人互动课堂]、[视频直播 PK]、[视频相亲房]、[互动课堂]、[远程培训]、[超大型会议]等。
   * - TRTC_APP_SCENE_AUDIOCALL：语音通话场景，适合[1对1语音通话]、[300人语音会议]、[语音聊天]、[语音会议]、[在线狼人杀]等。
   * - TRTC_APP_SCENE_VOICE_CHATROOM：语音互动直播，适合：[语音低延时直播]、[语音直播连麦]、[语聊房]、[K 歌房]、[FM 电台]等。
   */
  /// 视频通话场景，支持720P、1080P高清画质，单个房间最多支持300人同时在线，最高支持50人同时发言。<br>

  /// 适合：[1对1视频通话]、[300人视频会议]、[在线问诊]、[视频聊天]、[远程面试]等。
  static TRTC_APP_SCENE_VIDEOCALL: number = 0;

  /// 视频互动直播，支持平滑上下麦，切换过程无需等待，主播延时小于300ms；支持十万级别观众同时播放，播放延时低至1000ms。<br>

  /// 适合：[视频低延时直播]、[十万人互动课堂]、[视频直播 PK]、[视频相亲房]、[互动课堂]、[远程培训]、[超大型会议]等。<br>

  /// 注意：此场景下，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。
  static TRTC_APP_SCENE_LIVE: number = 1;

  /// 语音通话场景，支持 48kHz，支持双声道。单个房间最多支持300人同时在线，最高支持50人同时发言。<br>

  /// 适合：[1对1语音通话]、[300人语音会议]、[语音聊天]、[语音会议]、[在线狼人杀]等。
  static TRTC_APP_SCENE_AUDIOCALL: number = 2;

  /// 语音互动直播，支持平滑上下麦，切换过程无需等待，主播延时小于300ms；支持十万级别观众同时播放，播放延时低至1000ms。<br>

  /// 适合：[语音低延时直播]、[语音直播连麦]、[语聊房]、[K 歌房]、[FM 电台]等。<br>

  /// 注意：此场景下，您必须通过 TRTCParams 中的 role 字段指定当前用户的角色。
  static TRTC_APP_SCENE_VOICE_CHATROOM: number = 3;

  /*
   * @name 2.2 角色，仅适用于直播场景（TRTC_APP_SCENE_LIVE 和 TRTC_APP_SCENE_VOICE_CHATROOM）
   *
   * 在直播场景中，多数用户仅为观众，个别用户是主播，这种角色区分有利于 TRTC 进行更好的定向优化。
   *
   * - Anchor：主播，可以上行视频和音频，一个房间里最多支持50个主播同时上行音视频。
   * - Audience：观众，只能观看，不能上行视频和音频，一个房间里的观众人数没有上限。
   */
  /// 主播
  static TRTCRoleAnchor: number = 20;

  /// 观众
  static TRTCRoleAudience: number = 21;

  /*
   * @name 2.3 流控模式
   *
   * TRTC SDK 内部需要时刻根据网络情况调整内部的编解码器和网络模块，以便能够对网络的变化做出反应。
   * 为了支持快速算法升级，SDK 内部设置了两种不同的流控模式：
   * - ModeServer：云端控制，默认模式，推荐选择。
   * - ModeClient：本地控制，用于 SDK 开发内部调试，客户请勿使用。
   *
   * @note 推荐您使用云端控制，这样每当我们升级 Qos 算法时，您无需升级 SDK 即可体验更好的效果。
   *
   */
  /// 客户端控制（用于 SDK 开发内部调试，客户请勿使用）
  static VIDEO_QOS_CONTROL_CLIENT: number = 0;

  /// 云端控制 （默认）
  static VIDEO_QOS_CONTROL_SERVER: number = 1;

  /*
   * @name 2.4 画质偏好
   *
   * 指当 TRTC SDK 在遇到弱网络环境时，您期望“保清晰”或“保流畅”，两种模式均会优先保障声音数据的传输。
   *
   * - Smooth：弱网下优先流畅性，当用户网络较差的时候画面也会比较模糊。
   * - Clear：默认值，弱网下优先清晰度，当用户网络较差的时候会出现卡顿，但画面清晰度不会大幅缩水。
   *
   */
  /// 弱网下保流畅
  static TRTC_VIDEO_QOS_PREFERENCE_SMOOTH: number = 1;

  /// 弱网下保清晰，默认值
  static TRTC_VIDEO_QOS_PREFERENCE_CLEAR: number = 2;

  /*
   * @name 3.1 音频采样率
   *
   * 音频采样率用来衡量声音的保真程度，采样率越高保真程度越好，如果您的应用场景有音乐的存在，推荐使用 TRTCAudioSampleRate48000。
   */
  /// 16k采样率
  static TRTCAudioSampleRate16000: number = 16000;

  /// 32采样率
  static TRTCAudioSampleRate32000: number = 32000;

  /// 44.1k采样率
  static TRTCAudioSampleRate44100: number = 44100;

  /// 48k采样率
  static TRTCAudioSampleRate48000: number = 48000;

  /**
   * @name 3.2 声音音质
   *
   * 音频音质用来衡量声音的保真程度。
   */
  /// 流畅音质：采样率：16k；单声道；音频裸码率：16kbps；适合语音通话为主的场景，比如在线会议，语音通话。
  static TRTC_AUDIO_QUALITY_SPEECH: number = 1;

  /// 默认音质：采样率：48k；单声道；音频裸码率：50kbps；SDK 默认的音频质量，如无特殊需求推荐选择之。
  static TRTC_AUDIO_QUALITY_DEFAULT: number = 2;

  /// 高音质：采样率：48k；双声道 + 全频带；音频裸码率：128kbps；适合需要高保真传输音乐的场景，比如K歌、音乐直播等。
  static TRTC_AUDIO_QUALITY_MUSIC: number = 3;

  /*
   * @name 3.3 声音播放模式（音频路由）
   *
   * 微信和手机 QQ 里的视频通话功能，都有一个免提模式，开启后就不用把手机贴在耳朵上，这个功能就是基于音频路由实现的。
   * 一般手机都有两个扬声器，设置音频路由的作用就是要决定声音从哪个扬声器播放出来：
   * - Speakerphone：扬声器，位于手机底部，声音偏大，适合外放音乐。
   * - Earpiece：听筒，位于手机顶部，声音偏小，适合通话。
   */
  /// 扬声器
  static TRTC_AUDIO_ROUTE_SPEAKER: number = 0;

  /// 听筒
  static TRTC_AUDIO_ROUTE_EARPIECE: number = 1;

  /*
   * @name 3.4 声音混响模式
   */
  /// 关闭混响
  static TRTC_REVERB_TYPE_0: number = 0;

  /// KTV
  static TRTC_REVERB_TYPE_1: number = 1;

  /// 小房间
  static TRTC_REVERB_TYPE_2: number = 2;

  /// 大会堂
  static TRTC_REVERB_TYPE_3: number = 3;

  /// 低沉
  static TRTC_REVERB_TYPE_4: number = 4;

  /// 洪亮
  static TRTC_REVERB_TYPE_5: number = 5;

  /// 金属声
  static TRTC_REVERB_TYPE_6: number = 6;

  /// 磁性
  static TRTC_REVERB_TYPE_7: number = 7;

  /*
   * @name 3.5 变声类型
   */
  /// 关闭变声
  static TRTC_VOICE_CHANGER_TYPE_0: number = 0;

  /// 熊孩子
  static TRTC_VOICE_CHANGER_TYPE_1: number = 1;

  /// 萝莉
  static TRTC_VOICE_CHANGER_TYPE_2: number = 2;

  /// 大叔
  static TRTC_VOICE_CHANGER_TYPE_3: number = 3;

  /// 重金属
  static TRTC_VOICE_CHANGER_TYPE_4: number = 4;

  /// 感冒
  static TRTC_VOICE_CHANGER_TYPE_5: number = 5;

  /// 外国人
  static TRTC_VOICE_CHANGER_TYPE_6: number = 6;

  /// 困兽
  static TRTC_VOICE_CHANGER_TYPE_7: number = 7;

  /// 死肥仔
  static TRTC_VOICE_CHANGER_TYPE_8: number = 8;

  /// 强电流
  static TRTC_VOICE_CHANGER_TYPE_9: number = 9;

  /// 重机械
  static TRTC_VOICE_CHANGER_TYPE_10: number = 10;

  /// 空灵
  static TRTC_VOICE_CHANGER_TYPE_11: number = 11;

  /*
   * @name 3.6 音频帧的格式
   */
  /// PCM
  static TRTC_AUDIO_FRAME_FORMAT_PCM: number = 1;

  /*
   * @name 3.7  系统音量类型
   *
   * 智能手机一般具备两种系统音量类型，即通话音量类型和媒体音量类型。
   * - 通话音量：手机专门为通话场景设计的音量类型，使用手机自带的回声抵消功能，音质相比媒体音量类型较差，
   *             无法通过音量按键将音量调成零，但是支持蓝牙耳机上的麦克风。
   *
   * - 媒体音量：手机专门为音乐场景设计的音量类型，音质相比于通话音量类型要好，通过通过音量按键可以将音量调成零。
   *             使用媒体音量类型时，如果要开启回声抵消（AEC）功能，SDK 会开启内置的声学处理算法对声音进行二次处理。
   *             在媒体音量模式下，蓝牙耳机无法使用自带的麦克风采集声音，只能使用手机上的麦克风进行声音采集。
   *
   * SDK 目前提供了三种系统音量类型的控制模式，分别为：
   * - Auto：“麦上通话，麦下媒体”，即主播上麦时使用通话音量，观众不上麦则使用媒体音量，适合在线直播场景。
   *         如果您在 enterRoom 时选择的场景为 TRTC_APP_SCENE_LIVE 或 TRTC_APP_SCENE_VOICE_CHATROOM，SDK 会自动选择该模式。
   *
   * - VOIP：全程使用通话音量，适合多人会议场景。
   *         如果您在 enterRoom 时选择的场景为 TRTC_APP_SCENE_VIDEOCALL 或 TRTC_APP_SCENE_AUDIOCALL，SDK 会自动选择该模式。
   *
   * - Media：通话全程使用媒体音量，不常用，适合个别有特殊需求（如主播外接声卡）的应用场景。
   *
   * @{
   */
  /// “麦上通话，麦下媒体”，即主播上麦时使用通话音量，观众不上麦则使用媒体音量，适合在线直播场景。<br>

  /// 如果您在 enterRoom 时选择的场景为 TRTC_APP_SCENE_LIVE 或 TRTC_APP_SCENE_VOICE_CHATROOM，SDK 会自动选择该模式。
  static TRTCSystemVolumeTypeAuto: number = 0;

  /// 通话全程使用媒体音量，不常用，适合个别有特殊需求（如主播外接声卡）的应用场景。
  static TRTCSystemVolumeTypeMedia: number = 1;

  /// 全程使用通话音量，适合多人会议场景。

  /// 如果您在 enterRoom 时选择的场景为 TRTC_APP_SCENE_VIDEOCALL 或 TRTC_APP_SCENE_AUDIOCALL，SDK 会自动选择该模式。
  static TRTCSystemVolumeTypeVOIP: number = 2;

  /*
   * @name 4.1 界面调试 Log
   */
  /// 界面不显示 Log
  static TRTC_DEBUG_VIEW_LEVEL_GONE: number = 0;

  /// 界面上半部分显示状态 Log
  static TRTC_DEBUG_VIEW_LEVEL_STATUS: number = 1;

  /// 界面上半部分显示状态 Log，下半部分显示关键事件
  static TRTC_DEBUG_VIEW_LEVEL_ALL: number = 2;

  /*
   * @name 4.2 Log 级别
   *
   * 不同的日志等级定义了不同的详实程度和日志数量，推荐一般情况下将日志等级设置为：TRTC_LOG_LEVEL_INFO。
   */
  /// 输出所有级别的 Log
  static TRTC_LOG_LEVEL_VERBOSE: number = 0;

  /// 输出 DEBUG，INFO，WARNING，ERROR 和 FATAL 级别的 Log
  static TRTC_LOG_LEVEL_DEBUG: number = 1;

  /// 输出 INFO，WARNING，ERROR 和 FATAL 级别的 Log
  static TRTC_LOG_LEVEL_INFO: number = 2;

  /// 输出 WARNING，ERROR 和 FATAL 级别的 Log
  static TRTC_LOG_LEVEL_WARN: number = 3;

  /// 只输出 ERROR 和 FATAL 级别的 Log
  static TRTC_LOG_LEVEL_ERROR: number = 4;

  /// 只输出 FATAL 级别的 Log
  static TRTC_LOG_LEVEL_FATAL: number = 5;

  /// 不输出任何 SDK Log
  static TRTC_LOG_LEVEL_NULL: number = 6;

  /**
   * @name 4.3 重力感应开关
   *
   * 此配置适用于 Phone 和 Pad 等移动设备：
   *
   * - Disable：视频上行的画面（也就是房间里的其它用户看到的当前用户的画面）不会跟随重力感应方向而自动调整。
   * - UIAutoLayout：默认值，视频上行的画面（也就是房间里的其它用户看到的当前用户的画面）会跟随当前界面的状态栏方向而自动调整。
   * - UIFixLayout：待废弃，效果等同于 UIAutoLayout。
   */
  ///  关闭重力感应。
  static TRTC_GSENSOR_MODE_DISABLE: number = 0;

  ///  开启重力感应，默认值。
  static TRTC_GSENSOR_MODE_UIAUTOLAYOUT: number = 1;

  ///  待废弃，效果等同于 UIAutoLayout。
  static TRTC_GSENSOR_MODE_UIFIXLAYOUT: number = 2;

  /**
   * @name 4.4 混流参数配置模式
   *
   */
  /// 非法值
  static TRTC_TranscodingConfigMode_Unknown: number = 0;

  /// 全手动模式，灵活性最高，可以自由组合出各种混流方案，但易用性最差。
  /// 此模式下，您需要填写 TRTCTranscodingConfig 中的所有参数，并需要监听 TRTCCloudDelegate 中的 onUserVideoAvailable() 和 onUserAudioAvailable() 回调，
  /// 以便根据当前房间中各个上麦用户的音视频状态不断地调整 mixUsers 参数，否则会导致混流失败。
  static TRTC_TranscodingConfigMode_Manual: number = 1;

  /// 纯音频模式，适用于语音通话（AudioCall）和语音聊天室（VoiceChatRoom）等纯音频场景。
  /// 只需要在进房后通过 setMixTranscodingConfig() 接口设置一次，之后 SDK 就会自动把房间内所有上麦用户的声音混流到当前用户的直播流上。
  /// 此模式下，您无需设置 TRTCTranscodingConfig 中的 mixUsers 参数，只需设置 audioSampleRate、audioBitrate 和 audioChannels 等参数。
  static TRTC_TranscodingConfigMode_Template_PureAudio: number = 2;

  /// 预排版模式，通过占位符提前对各路画面进行排布
  /// 此模式下，您依然需要设置 mixUsers 参数，但可以将 userId 设置为占位符，可选的占位符有：
  /// - "$PLACE_HOLDER_REMOTE$"     :  指代远程用户的画面，可以设置多个。
  /// - "$PLACE_HOLDER_LOCAL_MAIN$" ： 指代本地摄像头画面，只允许设置一个。
  /// - "$PLACE_HOLDER_LOCAL_SUB$"  :  指代本地屏幕分享画面，只允许设置一个。
  /// 但是您可以不需要监听 TRTCCloudDelegate 中的 onUserVideoAvailable() 和 onUserAudioAvailable() 回调进行实时调整，
  /// 只需要在进房成功后调用一次 setMixTranscodingConfig() 即可，之后 SDK 会自动将真实的 userId 补位到您设置的占位符上。
  static TRTC_TranscodingConfigMode_Template_PresetLayout: number = 3;

  /// 屏幕分享模式，适用于在线教育场景等以屏幕分享为主的应用场景，仅支持 Windows 和 Mac 两个平台的 SDK。
  /// SDK 会先根据您（通过 videoWidth 和 videoHeight 参数）设置的目标分辨率构建一张画布，
  /// 当老师未开启屏幕分享时，SDK 会将摄像头画面等比例拉伸绘制到该画布上；当老师开启屏幕分享之后，SDK 会将屏幕分享画面绘制到同样的画布上。
  /// 这样操作的目的是为了确保混流模块的输出分辨率一致，避免课程回放和网页观看的花屏问题（网页播放器不支持可变分辨率）。
  /// 同时，连麦学生的声音会被默认混合到老师的音视频流中。
  ///
  /// 由于教学模式下的视频内容以屏幕分享为主，因此同时传输摄像头画面和屏幕分享画面是非常浪费带宽的。
  /// 推荐的做法是直接将摄像头画面通过 setLocalVideoRenderCallback 接口自定义绘制到当前屏幕上。
  /// 在该模式下，您无需设置 TRTCTranscodingConfig 中的 mixUsers 参数，SDK 不会混合学生的画面，以免干扰屏幕分享的效果。
  ///
  /// 您可以将 TRTCTranscodingConfig 中的 width × height 设为 0px × 0px，SDK 会自动根据用户当前屏幕的宽高比计算出一个合适的分辨率：
  /// - 如果老师当前屏幕宽度 <= 1920px，SDK 会使用老师当前屏幕的实际分辨率。
  /// - 如果老师当前屏幕宽度 > 1920px，SDK 会根据当前屏幕宽高比，选择 1920x1080(16:9)、1920x1200(16:10)、1920x1440(4:3) 三种分辨率中的一种。
  static TRTC_TranscodingConfigMode_Template_ScreenSharing: number = 4;

  /// 安卓视频渲染使用TextureView
  static TRTC_VideoView_TextureView: number = 1;

  /// 安卓视频渲染使用SurfaceView
  static TRTC_VideoView_SurfaceView: number = 2;
}

/*
/// 进房参数
///
/// 作为 TRTC SDK 的进房参数，只有该参数填写正确，才能顺利进入 roomId 所指定的音视频房间
export type TRTCParams = {
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
};
*/
/// 切换房间参数
export type TRTCSwitchRoomConfig = {
  /// 【字段含义】用户签名 [必填]，当前 userId 对应的验证签名，相当于使用云服务的登录密码。
  ///
  /// 【推荐取值】具体计算方法请参见 [如何计算UserSig](https://cloud.tencent.com/document/product/647/17275)。
  userSig: string; // 用户签名

  ///【字段含义】房间号码 [必填] ，在同一个房间里的用户（userId）可以彼此看到对方并进行视频通话
  ///
  /// 【推荐取值】取值范围：1 - 4294967294。
  roomId?: number; // 房间号

  /// 【字段含义】字符串房间号码 [选填]，在同一个房间内的用户可以看到彼此并进行视频通话。
  ///
  /// 【特别说明】roomId 和 strRoomId 必须并且只能填一个。若两者都填，则优先选择 roomId。
  strRoomId?: string;

  /// 【字段含义】房间签名 [非必填]，当您希望某个房间只能让特定的 userId 进入时，需要使用 privateMapKey 进行权限保护。
  ///
  /// 【推荐取值】仅建议有高级别安全需求的客户使用，更多详情请参见 [进房权限保护](https://cloud.tencent.com/document/product/647/32240)。

  privateMapKey?: string; // 房间签名 [非必填]，当您希望某个房间只能让特定的 userId 进入时，需要使用 privateMapKey 进行权限保护。
};

/// 编码参数
///
/// 视频编码器相关参数，该设置决定了远端用户看到的画面质量（同时也是云端录制出的视频文件的画面质量）

export type TRTCVideoEncParam = {
  ///【字段含义】 视频分辨率
  ///
  ///【推荐取值】
  ///    - 视频通话建议选择360 × 640及以下分辨率，resMode 选择 Portrait。
  ///    - 手机直播建议选择540 × 960，resMode 选择 Portrait。
  ///    - Window 和 iMac 建议选择640 × 360及以上分辨率，resMode 选择 Landscape。
  ///
  ///【特别说明】
  ///    TRTCVideoResolution 默认只能横屏模式的分辨率，例如640 × 360。
  ///    如需使用竖屏分辨率，请指定 resMode 为 Portrait，例如640 × 360结合 Portrait 则为360 × 640。
  videoResolution: number;

  ///【字段含义】分辨率模式（横屏分辨率 - 竖屏分辨率）
  ///
  ///【推荐取值】手机直播建议选择 Portrait，Window 和 Mac 建议选择 Landscape。
  ///
  ///【特别说明】如果 videoResolution 指定分辨率640 × 360，resMode 指定模式为 Portrait，则最终编码出的分辨率为360 × 640。
  videoResolutionMode: number;

  ///【字段含义】视频采集帧率
  ///
  ///【推荐取值】15fps或20fps，5fps以下，卡顿感明显。10fps以下，会有轻微卡顿感。20fps以上，则过于浪费（电影的帧率为24fps）。
  ///
  ///【特别说明】很多 Android 手机的前置摄像头并不支持15fps以上的采集帧率，部分过于突出美颜功能的 Android 手机前置摄像头的采集帧率可能低于10fps。
  videoFps: number;

  ///【字段含义】目标视频码率，SDK 会按照目标码率进行编码，只有在网络不佳的情况下才会主动降低视频码率。
  ///
  ///【推荐取值】请参考本 TRTCVideoResolution 在各档位注释的最佳码率，也可以在此基础上适当调高。
  ///            比如 TRTC_VIDEO_RESOLUTION_1280_720 对应 1200kbps 的目标码率，您也可以设置为 1500kbps 用来获得更好的清晰度观感。
  ///
  ///【特别说明】SDK 会努力按照 videoBitrate 指定的码率进行编码，只有在网络不佳的情况下才会主动降低视频码率，最低会降至 minVideoBitrate 所设定的数值。
  ///            如果您追求“允许卡顿但要保持清晰”的效果，可以设置 minVideoBitrate 为 videoBitrate 的 60%；
  ///            如果您追求“允许模糊但要保持流畅”的效果，可以设置 minVideoBitrate 为 200kbps；
  ///            如果您将 videoBitrate 和 minVideoBitrate 设置为同一个值，等价于关闭 SDK 的自适应调节能力。
  videoBitrate: number;

  ///【字段含义】最低视频码率，SDK 会在网络不佳的情况下主动降低视频码率，最低会降至 minVideoBitrate 所设定的数值。
  ///
  ///【推荐取值】
  ///     - 如果您追求“允许卡顿但要保持清晰”的效果，可以设置 minVideoBitrate 为 videoBitrate 的 60%；
  ///     - 如果您追求“允许模糊但要保持流畅”的效果，可以设置 minVideoBitrate 为 200kbps；
  ///     - 如果您将 videoBitrate 和 minVideoBitrate 设置为同一个值，等价于关闭 SDK 的自适应调节能力；
  ///     - 默认值：0，此时最低码率由 SDK 根据分辨率情况，自动设置合适的数值。
  ///
  ///【特别说明】
  ///     - 当您把分辨率设置的比较高时，minVideoBitrate 不适合设置的太低，否则会出现画面模糊和大范围的马赛克宏块。
  ///        比如把分辨率设置为 720p，把码率设置为 200kbps，那么编码出的画面将会出现大范围区域性马赛克。
  minVideoBitrate: number;

  ///【字段含义】是否允许调整分辨率
  ///
  ///【推荐取值】
  ///     - 手机直播建议选择 false。
  ///     - 视频通话模式，若更关注流畅性，建议选择 true，此时若遇到带宽有限的弱网，SDK 会自动降低分辨率以保障更好的流畅度（仅针对 TRTCVideoStreamTypeBig 生效）。
  ///     - 默认值：false。
  ///
  ///【特别说明】若有录制需求，选择 true 时，请确保通话过程中，调整分辨率不会影响您的录制效果。
  enableAdjustRes: boolean;
};

/// 网络流控相关参数
///
/// 该设置决定 SDK 在各种网络环境下的调控方向（例如弱网下选择“保清晰”或“保流畅”）

export type TRTCNetworkQosParam = {
  ///【字段含义】弱网下选择“保清晰”或“保流畅”
  ///
  ///【特别说明】
  ///   - 弱网下保流畅：在遭遇弱网环境时，画面会变得模糊，且出现较多马赛克，但可以保持流畅不卡顿
  ///   - 弱网下保清晰：在遭遇弱网环境时，画面会尽可能保持清晰，但可能会更容易出现卡顿
  preference: number;

  ///【字段含义】视频分辨率（云端控制 - 客户端控制）
  ///
  ///【推荐取值】云端控制
  ///
  ///【特别说明】
  ///   - Server 模式（默认）：云端控制模式，若没有特殊原因，请直接使用该模式
  ///   - Client 模式：客户端控制模式，用于 SDK 开发内部调试，客户请勿使用
  controlMode: number;
};

/// 远端图像参数
export type TRTCRenderParams = {
  ///【字段含义】图像顺时针旋转角度
  ///
  ///【特别说明】
  ///*   - TRTCCloudDef.TRTC_VIDEO_ROTATION_0，不旋转（默认值）
  ///*  - TRTCCloudDef.TRTC_VIDEO_ROTATION_90，顺时针旋转90度。
  ///*   - TRTCCloudDef.TRTC_VIDEO_ROTATION_180，顺时针旋转180度。
  ///*   - TRTCCloudDef.TRTC_VIDEO_ROTATION_270，顺时针旋转270度。
  rotation: number;

  ///【字段含义】图像渲染模式
  ///
  ///【特别说明】
  ///   填充（画面可能会被拉伸裁剪）或适应（画面可能会有黑边），默认值：TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL
  /// - TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL，图像铺满屏幕，超出显示视窗的视频部分将被裁剪，画面显示可能不完整。
  /// - TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FIT，图像长边填满屏幕，短边区域会被填充黑色，画面的内容完整。
  fillMode: number;

  ///【字段含义】镜像模式
  ///
  ///【特别说明】
  /// - TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_AUTO ：前置摄像头开启镜像，后置摄像头不开启镜像。（默认值）
  /// - TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_ENABLE ：前置摄像头和后置摄像头都开启镜像。
  /// - TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_DISABLE ：前置摄像头和后置摄像头都不开启其镜像。
  mirrorType: number;
};

/// 云端混流中每一路子画面的位置信息
///
/// TRTCMixUser 用于指定每一路（即每一个 userId）视频画面的具体摆放位置
export type TRTCMixUser = {
  /// 参与混流的 userId
  userId: string;

  /// 参与混流的 userId 所在roomId，null表示当前房间
  roomId: string;

  /// 图层位置 x 坐标（绝对像素值）
  x: number;

  /// 图层位置 y 坐标（绝对像素值）
  y: number;

  /// 图层位置宽度（绝对像素值）
  width: number;

  /// 图层位置高度（绝对像素值）
  height: number;

  /// 图层层次（1 - 15）不可重复
  zOrder: number;

  /// 参与混合的是主路画面（TRTC_VIDEO_STREAM_TYPE_BIG，默认）或屏幕分享（TRTC_VIDEO_STREAM_TYPE_SUB）画面
  streamType: number;
};

/// 云端混流（转码）配置
///
/// 包括最终编码质量和各路画面的摆放位置
export type TRTCTranscodingConfig = {
  ///【字段含义】腾讯云直播 AppID
  ///【推荐取值】请在 [实时音视频控制台](https://console.cloud.tencent.com/trtc) 选择已经创建的应用，单击【帐号信息】后，在“直播信息”中获取
  appId?: number;

  ///【字段含义】腾讯云直播 bizid
  ///【推荐取值】请在 [实时音视频控制台](https://console.cloud.tencent.com/trtc) 选择已经创建的应用，单击【帐号信息】后，在“直播信息”中获取
  bizId?: number;

  ///【字段含义】转码config模式
  mode: number;

  ///【字段含义】最终转码后的视频分辨率的宽度。
  ///【推荐取值】推荐值：360px，如果你是纯音频推流，请将 width × height 设为 0px × 0px，否则混流后会携带一条画布背景的视频流。
  videoWidth: number;

  ///【字段含义】最终转码后的视频分辨率的高度。
  ///【推荐取值】推荐值：640px，如果你是纯音频推流，请将 width × height 设为 0px × 0px，否则混流后会携带一条画布背景的视频流。
  videoHeight: number;

  ///【字段含义】最终转码后的视频分辨率的码率（kbps）。
  ///【推荐取值】如果填0，后台会根据 videoWidth 和 videoHeight 来估算码率，您也可以参考枚举定义 TRTC_VIDEO_RESOLUTION_640_480 的注释。
  videoBitrate: number;

  ///【字段含义】最终转码后的视频分辨率的帧率（FPS）。
  ///【推荐取值】默认值：15fps，取值范围是 (0,30]。
  videoFramerate: number;

  ///【字段含义】最终转码后的视频分辨率的关键帧间隔（又称为 GOP）。
  ///【推荐取值】默认值：2，单位为秒，取值范围是 [1,8]。
  videoGOP: number;

  ///【字段含义】混合后画面的底色颜色，默认为黑色，格式为十六进制数字，比如：“0x61B9F1” 代表 RGB 分别为(97,158,241)。
  ///【推荐取值】默认值：0x000000，黑色
  backgroundColor: number;

  ///【字段含义】混合后画面的背景图。
  ///【推荐取值】默认值：null，即不设置背景图
  ///【特别说明】背景图需要您事先在 “[控制台](https://console.cloud.tencent.com/trtc) => 应用管理 => 功能配置 => 素材管理” 中上传， <br>
  ///            上传成功后可以获得对应的“图片ID”，然后将“图片ID”转换成字符串类型并设置到 backgroundImage 里即可。 <br>
  ///            例如：假设“图片ID” 为 63，可以设置 backgroundImage = "63"; <br>
  backgroundImage?: string;

  ///【字段含义】最终转码后的音频采样率。
  ///【推荐取值】默认值：48000Hz。支持12000HZ、16000HZ、22050HZ、24000HZ、32000HZ、44100HZ、48000HZ。
  audioSampleRate: number;

  ///【字段含义】最终转码后的音频码率。
  ///【推荐取值】默认值：64kbps，取值范围是 [32，192]。
  audioBitrate: number;

  ///【字段含义】最终转码后的音频声道数
  ///【推荐取值】默认值：1。取值范围为 [1,2] 中的整型。
  audioChannels: number;

  ///【字段含义】每一路子画面的位置信息
  mixUsers?: Array<TRTCMixUser>; // 每一路子画面的位置信息

  ///【字段含义】输出到 CDN 上的直播流 ID
  ///          如不设置该参数，SDK 会执行默认逻辑，即房间里的多路流会混合到该接口调用者的视频流上，也就是 A+B =>A；
  ///          如果设置该参数，SDK 会将房间里的多路流混合到您指定的直播流 ID 上，也就是 A+B =>C。
  ///【推荐取值】默认值：null，即房间里的多路流会混合到该接口调用者的视频流上。
  streamId: string;
};

/// 变声类型定义（萝莉、大叔、重金属、外国人...）
export enum TXVoiceChangerType {
  /// 关闭变声
  TXLiveVoiceChangerType_0 = 0,

  /// 熊孩子
  TXLiveVoiceChangerType_1 = 1,

  /// 萝莉
  TXLiveVoiceChangerType_2 = 2,

  /// 大叔
  TXLiveVoiceChangerType_3 = 3,

  /// 重金属
  TXLiveVoiceChangerType_4 = 4,

  /// 感冒
  TXLiveVoiceChangerType_5 = 5,

  /// 外国人
  TXLiveVoiceChangerType_6 = 6,

  /// 困兽
  TXLiveVoiceChangerType_7 = 7,

  /// 死肥仔
  TXLiveVoiceChangerType_8 = 8,

  /// 强电流
  TXLiveVoiceChangerType_9 = 9,

  /// 重机械
  TXLiveVoiceChangerType_10 = 10,

  /// 空灵
  TXLiveVoiceChangerType_11 = 11,
}

/// 变声类型定义（KTV、小房间、大会堂、低沉、洪亮...）
export enum TXVoiceReverbType {
  /// 关闭混响
  TXLiveVoiceReverbType_0 = 0,

  /// KTV
  TXLiveVoiceReverbType_1 = 1,

  /// 小房间
  TXLiveVoiceReverbType_2 = 2,

  /// 大会堂
  TXLiveVoiceReverbType_3 = 3,

  /// 低沉
  TXLiveVoiceReverbType_4 = 4,

  /// 洪亮
  TXLiveVoiceReverbType_5 = 5,

  /// 金属声
  TXLiveVoiceReverbType_6 = 6,

  /// 磁性
  TXLiveVoiceReverbType_7 = 7,
}

/// 音乐和人声设置接口参数
export type AudioMusicParam = {
  /// 【字段含义】音乐 ID
  /// 【特殊说明】SDK 允许播放多路音乐，因此需要音乐 ID 进行标记，用于控制音乐的开始、停止、音量等
  id: number;

  /// 【字段含义】音乐文件的绝对路径
  path: string;

  /// 【字段含义】音乐循环播放的次数
  /// 【推荐取值】取值范围为0 - 任意正整数，默认值：0。0表示播放音乐一次；1表示播放音乐两次；以此类推
  loopCount?: number;

  /// 【字段含义】是否将音乐传到远端
  /// 【推荐取值】YES：音乐在本地播放的同时，会上行至云端，因此远端用户也能听到该音乐；NO：音乐不会上行至云端，因此只能在本地听到该音乐。默认值：NO
  publish?: boolean;

  /// 【字段含义】播放的是否为短音乐文件
  /// 【推荐取值】YES：需要重复播放的短音乐文件；NO：正常的音乐文件。默认值：NO
  isShortFile?: boolean;

  /// 【字段含义】音乐开始播放时间点，单位毫秒
  startTimeMS?: number;

  /// 【字段含义】音乐结束播放时间点，单位毫秒，0或者-1表示播放至文件结尾。
  endTimeMS?: number;
};

/// 录音参数
///
/// 【字段含义】文件路径（必填），录音文件的保存路径。该路径需要用户自行指定，请确保路径存在且可写。
///
/// 【特别说明】该路径需精确到文件名及格式后缀，格式后缀决定录音文件的格式，目前支持的格式有 PCM、WAV 和 AAC。 例如，指定路径为 path/to/audio.aac，则会生成一个 AAC 格式的文件。 请指定一个有读写权限的合法路径，否则录音文件无法生成。
export type TRTCAudioRecordingParams = {
  filePath: string;
};

/// CDN 转推参数
export type TRTCPublishCDNParam = {
  /// 腾讯云 AppID，请在 实时音视频控制台[https://console.cloud.tencent.com/trtc] 选择已经创建的应用，单击【应用信息】，在“旁路直播信息”中获取
  appId: number;

  /// 腾讯云直播 bizid，请在 实时音视频控制台[https://console.cloud.tencent.com/trtc] 选择已经创建的应用，单击【应用信息】，在“旁路直播信息”中获取
  bizId: number;

  /// 旁路转推的 URL
  url: string;
};

/// 本地外接纹理渲染本地视频参数
export type CustomLocalRender = {
  /// 用户标识
  userId: string;

  /// 是否是前置摄像头
  isFront: boolean;

  /// 仅支持 TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG 和 TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB。
  streamType: number;

  /// 视频显示的宽度
  width: number;

  /// 视频显示的高度
  height: number;
};

/// 外接纹理渲染远端视频参数
export type CustomRemoteRender = {
  /// 用户标识
  userId: string;

  /// 仅支持 TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG 和 TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB。
  streamType: number;

  /// 视频显示的宽度
  width: number;

  /// 视频显示的高度
  height: number;
};
