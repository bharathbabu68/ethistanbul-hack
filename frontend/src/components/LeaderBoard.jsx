import React from 'react';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Container, Row, Col, Button, Navbar, Nav, Card, Badge, Table, Modal, Form } from 'react-bootstrap';
import { BigNumber, ethers } from 'ethers'
import Web3Modal from 'web3modal'



const {erc20Abi} = require("../resources/erc20Abi")
const {poolBettingAbi} = require("../resources/poolBettingAbi")

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


  const LeaderBoard = () => {


    useEffect(() => {
        connectWallet();
      }, []);

    const [show, setShow] = useState(false);
const [selectedPool, setSelectedPool] = useState(null);

const handleClose = () => setShow(false);



    const supportedTokens = [
        { name: 'Aston Martin Fan Token', symbol: 'ASTON', address: '0x47d75EE96a4603f310Ef3CD4564d3050301Ce785', quantity: 0 },
        { name: 'Mercedes Fan Token', symbol: 'MERC', address: '0xB1bcA2bcED1F215d4DD4cC8ef98Cb3b3f434c2c3', quantity: 0 },
        { name: 'Alfa Romeo Fan Token', symbol: 'ALFA', address: '0xf6e87dc0589eA568Cc027C03C86184101544BF68', quantity: 0 },
        { name: 'Ferrari Fan Token', symbol: 'FERR', address: '0xA7b40eB4D7257EF38dCD5FA3BB720A2a38055C7d', quantity: 0 },
        // Add more tokens here
    ];


    const leaderboardData = [
        { name: '0x3427e266EdAf22a4ba80961D983e89E75cD3fc01', symbol: '12000', address: '24'},
        { name: '0x5A5D02cdb3D8904d996feD9911EdfFe070d6E6EF', symbol: '8700', address: '14'},
        { name: '0x0A04d6c616A334d7d9951b897FedDCEe87618c36', symbol: '5500', address: '12'},
        { name: '0x0d83d5D75772F1dc0e8273a0C9f363A42473B8Bd', symbol: '2000', address: '9'},
        // Add more tokens here
    ];

    const [tokensInWallet, setTokensInWallet] = useState([])
    const [allPools, setAllPools] = useState([])

    
    const [account, setAccount] = useState('')
    const [connectWalletStatus, setConnectWalletStatus] = useState('Connect Wallet')
    const [accountTrimmed, setAccountTrimmed] = useState('')
    const [accountBalance, setAccountBalance] = useState('')
    const [provider, setProvider] = useState()
    const [signer, setSigner] = useState()
    const [explorerUrl, setExplorerUrl] = useState()
    const [poolBettingContract, setPoolBettingContract] = useState()

    const [contractAddressTokenBet, setContractAddressTokenBet] = useState("")
    const [amountTokenBet, setAmountTokenBet] = useState("")
    const [selectedPoolId, setSelectedPoolId] = useState("")
    const [betAnswer, setBetAnswer] = useState("")


    const web3Modal = new Web3Modal({
        theme: "dark",
        network: "mainnet", // optional
        cacheProvider: true, // optional
    });

    async function placeBet(poolId) {

        console.log("Clicked pool ID is ", poolId)

        setSelectedPoolId(poolId)

        setShow(true)

        
        
        // calculate possible token options and store in array
        // out of tokens in wallet, calculate which token symbols are accepted based on pool ID -> all Pools contains all details
        // based on this allow the user to choose which token they want to bet and how much they want to bet -> provide all the options in the modal. 
        //once all chosen and submitted (i.e button in modal is clicked, then the token must be approved to transfer to given smart contract)
        // then call place Token Bet function in smart contract to place the bet


    }



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
        var tempArray = []
        for(var i=0; i<supportedTokens.length;i++){

            const contract = new ethers.Contract(supportedTokens[i].address, erc20Abi, signer)
            const balance = await contract.balanceOf(account)

            if(balance>0){
                supportedTokens[i].quantity = balance.toString()
                tempArray.push(supportedTokens[i])
            }
        }
        setTokensInWallet(tempArray)
        console.log("Heere")
        const PoolBettingContract = new ethers.Contract(process.env.REACT_APP_POOL_BETTING_CONTRACT_ADDRESS,poolBettingAbi, signer)
        setPoolBettingContract(PoolBettingContract)
        const allPools = await PoolBettingContract.getAllPools()
        const poolIds = allPools.poolIds
        const numberOfBettors = allPools.numberOfBettors
        const totalValuesinPool = allPools.totalValues
        const tokenNames = allPools.tokenNames
        const tokenSymbols = allPools.tokenSymbols
        const tokenValues = allPools.tokenValues
        const createdTimestamps = allPools.createdTimestamps
        const deadlines = allPools.deadlines
        const sports = allPools.sports
        const questions = allPools.questions
        const outcomes = allPools.outcomes
        const completedStatuses = allPools.completedStatuses


        const allData = []

        for(var i=0;i<poolIds.length;i++){


            var totalBetofUser = 0;
            var betAnswerOfUser = "";
            var bettedTokenSymbols = []
            var bettedTokenAmounts = []

            const userBets = await PoolBettingContract.getUserBets(i, account)

            for(var j=0;j<userBets.length;j++){
                if(Number(userBets[j].betAmount) > 0){

                    bettedTokenSymbols.push(userBets[j].tokenSymbol)
                    bettedTokenAmounts.push(userBets[j].betAmount)
                    totalBetofUser+=Number(userBets[j].betAmount)
                    betAnswerOfUser = userBets[j].betAnswer

                }

            }

            var obj = {
                poolId: poolIds[i].toString(),
                sport: sports[i],
                question: questions[i],
                outcome: outcomes[i],
                completedStatus: completedStatuses[i],
                createdTimestamp: createdTimestamps[i].toString(),
                deadline: deadlines[i].toString(),
                numberOfBettors: numberOfBettors[i].toString(),
                totalValues: totalValuesinPool[i].toString(),
                supportedTokenNames: tokenNames[i],
                supportedTokenSymbols: tokenSymbols[i],
                currentokenValuesinPool: tokenValues[i],
                totalBetofGivenUser: totalBetofUser,
                bettedTokenSymbolsOfUser : bettedTokenSymbols.toString(),
                bettedTokenAmountsofUser: bettedTokenAmounts.toString(),   
                betAnswerOfUser: betAnswerOfUser             
            }

            allData.push(obj)
        }

       console.log(allData)


        
        setAllPools(allData);


      }

      async function placeBetOnChain() {

        // first need to approve transfer to contract

        const erc20contract = new ethers.Contract(contractAddressTokenBet, erc20Abi, signer)
        const tx = await erc20contract.approve(process.env.REACT_APP_POOL_BETTING_CONTRACT_ADDRESS, amountTokenBet)
        await tx.wait()
        const tx2 = await poolBettingContract.placeTokenBet(contractAddressTokenBet, amountTokenBet, selectedPoolId, betAnswer)
        await tx2.wait()
        setShow(false)
        alert("Your bet has been placed successfully ")
        window.location.reload()
      }


    return (
        <>

        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Place Bet </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Label>Enter contract address & no of tokens you want to bet </Form.Label>
                <Form.Control onChange={(e)=>setContractAddressTokenBet(e.target.value)} type="text" placeholder="Enter contract address of the token you want to bet" />
                <br />
                <Form.Control onChange={(e)=>setAmountTokenBet(e.target.value)} type="text" placeholder="Enter number of tokens you want to bet" />
                <br />
                <Form.Control onChange={(e)=>setBetAnswer(e.target.value)} type="text" placeholder="Enter who you want to bet for" />
                <br />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={placeBetOnChain}>
                    Place Bet
                </Button>
            </Modal.Footer>
        </Modal>



        <div style={backgroundStyle}>
            <Navbar expand="lg" style={{ backgroundColor: chilizStyles.navbarBg }}>
                <Container fluid>
                    <Navbar.Brand href="/" style={{ color: chilizStyles.textColor }}>BetChiliz 🎰</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="/platform" style={{ color: chilizStyles.textColor }}>Platform</Nav.Link>
                            <Nav.Link href="/my-bets" style={{ color: chilizStyles.textColor }}>My Bets</Nav.Link>
                            <Nav.Link href="/leaderboard" style={{ color: chilizStyles.textColor }}>Leaderboard</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Container style={{ marginTop: "3%", textAlign:"left" }}>
                     <Row>
                    <Col md={10}>
                    <h2 style={{ textAlign: 'left'}}>LeaderBoard</h2>
                    </Col>
                    <Col md={2}>
                        <Button onClick={connectWallet} variant='dark'>{connectWalletStatus}</Button>
                    </Col>
                 </Row>
                 <br />
                 
                 <p>Connected Wallet: {account}</p>
                 <h5>On-chain Betting Leaderboard</h5> 
                 <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>User Wallet Address</th>
                        <th>Number of Tokens Won</th>
                        <th>Number of Betting Pools Participated in</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboardData.map((token, idx) => (
                        <tr key={idx}>
                            <td>{token.name}</td>
                            <td>{token.symbol}</td>
                            <td>{token.address}</td>
                        </tr>
                    ))}
                </tbody>
            </Table> 
            <br />
                 <hr />
                 <br />

            </Container>
        </div>
        </>
    );
}

export default LeaderBoard;