/**
 * 定时任务规则信息类型
 *
 * @export
 * @interface ITaskRuleInfo
 */
export interface ITaskRuleInfo {
  /**
   * 指定周几
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  dayOfWeek?: number

  /**
   * 指定某月
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  month?: number

  /**
   * 指定某天
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  dayOfMonth?: number

  /**
   * 指定某时
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  hour?: number

  /**
   * 指定某分
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  minute?: number

  /**
   * 指定某秒
   *
   * @type {number}
   * @memberof ITaskInfo
   */
  second?: number
}

/**
 * 定时任务信息类型
 *
 * @export
 * @interface ITaskInfo
 */
export interface ITaskInfo extends ITaskRuleInfo {
  /**
   * 名称
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  name: string

  /**
   * 类型 0:普通消息，1:其他
   *
   * @type {(0 | 1)}
   * @memberof ITaskInfo
   */
  type: 0 | 1

  /**
   * 发送内容
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  content: string

  /**
   * 触发场景 0:个人，1:群聊，2:通用群聊
   *
   * @type {(0 | 1 | 2)}
   * @memberof ITaskInfo
   */
  factor: 0 | 1 | 2

  /**
   * 状态 0停用 1启用
   *
   * @type {(0 | 1)}
   * @memberof ITaskInfo
   */
  status: 0 | 1

  /**
   * 联系人
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  friendId: string

  /**
   * 群id
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  roomId: string

  /**
   * 机器人id
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  robotId: string

  /**
   * cron表达式，优先级高于 rule(dayOfWeek,month...) 指定的时间
   *
   * @type {string}
   * @memberof ITaskInfo
   */
  cron: string

  /**
   * 时间单位 0:每分钟，1:每小时，2:每天，3:自定义
   *
   * @type {(0 | 1 | 2 | 3)}
   * @memberof ITaskInfo
   */
  unit: 0 | 1 | 2 | 3
}
