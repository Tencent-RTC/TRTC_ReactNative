/*eslint-disable*/
/**
   * Tencent Cloud `SDKAppID`. Set it to the `SDKAppID` of your account.
   *
   * You can view your `SDKAppID` after creating an application in the [TRTC console](https://console.trtc.io/).
   * `SDKAppID` uniquely identifies a Tencent Cloud account.
   */
const SDKAPPID = 0;

/**
   * Signature validity period, which should not be set too short
   * <p>
   * Unit: second
   * Default value: 604800 (7 days)
   */
const EXPIRETIME = 604800;

/**
 * Follow the steps below to obtain the key required for UserSig calculation.
 *
 * Step 1. Log in to the [TRTC console](https://console.trtc.io/), and create an application if you don’t have one.
 * Step 2. Find your application, click “Application Info”, and click the “Quick Start” tab.
 * Step 3. Copy and paste the key to the code, as shown below.
 *
 * Note: this method is for testing only. Before commercial launch, please migrate the UserSig calculation code and key to your backend server to prevent key disclosure and traffic stealing.
 * Reference: https://trtc.io/document/35166
 */
const SECRETKEY = '';

export { SDKAPPID, EXPIRETIME, SECRETKEY };
