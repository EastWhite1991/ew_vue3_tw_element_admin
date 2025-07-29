#!/bin/bash --login
set -e

# 显式加载nvm，解决在使用zsh时出现未安装nvm的问题
# 手动执行了原本应该在shell初始化时自动执行的代码，确保nvm函数和相关环境变量在脚本环境中可用。
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

if ! command -v nvm &> /dev/null; then
  echo "错误: 未安装nvm,请先安装nvm"
  echo "参考: https://github.com/nvm-sh/nvm?tab=readme-ov-file#installing-and-updating"
  exit 1
fi

nvm which 22 >/dev/null 2>&1 || nvm install 22
nvm use 22

# 确保 pnpm 在当前 Node 版本中可用
if ! command -v pnpm &> /dev/null; then
  echo "正在安装 pnpm..."
  npm install -g pnpm
fi

pnpm install
pnpm dev