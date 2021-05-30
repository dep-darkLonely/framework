// ref:
// - https://umijs.org/plugins/api
import { join } from 'path';
import { copyFileSync, statSync } from 'fs';
import { IApi, utils } from 'umi';

const PLUGIN_CRRAMEWORK = 'plugin_crramework';

export default function (api: IApi) {
  // 启动时加载
  api.onStart(() => {
    api.logger.info(`${PLUGIN_CRRAMEWORK} start loading.`);
  });

  /**
   * 插件准备完成回调函数
   * @date 2021-05-30
   */
  api.onPluginReady(() => {
    api.logger.info(`plugin:${PLUGIN_CRRAMEWORK} ready finished.`);
  });

  /**
   * #2 添加默认的路由
   * @date 2021-05-30
   * @param {any} routes 路由
   * @returns {any} routes
   */
  api.modifyRoutes((routes: any[]) => {
      routes.splice(0, 0,
        {
          path: '/',
          component: '@/pages/Home',
          exact: true,
      });
      return routes;
  });

  // #3 注册阶段执行，用于描述插件或插件集的 id、key、配置信息、启用方式等。
  api.describe({
    key: 'crramework',
    config: {
      schema(joi) {
        return joi.object();
      },
      onChange: api.ConfigChangeType.regenerateTmpFiles,
    },
    enableBy: api.EnableBy.register, //注册时启动
  });


  /**
   * 添加umi 额外导出的内容
   * @date 2021-05-30
   */
  // api.addUmiExports(() => [
  //   {
  //     exportAll: true,
  //     source: '',
  //   },
  // ]);

  // 结束时加载
  api.onExit(() => {
    api.logger.info('@umiujs/plugin-crramework stop.');
  });

  let generatedOnce = false;
  api.onGenerateFiles(() => {
    if (generatedOnce) return;
    generatedOnce = true;
    const cwd = join(__dirname, '../src');
    const files = utils.glob.sync('**/*', {
      cwd,
    });
    // 拷贝文件到 pages目录下
    const base = join(api.paths.absTmpPath!, '../');
    console.log(base);
    utils.mkdirp.sync(base);
    files.forEach((file) => {
      // 排除 index.ts 文件
      if (['index.ts'].includes(file)) return;
      const source = join(cwd, file);
      const target = join(base, file);
      if (statSync(source).isDirectory()) {
        utils.mkdirp.sync(target);
      } else {
        copyFileSync(source, target);
      }
    });
  });
}
