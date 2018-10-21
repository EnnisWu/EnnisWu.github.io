---
title: 一些简单的Git命令
date: 2018-10-21 10:21:31
tags: Git
categories: Git
---

# 完整性

- Git 以校验和的方式检测数据完整性。
- Git 中的 commit id 是校验和。

# 文件状态和工作区域

- 工作区域：
	1. 工作目录：写代码的区域。
	2. 暂存区：代码 add 后 commit 前所在的区域。
	3. 本地仓库：代码 commit 后所在的区域。
- 文件状态：
	1. 已修改：工作目录已修改，代码未 add。
	2. 已暂存：代码已 add，未 commit。
	3. 已提交：代码已 commit。

# 用户身份

- 配置个人信息
```
$ git config --global user.name "Your Name"
$ git config --global user.email "example@email.com"
```

- 查看个人信息
```
$ git config --list
```

# 创建本地仓库

- 初始化本地仓库
```
$ git init
```

- 从远程仓库克隆
```
$ git clone ssh/https地址
```

# 本地操作

- 添加文件到暂存区
```
$ git add readme.txt
```

- 添加所有文件到暂存区
```
$ git add .
```

- 提交暂存区文件到本地仓库
```
$ git commit -m "say something"
```

加 -m 表示直接用后面的字符串作为说明，否则跳转编辑器

- 查看本地仓库提交历史
```
$ git log
```

- 查看文件状态
```
$ git status
```

	- Changes to be committed：已暂存、可提交文件
	- Untracked files：未暂存文件

- 查看未暂存文件变更细节
```
$ git diff
```

- 查看已暂存文件变更细节
```
$ git diff --staged
```

# 版本回退

- 回到上一个版本（硬回退）
```
$ git reset --hard HEAD^
```

- 回到上一个版本（软回退）
```
$ git reset --soft HEAD^
```

1. hard 移除仓库中的 commit，暂存区和工作区回到之前的状态。
2. soft 移除仓库中的 commit，暂存区和工作区不变。

- 查询版本提交记录
```
$ git reflog
```
①commit id ②执行的命令 ③描述

- 回退到指定版本
```
$ git reset --hard 提交Id
```
commit id 可以不填全部，git 自动查找。

# 撤销修改

- 撤销未添加到暂存区的修改
```
$ git checkout --文件
```

- 撤销已添加到暂存区的修改
```
$ git reset HEAD 文件
```

# 删除相关操作

- 删除文件
	1. 删除本地文件（文件管理器中删或用 `rm` 命令）
	```
	$ rm 文件
	```
	2. 确认 git 删除工作区文件
	```
	$ git rm 文件
	```
	3. 提交

- 恢复文件
```
$ git checkout --文件
```
	- 可以恢复未添加到暂存区的修改了的文件
	- 可以恢复自删除的文件

# 远程仓库

- 关联远程仓库
```
$ git remote add 自定义远程仓库名 ssh/https地址
```

- 第一次推送本地仓库到远程仓库
```
$ git push -u 远程仓库名 远程仓库分支名
```

- 非第一次推送本地仓库到远程仓库
```
$ git push 远程仓库名 远程仓库分支
```

- 从远程仓库拉取数据到本地
```
$ git fetch 远程仓库名
```

- 将从远程仓库拉取的数据和本地仓库合并
```
$ git merge 本地分支名
```

- 从远程仓库拉取数据并合并
```
$ git pull 远程仓库名 远程分支名
```

1. fetch 只拉取远程仓库数据，不更新本地仓库状态。
2. pull 拉取远程仓库数据并更新本地仓库状态到远程仓库最新状态。
3. pull = fetch + merge

# 分支

- 创建分支
```
$ git branch 分支名
```

- 切换分支
```
$ git checkout 分支名
```

- 创建并切换分支
```
$ git checkout -b 分支名
```

- 查看分支
```
$ git branch
```

- 合并分支
```
$ git branch 分支名
```

- 删除分支
```
$ git branch -d 分支名
```

# 解决冲突

- 解决冲突后不能提交某个文件，只能提交全部文件

# 变基（写的不完整，无参考价值）

```
$ git rebase 分支名
```

- rebase 失败先解决冲突再执行
```
$ git rebase --continue
```

1. 变基抛弃原有提交，创建新的对应提交。
2. 变基的提交历史是一条直线。