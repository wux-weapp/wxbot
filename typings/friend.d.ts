/**
 * 好友信息类型
 *
 * @export
 * @interface IFriendInfo
 */
export interface IFriendInfo {
  /**
   * 昵称
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  name: string

  /**
   * 备注
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  alias: string

  /**
   * 头像
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  avatar: string

  /**
   * 省份
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  province: string

  /**
   * 城市
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  city: string

  /**
   * 性别
   *
   * @type {number}
   * @memberof IFriendInfo
   */
  gender: number

  /**
   * 微信
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  weixin: string

  /**
   * 机器人id
   *
   * @type {string}
   * @memberof IFriendInfo
   */
  robotId: string
}
