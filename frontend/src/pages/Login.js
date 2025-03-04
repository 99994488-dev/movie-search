import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', values);
      console.log('登录响应：', response.data);
      
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token.trim());
        message.success('登录成功');
        navigate('/search');
      } else {
        message.error('登录失败：未收到token');
      }
    } catch (error) {
      console.error('登录失败：', error);
      if (error.response) {
        message.error(error.response.data.message || '登录失败');
      } else {
        message.error('登录失败，请检查网络连接');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Card title="用户登录">
        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 