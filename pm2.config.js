module.exports = {
  apps: [
    {
      name: 'wxbot',
      // 指定解释器
      interpreter: './node_modules/.bin/ts-node',
      // 解释器参数 -P 表示项目路径，会自动使用项目的 tsconfig.json
      interpreter_args: '-P tsconfig.json',
      // 项目路径
      cwd: './',
      // 运行的脚本
      script: './server/index.ts',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
}
