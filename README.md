# 电影搜索网站

这是一个基于Flask和React的电影搜索网站，提供以下功能：

- 通过IMDB TT号搜索电影
- 高级筛选功能（年代、导演等）
- 会员制系统
- 美观的用户界面

## 技术栈

- 后端：Python Flask
- 前端：React
- 数据库：MySQL
- 认证：JWT

## 安装说明

1. 克隆项目
2. 安装Python依赖：
   ```bash
   pip install -r requirements.txt
   ```
3. 配置环境变量：
   - 复制`.env.example`为`.env`
   - 填写必要的配置信息

4. 初始化数据库：
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

5. 运行开发服务器：
   ```bash
   python app.py
   ```

## 项目结构

```
├── backend/           # Flask后端
├── frontend/         # React前端
├── requirements.txt  # Python依赖
└── README.md        # 项目说明
``` 