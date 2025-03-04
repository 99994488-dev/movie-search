import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      // 注册
      await axios.post('http://localhost:5000/api/register', values);
      message.success('注册成功，正在登录...');
      
      // 自动登录
      const loginResponse = await axios.post('http://localhost:5000/api/login', {
        username: values.username,
        password: values.password
      });
      
      console.log('登录响应：', loginResponse.data);
      
      if (loginResponse.data.access_token) {
        localStorage.setItem('token', loginResponse.data.access_token.trim());
        message.success('登录成功');
        navigate('/search');
      } else {
        message.error('登录失败：未收到token');
      }
    } catch (error) {
      console.error('注册/登录失败：', error);
      if (error.response) {
        message.error(error.response.data.message || '注册失败');
      } else {
        message.error('注册失败，请检查网络连接');
      }
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <Card title="用户注册">
        <Form
          name="register"
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
            name="email"
            label="电子邮箱"
            rules={[
              { required: true, message: '请输入电子邮箱' },
              { type: 'email', message: '请输入有效的电子邮箱地址' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少6位' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="确认密码"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              注册
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 