import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Navbar, Nav, Card } from 'react-bootstrap';

// Revised Chiliz Styles with Lighter Colors
const chilizStyles = {
  navbarBg: '#343a40',  // Softer dark background for navbar
  primaryColor: '#e74c3c',   // Lighter shade of red
  secondaryColor: '#f0ad4e', // Lighter shade of orange
  textColor: '#fdfdfd',  // Almost white text color for contrast
  cardBg: '#ffffff',    // White background for cards
  cardTitle: '#2c3e50', // Soft dark blue for card titles
};

// Updated Background Style for Lighter Look
const backgroundStyle = {
    background: "#D3CCE3",  /* fallback for old browsers */
    background: "-webkit-linear-gradient(to right, #E9E4F0, #D3CCE3)",  /* Chrome 10-25, Safari 5.1-6 */
    background: "linear-gradient(to right, #E9E4F0, #D3CCE3)", /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    height: "100vh"
};

const Home = () => {
  return (
    <div style={backgroundStyle}>
      <Navbar expand="lg" style={{ backgroundColor: chilizStyles.navbarBg }}>
        <Container fluid>
          <Navbar.Brand href="" style={{ color: chilizStyles.textColor }}>BetChiliz 🎰</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/platform" style={{ color: chilizStyles.textColor}}>Launch Platform</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container style={{ marginTop: "8%", marginBottom: "5%" }}>
        <h1 style={{ fontSize: "3.2rem", textAlign: 'center' }}>Welcome to BetChiliz 🎰</h1>
        <p style={{ fontSize: "1.2rem", textAlign: 'center' }}>
          Your One Stop Platform for On-Chain Betting with Fan Tokens
        </p>

        <Row style={{ marginTop: "4rem" }}>
          <Col md={4}>
            <Card style={{ padding: "4%", backgroundColor: chilizStyles.cardBg }}>
              <Card.Body>
                <Card.Title style={{ color: chilizStyles.cardTitle }}>Support for all $FAN Tokens</Card.Title>
                <Card.Text>
                  Access to a wide range of fan tokens for a diverse betting experience.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card style={{ padding: "4%", backgroundColor: chilizStyles.cardBg }}>
              <Card.Body>
                <Card.Title style={{ color: chilizStyles.cardTitle }}>Built on Chiliz Chain</Card.Title>
                <Card.Text>
                  Leveraging the power of the Chiliz blockchain for secure and fast transactions.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card style={{ padding: "4%", backgroundColor: chilizStyles.cardBg }}>
              <Card.Body>
                <Card.Title style={{ color: chilizStyles.cardTitle }}>Gamified Betting</Card.Title>
                <Card.Text>
                  Engaging and interactive betting experiences with gamification elements.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <br />
        <Button href='/platform' variant="primary" style={{ backgroundColor: chilizStyles.primaryColor, borderColor: 'transparent', marginTop: '2rem' }}>
          Launch Platform 🚀
        </Button>
      </Container>
    </div>
  );
}

export default Home;
