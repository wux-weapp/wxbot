/**
 * 平台用户信息类型
 *
 * @export
 * @interface IAuthInfo
 */
export interface IAuthInfo {
  /**
   * 用户名
   *
   * @type {string}
   * @memberof IAuthInfo
   */
  username: string

  /**
   * 用户密码
   *
   * @type {string}
   * @memberof IAuthInfo
   */
  password: string

  /**
   * Salt 值
   *
   * @type {string}
   * @memberof IAuthInfo
   */
  salt: string
}
