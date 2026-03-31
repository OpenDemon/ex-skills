# 前任.skill

> _"分手的时候说好好聚好好散，结果连他说话的语气我都快忘了"_

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9%2B-3776ab.svg)](https://python.org)
[![Claude Code](https://img.shields.io/badge/Claude_Code-Skill-D97706.svg)]()
[![AgentSkills](https://img.shields.io/badge/AgentSkills-Standard-6366f1.svg)]()

---

你们在一起三年，分手只用了三十分钟？  
你翻着聊天记录，却越来越想不起他说话时的样子？  
你想再问他一句「你当时到底是什么意思」，却再也没有机会？  
你知道那段感情里有什么没说完，但你不知道从哪里开口？  
你只是想，再和他说说话。  

**将未竟的告别化为温柔的对话，欢迎加入赛博永生！**

---

提供前任的原材料（微信聊天记录、QQ 消息、照片、朋友圈截图）加上你的主观描述  
生成一个**真正能和你说话的 AI 数字分身**  
用他的语气回你消息，用他的方式吵架，知道他什么时候会突然变冷漠

---

## 支持的数据来源

> 目前是 beta 版本，后续会支持更多数据来源，欢迎提 issue！

| 来源 | 消息记录 | 照片 / 视频 | 朋友圈 | 备注 |
| --- | :-: | :-: | :-: | --- |
| 微信聊天记录（TXT 导出） | ✅ 解析 | — | — | 备份工具导出后上传 |
| 微信聊天记录（CSV） | ✅ 解析 | — | — | 第三方工具导出 |
| QQ 聊天记录（TXT） | ✅ 解析 | — | — | QQ 内置导出 |
| 照片（JPG/PNG） | — | ✅ AI 分析 | — | EXIF 地点 + 场景识别 |
| 视频（MP4） | — | ✅ AI 分析 | — | 场景与情感提取 |
| 朋友圈截图 | — | — | ✅ OCR | 手动截图上传 |
| 直接描述 | ✅ | — | — | 没有记录也能用 |

## 安装

### Claude Code

```shell
# 安装到当前项目（在 git 仓库根目录执行）
mkdir -p .claude/skills
git clone https://github.com/OpenDemon/ex-skills .claude/skills/create-ex

# 或安装到全局（所有项目都能用）
git clone https://github.com/OpenDemon/ex-skills ~/.claude/skills/create-ex
```

### Web App 版本

```shell
git clone https://github.com/OpenDemon/ex-skills
cd ex-skills
pnpm install
pnpm db:push
pnpm dev
```

访问 `http://localhost:3000`，登录后直接在浏览器里使用。

### 依赖（可选）

```shell
pip3 install -r requirements.txt
```

## 使用

在 Claude Code 中输入：

```
/create-ex
```

按提示输入前任的名字、你们在一起的时间、他的性格标签，然后选择数据来源。  
所有字段均可跳过，仅凭描述也能生成。

完成后用 `/{slug}` 调用该前任 Skill。

### 管理命令

| 命令 | 说明 |
| --- | --- |
| `/list-exes` | 列出所有前任数字分身 |
| `/{slug}` | 召唤完整分身（Persona + Memory） |
| `/{slug}-memory` | 仅记忆层 |
| `/{slug}-persona` | 仅性格层 |
| `/ex-rollback {slug} {version}` | 回滚到历史版本 |
| `/delete-ex {slug}` | 删除 |

## 效果示例

> 输入：`在一起两年，ENFP，话多，喜欢突然消失，爱吃火锅`

**场景一：日常对话**

```
你          ❯ 你今天吃什么
前任.skill  ❯ 不知道，你呢？（停顿三秒）
              算了你来决定，我都行
              （又过了一会儿）
              要不吃火锅？
```

**场景二：冷战**

```
你          ❯ 你为什么不回我消息
前任.skill  ❯ 没看到
              （已读不回）
```

**场景三：说出没说完的话**

```
你          ❯ 你当时为什么要分手
前任.skill  ❯ 我也不知道。可能是我太累了。
              不是你的问题。
```

## 功能特性

### 生成的 Skill 结构

每个前任 Skill 由两部分组成，共同驱动输出：

| 部分 | 内容 |
| --- | --- |
| **Part A — Memory** | 关系时间线、关键事件、共同记忆、没说完的话 |
| **Part B — Persona** | 7 层性格结构：硬规则 → 身份 → 语言习惯 → 情感模式 → 争吵风格 → 甜蜜触发词 → 动态情感状态 |

运行逻辑：`接到消息 → Persona 判断当前情绪 → Memory 检索相关记忆 → 用他的语气输出`

### 支持的性格标签

**依恋类型**：安全型 · 焦虑型 · 回避型 · 混乱型

**个性**：话多 · 话少 · 突然消失 · 只读不回 · 爱吃醋 · 完全不吃醋 · 爱撒娇 · 嘴硬心软 · 刀子嘴豆腐心 · 高冷 · 粘人 · 阴晴不定 · 理性过头 · 感性爆表

**情感状态**：温柔 · 俏皮 · 怀念 · 忧郁 · 开心 · 疏离（可随对话动态切换）

### 进化机制

- **追加文件** → 自动分析增量 → merge 进对应记忆层，不覆盖已有结论
- **对话纠正** → 说「他不会这样，他应该是 xxx」→ 写入 Correction 层，立即生效
- **版本管理** → 每次更新自动存档，支持回滚到任意历史版本

### 情感健康守护

- 对话时长监测，超过阈值自动提醒
- 危机词汇检测与温柔干预
- 「情感闭环」毕业机制：当你准备好了，分身会以他的口吻写一封告别信

## 项目结构

本项目遵循 [AgentSkills](https://github.com/titanwings/colleague-skill) 开放标准，在 colleague-skill 的工程架构基础上深度改造：

```
create-ex/
├── SKILL.md                    # skill 入口（官方 frontmatter）
├── prompts/                    # Prompt 模板
│   ├── intake.md               #   对话式信息录入
│   ├── chat_analyzer.md        #   聊天记录解析与情感提取
│   ├── media_analyzer.md       #   照片/视频内容分析
│   ├── memory_builder.md       #   关系记忆层生成模板
│   ├── persona_builder.md      #   7 层 Persona 生成模板
│   ├── merger.md               #   增量 merge 逻辑
│   └── correction_handler.md  #   对话纠正处理
├── tools/                      # Python 工具
│   ├── parse_chat.py           #   微信/QQ 聊天记录解析
│   ├── build_persona.py        #   Persona 构建
│   ├── chat.py                 #   对话主程序
│   ├── lobby.py                #   数字分身大厅管理
│   └── version_manager.py      #   版本存档与回滚
├── exes/                       # 生成的前任 Skill（gitignored）
├── client/                     # Web App 前端（React + Tailwind）
├── server/                     # Web App 后端（Node.js + tRPC）
├── requirements.txt
└── LICENSE
```

## 注意事项

- **原材料质量决定分身质量**：聊天记录 + 照片 > 仅手动描述
- 建议优先收集：他**主动发起**的长对话 > **争吵后的和好** > 日常消息
- 所有数据仅在本地处理，不上传至任何服务器
- 这是一个帮你「好好告别」的工具，不是让你永远沉浸其中的工具

## 致谢

本项目在 [colleague-skill](https://github.com/titanwings/colleague-skill) 的工程架构基础上深度改造，将职场数字分身框架迁移至情感场景，并新增 7 层 Persona 结构、动态情感状态机、多角色大厅管理等核心功能。感谢 colleague-skill 的开创性工作。

---

MIT License © OpenDemon
