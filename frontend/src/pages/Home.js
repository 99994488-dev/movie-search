import React from 'react';
import { Card, Row, Col, Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'IMDB编号搜索',
      description: '通过IMDB编号快速查找电影信息',
      icon: '🔍'
    },
    {
      title: '高级筛选',
      description: '支持按年代、导演等多维度筛选',
      icon: '🎯'
    },
    {
      title: '会员特权',
      description: '成为会员享受更多高级功能',
      icon: '👑'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Title>欢迎使用电影搜索网站</Title>
        <Paragraph>
          专业的电影信息查询平台，为您提供全面的电影资料和下载链接
        </Paragraph>
        <Button type="primary" size="large" onClick={() => navigate('/search')}>
          开始搜索
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {features.map((feature, index) => (
          <Col xs={24} sm={8} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '100%' }}
            >
              <div style={{ fontSize: '40px', marginBottom: '20px' }}>
                {feature.icon}
              </div>
              <Title level={3}>{feature.title}</Title>
              <Paragraph>{feature.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <Title level={2}>会员特权</Title>
        <Paragraph>
          成为会员仅需199元/月，享受以下特权：
        </Paragraph>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li>✓ 无限次搜索</li>
          <li>✓ 高级筛选功能</li>
          <li>✓ 优先技术支持</li>
          <li>✓ 专属客服服务</li>
        </ul>
        <Button type="primary" size="large" onClick={() => navigate('/register')}>
          立即注册
        </Button>
      </div>
    </div>
  );
};

export default Home; 