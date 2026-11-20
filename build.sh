#!/bin/bash
set -e
#定义目录名
CURRENT_NAME="x9-web-pc"

#定义目录
CURRENT_DIR=$(pwd) #当前目录
SOURCE_DIR="$CURRENT_DIR/dist" #当前dist目录
PARENT_DIR=$(dirname "$CURRENT_DIR") #上级目录
TARGET_DIR="$PARENT_DIR/x9-web-builds/$CURRENT_NAME/app/public" #目标目录

echo "script running..."

# 分支切换到 pet
git stash

git checkout pet

# 拉取最新的代码

git pull --rebase

#如果 dist 目录存在，先删除
if [ -d "$SOURCE_DIR" ]; then
 echo "Removing existing dist directory..."
 rm -rf "$SOURCE_DIR"
fi
echo "dist directory not exist"

pnpm build

echo "dist directory created"

# 如果 target 目录存在，先清空
if [ -d "$TARGET_DIR" ]; then
 echo "target directory is exist"
 rm -rf "$TARGET_DIR"/*
fi
echo "Copying files from dist to public..."
cp -r "$SOURCE_DIR"/* "$TARGET_DIR"

echo "Files copied successfully"



# 获取当前年份、月份和日期
CURRENT_YEAR=$(date +"%y")
CURRENT_MONTH=$(date +"%m")
CURRENT_DAY=$(date +"%d")

# 打印输入的参数

CURRENT_DATE="$CURRENT_YEAR-$CURRENT_MONTH/$CURRENT_DAY"

# x9-web-pc/prod/24-10/02#14
TAG_NAME="$CURRENT_NAME/prod/$CURRENT_DATE#14"

echo "标签名是：$TAG_NAME"
# 检查标签是否存在
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  echo "Tag $TAG_NAME exists. Deleting it..."
  git tag -d "$TAG_NAME"
  git push origin :refs/tags/"$TAG_NAME" # 从远程删除标签
else
  echo "Tag $TAG_NAME does not exist."
fi

# 将tag也同样记录在本地
git tag $TAG_NAME

git push origin $TAG_NAME

# 切换builds目录

cd $TARGET_DIR

git status

git add .


echo "标签名是：$TAG_NAME"
# 检查标签是否存在
if git rev-parse "$TAG_NAME" >/dev/null 2>&1; then
  echo "Tag $TAG_NAME exists. Deleting it..."
  git tag -d "$TAG_NAME"
  git push origin :refs/tags/"$TAG_NAME" # 从远程删除标签
else
  echo "Tag $TAG_NAME does not exist."
fi

TIME_HASH=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32 | md5sum | cut -c 1-8)

git commit -m "build: $TAG_NAME-$TIME_HASH"

git tag $TAG_NAME

git pull

git push

git push origin $TAG_NAME

echo "build successfully"
