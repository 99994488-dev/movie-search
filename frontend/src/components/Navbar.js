import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import { HomeOutlined, SearchOutlined, UserOutlined, LoginOutlined } from '@ant-design/icons';

const Navbar = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      key: 'home',
      icon: <HomeOutlined />,
      label: <Link to="/">首页</Link>,
    },
    {
      key: 'search',
      icon: <SearchOutlined />,
      label: <Link to="/search">搜索</Link>,
    },
    {
      key: 'login',
      icon: <LoginOutlined />,
      label: <Link to="/login">登录</Link>,
    },
    {
      key: 'register',
      icon: <UserOutlined />,
      label: <Link to="/register">注册</Link>,
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="horizontal"
      defaultSelectedKeys={['home']}
      items={menuItems}
      style={{ lineHeight: '64px' }}
    />
  );
};

export default Navbar; 