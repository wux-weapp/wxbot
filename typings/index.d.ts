export * from './auth'
export * from './friend'
export * from './group'
export * from './memory'
export * from './reply'
export * from './robot'
export * from './task'

/**
 * 接口返回信息类型
 *
 * @export
 * @interface IAsyncResult
 * @template T
 */
export interface IAsyncResult<T> {
  /**
   * 接口是否调用成功
   *
   * @type {boolean}
   * @memberof IAsyncResult
   */
  success?: boolean

  /**
   * 接口返回数据
   *
   * @type {T}
   * @memberof IAsyncResult
   */
  data?: T

  /**
   * 错误状态码
   *
   * @type {number}
   * @memberof IAsyncResult
   */
  errcode?: number

  /**
   * 错误信息
   *
   * @type {string}
   * @memberof IAsyncResult
   */
  errmsg?: string
}

/**
 * 查询参数类型
 *
 * @export
 * @interface IQueryInfo
 */
export interface IQueryInfo {
  /**
   * 当前页数
   *
   * @type {number}
   * @memberof IQueryInfo
   */
  page: number

  /**
   * 每页条数
   *
   * @type {number}
   * @memberof IQueryInfo
   */
  pageSize: number

  [key: string]: any
}
