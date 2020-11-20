/**
 * 机器人信息类型
 *
 * @export
 * @interface IRobotInfo
 */
export interface IRobotInfo {
  /**
   * 机器人名称
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  nickName: string

  /**
   * 启动提示语
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  startSay: string

  /**
   * 知识盲区回复
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  unknownSay: string

  /**
   * 好友通过关键字
   *
   * @type {string[]}
   * @memberof IRobotInfo
   */
  addFriendKeywords: string[]

  /**
   * 好友通过自动回复
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  addFriendReply: string

  /**
   * 名称
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  name: string

  /**
   * 头像
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  avatar: string

  /**
   * 微信
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  weixin: string

  /**
   * 状态 0未启动 1已启动
   *
   * @type {(0 | 1)}
   * @memberof IRobotInfo
   */
  status: 0 | 1

  /**
   * 协议Token
   *
   * @type {string}
   * @memberof IRobotInfo
   */
  token: string
}
