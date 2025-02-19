# EasyA-Consensus

## 代码管理与协作

**操作说明**<br>
**克隆仓库**：<br>
首次使用时，将远程仓库克隆到本地：
```bash
git clone https://github.com/PolyUBlockChainTeam/EasyA-Consensus.git
```

**多人协作开发**<br>
**1. 获取最新代码**：<br>
在开始任何修改前，确保本地代码是最新的：


```bash
git fetch origin
git pull origin main
```

**2. 提交本地更改**：
```bash
git add .
git commit -m "Your commit message"
```


**3. 推送更改到远程仓库**：
```bash
git push origin main
```

**4. 处理冲突**：<br>
如果远程仓库有其他人的修改，而你未同步就进行了提交，可能会出现冲突。解决冲突步骤如下：<br>
<br>
拉取远程更新并尝试自动合并：
```bash
git pull origin main
```

如果有冲突，Git 会提示冲突文件，打开冲突文件，你会看到类似以下标记：
```diff
<<<<<<< HEAD
你的代码
=======
对方的代码
>>>>>>> 对方提交的commit-id
```

手动修改冲突部分，保留需要的代码。<br>
**标记冲突已解决**：
```bash
git add <conflict_file>
```

**再次提交**：
```bash
git commit -m "Resolve merge conflict"
```
推送解决后的代码：
```bash
git push origin main
```
**5. 分支管理（推荐）**：<br>
为了降低冲突风险，建议每个开发者在自己的分支开发：

```bash
git checkout -b feature/your-feature
```
开发完成后，先将主分支的更新合并到自己的分支：

```bash
git checkout feature/your-feature
git merge main
```
解决冲突后推送分支代码：

```bash
git push origin feature/your-feature
```
通过 Pull Request 提交分支合并到主分支，确保审核后再合并。

**忽略 data 文件夹**<br>
如果不希望 data 文件夹被推送到 GitHub，请按照以下步骤操作：<br>

**创建或编辑 .gitignore 文件，添加以下内容**：

```bash
data/
```
**移除已被 Git 跟踪的 data 文件夹**：

```bash
git rm -r --cached data
```
**提交更改并推送**：

```bash
git add .gitignore
git commit -m "Ignore data folder and remove from Git tracking"
git push origin main
```
从此，data 文件夹将不再被 Git 跟踪，并不会推送到 GitHub。<br>

**忽略 data.json 文件**<br>
如果不希望 data.json 文件被推送到 GitHub，请按照以下步骤操作：<br>

**创建或编辑 .gitignore 文件，添加以下内容**：

```bash
data.json
```
**移除已被 Git 跟踪的 data.json 文件**：

```bash
git rm -r --cached data.json
```
**提交更改并推送**：

```bash
git add .gitignore
git commit -m "Ignore data.json and remove from Git tracking"
git push origin main
```
从此，data.json 文件将不再被 Git 跟踪，并不会推送到 GitHub。<br>
<br>
小贴士<br>
随时同步远程仓库：避免提交较大修改后才同步，这样会增加冲突概率。<br>
小步提交：更频繁地提交修改，减少冲突范围。<br>
定期代码审查：通过 Pull Request 进行代码合并时，便于团队发现潜在问题。<br>