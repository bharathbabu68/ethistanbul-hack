import React from 'react';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button, Navbar, Nav, Card, Badge } from 'react-bootstrap';
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'


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
const styles = {
  navbarBg: '#2c3e50',  // Dark background for navbar
  primaryColor: '#3498db', // Soft blue for primary elements
  secondaryColor: '#2ecc71', // Soft green for secondary elements
  textColor: '#333',  // Dark text for contrast
  cardBg: '#f8f9fa',    // Light background for cards
  cardTitle: '#2c3e50', // Dark blue for card titles
  buttonColor: '#e74c3c', // Soft red for buttons
};

const backgroundStyle = {
  background: "#f0f2f5",
  minHeight: "100vh",
};

const cardStyle = {
  backgroundColor: styles.cardBg,
  borderRadius: '10px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  padding: '15px',
  margin: '15px 0',
};

const cardTitleStyle = {
  color: styles.cardTitle,
  fontSize: '1.1rem',
  fontWeight: 'bold',
};

const cardSubtitleStyle = {
  color: styles.secondaryColor,
  paddingBottom: '10px',
};

const cardTextStyle = {
  color: '#4a4a4a',
  fontSize: '0.9rem',
  marginBottom: '15px',
};

const buttonStyle = {
  backgroundColor: styles.buttonColor,
  borderColor: 'transparent',
};

  const Platform = () => {
    const activeBets = [
        {
          question: 'Predict the Winner of the Italian Grand Prix',
          sport: 'Formula 1',
          createdTime: '11/11/2023, 10:00 AM EST',
          closingDateTime: '12/12/2024, 13:23 PM EST',
          eligibleTokens: ['$MERC', '$ASTONMARTIN'],
          poolValue: '890 USD',
          minTokens: 20,
          numberOfBettors: 6
        },
        {
            question: 'Predict the Winner of the Italian Grand Prix',
            sport: 'Formula 1',
            createdTime: '11/11/2023, 10:00 AM EST',
            closingDateTime: '12/12/2024, 13:23 PM EST',
            eligibleTokens: ['$MERC', '$ASTONMARTIN'],
            poolValue: '890 USD',
            minTokens: 20,
            numberOfBettors: 6
          },
          {
            question: 'Predict the Winner of the Italian Grand Prix',
            sport: 'Formula 1',
            createdTime: '11/11/2023, 10:00 AM EST',
            closingDateTime: '12/12/2024, 13:23 PM EST',
            eligibleTokens: ['$MERC', '$ASTONMARTIN'],
            poolValue: '890 USD',
            minTokens: 20,
            numberOfBettors: 6
          },
          {
            question: 'Predict the Winner of the Italian Grand Prix',
            sport: 'Formula 1',
            createdTime: '11/11/2023, 10:00 AM EST',
            closingDateTime: '12/12/2024, 13:23 PM EST',
            eligibleTokens: ['$MERC', '$ASTONMARTIN'],
            poolValue: '890 USD',
            minTokens: 20,
            numberOfBettors: 6
          },
        // Add more bet objects here
    ];

    
    const [account, setAccount] = useState('')
    const [connectWalletStatus, setConnectWalletStatus] = useState('Connect Wallet')
    const [accountTrimmed, setAccountTrimmed] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState()
    const [explorerUrl, setExplorerUrl] = useState()


    const web3Modal = new Web3Modal({
        theme: "dark",
        network: "mainnet", // optional
        cacheProvider: true, // optional
    });


    async function connectWallet() {
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection);
        const signer = provider.getSigner()
        setProvider(provider)
        setSigner(signer)
        const account = await signer.getAddress()
        setAccount(account)
        var account_trimmed = account.substring(0, 4) + "..." + account.substring(account.length - 4, account.length)
        setAccountTrimmed(account_trimmed)
        const network = await provider.getNetwork()
        const balance = await provider.getBalance(account)
        const balanceinEther =  Number(ethers.utils.formatEther(balance))
        // round it to two decimals
        const balanceinEtherFormatted = balanceinEther.toFixed(2)
        console.log(balanceinEther)
        setAccountBalance(balanceinEtherFormatted)
        setConnectWalletStatus("Wallet Connected")
        console.log(account)

      }


    return (
        <div style={backgroundStyle}>
            <Navbar expand="lg" style={{ backgroundColor: chilizStyles.navbarBg }}>
                <Container fluid>
                    <Navbar.Brand href="/" style={{ color: chilizStyles.textColor }}>BetChiliz 🎰</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="" style={{ color: chilizStyles.textColor }}>My Bets</Nav.Link>
                            <Nav.Link href="" style={{ color: chilizStyles.textColor }}>About</Nav.Link>
                            <Nav.Link href="" style={{ color: chilizStyles.textColor }}>Contact</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container style={{ marginTop: "3%", textAlign:"left" }}>
                     <Row>
                    <Col md={10}>
                    <h2 style={{ textAlign: 'left'}}>Your Wallet</h2>
                    </Col>
                    <Col md={2}>
                        <Button onClick={connectWallet} variant='dark'>{connectWalletStatus}</Button>
                    </Col>
                 </Row>
                 
                 <p>Connected Wallet: {account}</p>
                 <p>Tokens Detected in Wallet</p>  
                 <hr />
                 <h2 style={{ textAlign: 'left'}}>Active Betting Pools</h2>
                <p>Place bets with your $FAN Tokens and get a chance to win the prize pool !</p>
                <Row xs={1} md={2} lg={3} className="g-4">
                    {activeBets.map((bet, idx) => (
                        <Col key={idx}>
                            <Card style={cardStyle}>
                                <Card.Header>
                                    <Card.Title style={cardTitleStyle}>{bet.question}</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <Card.Subtitle className="mb-2">
                                        <Badge bg="secondary" style={{ backgroundColor: chilizStyles.secondaryColor }}>{bet.sport}</Badge>
                                    </Card.Subtitle>
                                    <Card.Text style={cardTextStyle}>
                                        <strong>Created:</strong> {bet.createdTime}<br/>
                                        <strong>Closing:</strong> {bet.closingDateTime}<br/>
                                        <strong>Eligible Tokens:</strong> {bet.eligibleTokens.join(', ')}<br/>
                                        <strong>Pool Value:</strong> {bet.poolValue}<br/>
                                        <strong>Minimum Tokens:</strong> {bet.minTokens}<br/>
                                        <strong>Bettors:</strong> {bet.numberOfBettors}
                                    </Card.Text>
                                    <Button variant='primary'>Place Bet</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );
}

export default Platform;