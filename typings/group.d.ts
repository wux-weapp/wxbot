/**
 * 群信息类型
 *
 * @export
 * @interface IGroupInfo
 */
export interface IGroupInfo {
  /**
   * 群管理员列表
   *
   * @type {string[]}
   * @memberof IGroupInfo
   */
  adminIdList: string[]

  /**
   * 群头像
   *
   * @type {string}
   * @memberof IGroupInfo
   */
  avatar: string

  /**
   * 群所有者
   *
   * @type {string}
   * @memberof IGroupInfo
   */
  ownerId: string

  /**
   * 群名称
   *
   * @type {string}
   * @memberof IGroupInfo
   */
  topic: string

  /**
   * 群员列表
   *
   * @type {string[]}
   * @memberof IGroupInfo
   */
  memberIdList: string[]

  /**
   * 机器人id
   *
   * @type {string}
   * @memberof IGroupInfo
   */
  robotId: string

  /**
   * 入群欢迎语
   *
   * @type {string}
   * @memberof IGroupInfo
   */
  roomJoinReply: string

  /**
   * 是否开启自动加群
   *
   * @type {boolean}
   * @memberof IGroupInfo
   */
  autojoin: boolean

  /**
   * 群编码(字母)，用于私聊自动回复“加群”匹配
   *
   * @type {string}
   * @memberof IGroupInfo
   */
  joinCode: string

  /**
   * 群员违规上限
   *
   * @type {number}
   * @memberof IGroupInfo
   */
  maxFoul: number

  /**
   * 是否开启机器人控制
   *
   * @type {boolean}
   * @memberof IGroupInfo
   */
  control: boolean
}
