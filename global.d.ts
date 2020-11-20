/// <reference path="./typings/index.d.ts"/>

// 允许 TypeScript 直接引用 Vue 文件.
declare module '*.vue' {
  const content: any
  export default content
}

declare module '*.pug' {
  const content: any
  export default content
}
declare module '*.styl' {
  const content: any
  export default content
}

declare module '*.json' {
  const content: any
  export default content
}

declare module 'nuxt'
