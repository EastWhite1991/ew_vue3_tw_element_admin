# ew_vue3_tw_element_admin

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
pnpm test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```

## 插件

[Pinia 持久化](https://prazdevs.github.io/pinia-plugin-persistedstate/zh/guide/advanced.html)

## 项目启动

### 启动 Mock 服务

```sh
json-server --watch db.json --port 3000
```

### 启动项目

```sh
pnpm install
pnpm dev
```

## 在 `package.json` 中配置脚本

你可以在 `package.json` 中配置脚本，以实现启动 Mock 服务、启动项目以及同时启动两者。以下是一个示例配置：

```json
{
  "name": "your-project-name",
  "version": "1.0.0",
  "scripts": {
    "start:mock": "json-server --watch db.json --port 3000",
    "start": "pnpm install && pnpm dev",
    "start:all": "concurrently \"npm run start:mock\" \"npm run start\""
  },
  "devDependencies": {
    "concurrently": "^6.0.0"
  }
}
```

### 说明

1. **启动 Mock 服务**: `npm run start:mock`
2. **启动项目**: `npm run start`
3. **同时启动 Mock 服务和项目**: `npm run start:all`

### 安装 `concurrently`

为了能够同时运行多个命令，你需要安装 `concurrently`。可以通过以下命令安装：

```sh
pnpm install concurrently --save-dev
```

### 使用说明

1. 将上述 `scripts` 配置添加到你的 `package.json` 中。
2. 在项目根目录下打开终端。
3. 使用以下命令启动相应的服务：

   - 启动 Mock 服务:

     ```sh
     npm run start:mock
     ```

   - 启动项目:

     ```sh
     npm run start
     ```

   - 同时启动 Mock 服务和项目:

     ```sh
     npm run start:all
     ```

这样，你就可以轻松地管理项目的启动了！

## 一键启动

```sh
make all
# or
pnpm start:all
```
