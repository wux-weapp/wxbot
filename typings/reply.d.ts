/**
 * 自动回复信息类型
 *
 * @export
 * @interface IReplyInfo
 */
export interface IReplyInfo {
  /**
   * 关键词
   *
   * @type {string}
   * @memberof IReplyInfo
   */
  keyword: string

  /**
   * 回复内容
   *
   * @type {string}
   * @memberof IReplyInfo
   */
  content: string

  /**
   * 类型 0:普通消息，1:发送群邀请(仅在私聊触发)  2:踢人指令(仅在群聊触发)
   *
   * @type {(0 | 1 | 2)}
   * @memberof IReplyInfo
   */
  type: 0 | 1 | 2

  /**
   * 触发场景 0:通用，1:私聊  2:群聊  3:通用群聊
   *
   * @type {(0 | 1 | 2| 3)}
   * @memberof IReplyInfo
   */
  factor: 0 | 1 | 2| 3

  /**
   * 状态 0停用 1启用
   *
   * @type {(0 | 1)}
   * @memberof IReplyInfo
   */
  status: 0 | 1

  /**
   * 群id
   *
   * @type {string}
   * @memberof IReplyInfo
   */
  roomId: string

  /**
   * 机器人id
   *
   * @type {string}
   * @memberof IReplyInfo
   */
  robotId: string

  /**
   * 备注
   *
   * @type {string}
   * @memberof IReplyInfo
   */
  remark: string
}
