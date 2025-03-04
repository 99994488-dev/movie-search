import React, { useState } from 'react';
import { Form, Input, Button, Row, Col, Select, message, Empty, Table } from 'antd';
import axios from 'axios';

const { Option } = Select;

const Search = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log('发送搜索请求，参数：', values);
      const token = localStorage.getItem('token');
      console.log('当前token：', token);
      
      if (!token) {
        message.error('请先登录');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/movies/search', {
        params: values,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('收到响应：', response.data);
      // 为每条记录添加唯一ID
      const moviesWithId = response.data.map((movie, index) => ({
        ...movie,
        id: `${movie.imdb}-${index}` // 使用IMDB编号和索引组合作为唯一ID
      }));
      setMovies(moviesWithId);
      
      // 如果没有找到结果，显示提示信息
      if (response.data.length === 0) {
        message.info('未找到相关电影信息');
      }
    } catch (error) {
      console.error('搜索失败：', error);
      if (error.response) {
        console.error('错误响应：', error.response.data);
        if (error.response.status === 401) {
          message.error('请先登录');
          // 清除无效的token
          localStorage.removeItem('token');
        } else {
          message.error(error.response.data.error || '搜索失败');
        }
      } else if (error.request) {
        console.error('请求错误：', error.request);
        message.error('无法连接到服务器，请检查网络连接');
      } else {
        console.error('其他错误：', error.message);
        message.error('搜索失败，请稍后重试');
      }
    }
    setLoading(false);
  };

  // 重置年代选择
  const resetYear = () => {
    form.setFieldValue('year', undefined);
  };

  // 表格列定义
  const columns = [
    {
      title: '电影名称',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: '导演',
      dataIndex: 'dir',
      key: 'dir',
      width: '15%',
    },
    {
      title: '年代',
      dataIndex: 'year',
      key: 'year',
      width: '10%',
      sorter: (a, b) => a.year - b.year,
    },
    {
      title: 'IMDB编号',
      dataIndex: 'imdb',
      key: 'imdb',
      width: '15%',
    },
    {
      title: '文件大小',
      dataIndex: 'size',
      key: 'size',
      width: '15%',
    },
    {
      title: '下载链接',
      dataIndex: 'PageUrl',
      key: 'PageUrl',
      width: '20%',
      render: (text) => (
        <a href={text} target="_blank" rel="noopener noreferrer">
          点击下载
        </a>
      ),
    },
  ];

  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{ maxWidth: 1200, margin: '0 auto' }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="name"
              label="电影名称"
            >
              <Input placeholder="输入电影名称" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="imdb"
              label="IMDB编号"
            >
              <Input placeholder="输入IMDB编号" allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="year"
              label="年代"
            >
              <Select 
                placeholder="选择年代"
                allowClear
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children ?? '').toString().toLowerCase().includes(input.toLowerCase())
                }
              >
                <Option value={undefined}>全部年代</Option>
                {Array.from({ length: 150 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <Option key={year} value={year}>{year}年</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="dir"
              label="导演"
            >
              <Input placeholder="输入导演姓名" allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                搜索
              </Button>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Button onClick={resetYear}>
                重置年代
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <div style={{ marginTop: '20px' }}>
        {movies.length > 0 ? (
          <Table
            columns={columns}
            dataSource={movies}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
              onChange: (page, pageSize) => {
                // 当页码或每页条数改变时，重新请求数据
                const currentValues = form.getFieldsValue();
                onFinish({
                  ...currentValues,
                  page,
                  per_page: pageSize
                });
              }
            }}
          />
        ) : (
          <Empty
            description="未找到相关电影信息"
            style={{ margin: '40px 0' }}
          />
        )}
      </div>
    </div>
  );
};

export default Search; 