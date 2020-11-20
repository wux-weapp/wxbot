/**
 * 记忆信息类型
 *
 * @export
 * @interface IMemoryInfo
 */
export interface IMemoryInfo {
  /**
   * 联系人
   *
   * @type {string}
   * @memberof IMemoryInfo
   */
  person: string

  /**
   * 指令
   *
   * @type {string}
   * @memberof IMemoryInfo
   */
  cmd: string

  /**
   * 群id
   *
   * @type {string}
   * @memberof IMemoryInfo
   */
  roomId: string

  /**
   * 备注
   *
   * @type {string}
   * @memberof IMemoryInfo
   */
  remark: string
}
