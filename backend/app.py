from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import pymysql
import traceback
from sqlalchemy import create_engine
from sqlalchemy.pool import QueuePool

load_dotenv()

app = Flask(__name__)
CORS(app)

# 配置
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root@127.0.0.1/movie'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
    'pool_size': 10,
    'pool_recycle': 3600,
    'pool_pre_ping': True,
    'pool_timeout': 30,
    'max_overflow': 2,
    'poolclass': QueuePool
}
app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # 使用固定的密钥
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
app.config['JWT_TOKEN_LOCATION'] = ['headers']
app.config['JWT_HEADER_NAME'] = 'Authorization'
app.config['JWT_HEADER_TYPE'] = 'Bearer'

# 测试数据库连接
def test_db_connection():
    try:
        conn = pymysql.connect(
            host='127.0.0.1',
            user='root',
            password='root',
            database='movie',
            charset='utf8mb4',
            connect_timeout=10
        )
        print("数据库连接成功！")
        # 测试查询
        with conn.cursor() as cursor:
            cursor.execute("SELECT COUNT(*) FROM kg")
            count = cursor.fetchone()[0]
            print(f"数据库中有 {count} 条电影记录")
        conn.close()
        return True
    except Exception as e:
        print(f"数据库连接失败：{str(e)}")
        print("详细错误信息：")
        print(traceback.format_exc())
        return False

# 初始化数据库连接
db = SQLAlchemy(app)
jwt = JWTManager(app)

# 数据模型
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_member = db.Column(db.Boolean, default=False)
    membership_expiry = db.Column(db.DateTime)

class Movie(db.Model):
    __tablename__ = 'kg'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    dir = db.Column(db.String(100))
    imdb = db.Column(db.String(20), unique=True)
    size = db.Column(db.String(50))
    PageUrl = db.Column(db.String(200))
    year = db.Column(db.Integer)

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        print(f"收到注册请求：{data}")
        
        new_user = User(
            username=data['username'],
            password=data['password'],  # 实际应用中需要加密
            email=data['email'],
            is_member=True,  # 直接设置为会员
            membership_expiry=datetime.utcnow() + timedelta(days=30)
        )
        db.session.add(new_user)
        db.session.commit()
        print(f"用户 {data['username']} 注册成功")
        return jsonify({'message': '注册成功'}), 201
    except Exception as e:
        print(f"注册失败：{str(e)}")
        print("详细错误信息：")
        print(traceback.format_exc())
        return jsonify({'message': f'注册失败：{str(e)}'}), 400

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        print(f"收到登录请求：{data}")
        
        # 添加重试机制
        max_retries = 3
        retry_count = 0
        while retry_count < max_retries:
            try:
                user = User.query.filter_by(username=data['username']).first()
                if user and user.password == data['password']:  # 实际应用中需要验证加密密码
                    # 创建token时使用字符串ID
                    access_token = create_access_token(identity=str(user.id))
                    print(f"用户 {data['username']} 登录成功")
                    return jsonify({
                        'access_token': access_token,
                        'is_member': user.is_member,
                        'expiry': user.membership_expiry.strftime('%Y-%m-%d') if user.membership_expiry else None
                    }), 200
                print(f"用户 {data['username']} 登录失败：用户名或密码错误")
                return jsonify({'message': '用户名或密码错误'}), 401
            except Exception as e:
                retry_count += 1
                if retry_count == max_retries:
                    raise e
                print(f"登录尝试 {retry_count} 失败，正在重试...")
                continue
    except Exception as e:
        print(f"登录失败：{str(e)}")
        print("详细错误信息：")
        print(traceback.format_exc())
        return jsonify({'message': f'登录失败：{str(e)}'}), 500

@app.route('/api/movies/search', methods=['GET'])
@jwt_required()
def search_movies():
    try:
        print("收到搜索请求")
        print(f"请求头：{dict(request.headers)}")
        print(f"请求参数：{request.args}")
        
        # 获取用户ID并转换为整数
        user_id = int(get_jwt_identity())
        print(f"当前用户ID：{user_id}")
        
        imdb = request.args.get('imdb')
        year = request.args.get('year')
        dir = request.args.get('dir')
        name = request.args.get('name')
        
        query = Movie.query
        
        if imdb:
            query = query.filter(Movie.imdb == imdb)
        if year:
            query = query.filter(Movie.year == year)
        if dir:
            query = query.filter(Movie.dir.like(f'%{dir}%'))
        if name:
            query = query.filter(Movie.name.like(f'%{name}%'))
        
        # 获取所有匹配的记录
        movies = query.all()
        
        print(f"找到 {len(movies)} 条记录")
        
        result = [{
            'name': movie.name,
            'dir': movie.dir,
            'imdb': movie.imdb,
            'size': movie.size,
            'PageUrl': movie.PageUrl,
            'year': movie.year
        } for movie in movies]
        
        print(f"返回结果：{result}")
        return jsonify(result)
    except Exception as e:
        print(f"搜索出错：{str(e)}")
        print("详细错误信息：")
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

# 添加一个测试路由
@app.route('/')
def test():
    return jsonify({'message': '服务器运行正常'})

if __name__ == '__main__':
    # 测试数据库连接
    if not test_db_connection():
        print("数据库连接测试失败，请检查数据库配置")
        exit(1)
        
    with app.app_context():
        db.create_all()
    # 修改host和port配置
    app.run(host='0.0.0.0', port=5000, debug=True)