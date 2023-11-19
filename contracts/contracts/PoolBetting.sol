// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract PoolBetting is Ownable {

    struct UserStat {
        address user;
        uint totalTokensBet;
        uint NumberofPools;
    }
  
    struct UserBet {
        mapping(address => uint256) tokenBets; 
        string answer; 
    }

    struct BetDetails {
        address tokenAddress;
        string tokenName;
        string tokenSymbol;
        uint256 betAmount;
        string betAnswer;
    }


    struct BettingPool {
        uint256 poolId;
        string sport;
        string question;
        string outcome; 
        uint256 createdTimestamp;
        uint256 deadline; 
        bool completed;
        address[] supportedTokens; 
        mapping(address => uint256) tokenPoolAmount; 
        address[] users; 
        mapping(address => UserBet) userBets; 
    }

    BettingPool[] public allPools;
    UserStat[] public userStats;
    mapping(address=>UserStat) public addresstoUserStatMapping;
    uint256 public poolIdCounter;
    uint256 public platformFeePercentage; 
    address public feeCollector; 


    // Events
    event PoolCreated(uint256 indexed poolId, string sport, string question);
    event BetPlaced(uint256 indexed poolId, address indexed user, address token, uint256 amount);
    event OutcomeSet(uint256 indexed poolId, string outcome);
    event RewardsDistributed(uint256 indexed poolId);

    constructor(address initialOwner, uint256 _platformFeePercentage, address _feeCollector) Ownable(initialOwner) {
        require(_platformFeePercentage <= 100, "Fee percentage cannot exceed 100");
        platformFeePercentage = _platformFeePercentage;
        feeCollector = _feeCollector;
    }

    function createBettingPool(
    string memory sport,
    string memory question,
    uint256 timeToDeadline,
    address[] memory supportedTokens
) public onlyOwner returns (uint256) {
    require(timeToDeadline > 0, "Deadline must be in the future");
    require(supportedTokens.length > 0, "At least one supported token required");

    BettingPool storage newPool = allPools.push(); 
    newPool.poolId = poolIdCounter;
    newPool.sport = sport;
    newPool.question = question;
    newPool.createdTimestamp = block.timestamp;
    newPool.deadline = block.timestamp + timeToDeadline * 1 days;
    newPool.completed = false;
    newPool.supportedTokens = supportedTokens;

    emit PoolCreated(poolIdCounter, sport, question);

    poolIdCounter++;
    return newPool.poolId;
}

    function placeTokenBet(
    address tokenAddress,
    uint256 betAmount,
    uint256 poolId,
    string memory answer
) public {
    require(poolId < poolIdCounter, "Invalid pool ID");
    BettingPool storage pool = allPools[poolId];
    require(block.timestamp < pool.deadline, "Betting pool deadline has passed");
    require(bytes(answer).length > 0, "Answer cannot be empty");

    // Check if the token is eligible for betting
    bool tokenEligible = false;
    for (uint256 i = 0; i < pool.supportedTokens.length; i++) {
        if (pool.supportedTokens[i] == tokenAddress) {
            tokenEligible = true;
            break;
        }
    }
    require(tokenEligible, "Token not eligible for betting");

    // Transfer tokens from the bettor to the contract
    IERC20(tokenAddress).transferFrom(msg.sender, address(this), betAmount);

    // Update user's bet information
    UserBet storage userBet = pool.userBets[msg.sender];
    userBet.tokenBets[tokenAddress] += betAmount;
    userBet.answer = answer;

    // Update the total amount for the token in the pool
    pool.tokenPoolAmount[tokenAddress] += betAmount;

    UserStat storage userStatValue =  addresstoUserStatMapping[msg.sender];
    if(userStatValue.NumberofPools==0){
        userStatValue.user = msg.sender;
        userStatValue.NumberofPools++;
        userStatValue.totalTokensBet+=betAmount;
        userStats.push(userStatValue);
        addresstoUserStatMapping[msg.sender] = userStatValue;
    }
    else{
        userStatValue.totalTokensBet+=betAmount;
    }

    // Add the user to the pool if not already present
    if (!userInPool(poolId, msg.sender)) {
        userStatValue.NumberofPools++;
        pool.users.push(msg.sender);
    }


    emit BetPlaced(poolId, msg.sender, tokenAddress, betAmount);
}


    function userInPool(uint256 poolId, address user) internal view returns (bool) {
        BettingPool storage pool = allPools[poolId];
        for (uint256 i = 0; i < pool.users.length; i++) {
            if (pool.users[i] == user) {
                return true;
            }
        }
        return false;
    }

       function setOutcome(uint256 poolId, string memory _outcome) public onlyOwner {
        BettingPool storage pool = allPools[poolId];
        require(!pool.completed, "Pool is already completed");
        require(bytes(pool.outcome).length == 0, "Outcome already set");
        pool.outcome = _outcome;

        emit OutcomeSet(poolId, _outcome);
    }

    function distributeRewards(uint256 poolId) public onlyOwner {
    BettingPool storage pool = allPools[poolId];
    require(!pool.completed, "Rewards already distributed");
    require(bytes(pool.outcome).length > 0, "Outcome not available");

    pool.completed = true;

    uint256 totalWinnerBet = 0;
    for (uint256 i = 0; i < pool.users.length; i++) {
        UserBet storage userBet = pool.userBets[pool.users[i]];
        if (keccak256(abi.encodePacked(userBet.answer)) == keccak256(abi.encodePacked(pool.outcome))) {
            totalWinnerBet += calculateUserTotalBet(userBet, pool.supportedTokens);
        }
    }

    for (uint256 i = 0; i < pool.supportedTokens.length; i++) {
        address tokenAddress = pool.supportedTokens[i];
        uint256 tokenPoolAmount = pool.tokenPoolAmount[tokenAddress];
        uint256 feeAmount = tokenPoolAmount * platformFeePercentage / 100;
        tokenPoolAmount -= feeAmount;
        if(feeAmount>0)
            IERC20(tokenAddress).transfer(feeCollector, feeAmount);
        uint256 distributedAmount = 0;

        for (uint256 j = 0; j < pool.users.length; j++) {
            address user = pool.users[j];
            UserBet storage userBet = pool.userBets[user];

            if (keccak256(abi.encodePacked(userBet.answer)) == keccak256(abi.encodePacked(pool.outcome))) {
                uint256 userTotalBet = calculateUserTotalBet(userBet, pool.supportedTokens);
                uint256 userShare = (userTotalBet * tokenPoolAmount) / totalWinnerBet;
                userShare = userShare - (userShare % 1); 
                distributedAmount += userShare;
                if(userShare>0)
                    IERC20(tokenAddress).transfer(user, userShare);
            }
        }

        uint256 remainder = tokenPoolAmount - distributedAmount;
        if (remainder > 0) {
            IERC20(tokenAddress).transfer(feeCollector, remainder);
        }
    }
}




function calculateTotalPoolSize(uint256 poolId) internal view returns (uint256) {
        BettingPool storage pool = allPools[poolId];
        uint256 totalPoolSize = 0;

        for (uint256 i = 0; i < pool.supportedTokens.length; i++) {
            totalPoolSize += pool.tokenPoolAmount[pool.supportedTokens[i]];
        }

        return totalPoolSize;
    }

    function calculateUserTotalBet(UserBet storage userBet, address[] memory supportedTokens) internal view returns (uint256) {
        uint256 userTotalBet = 0;

        for (uint256 i = 0; i < supportedTokens.length; i++) {
            userTotalBet += userBet.tokenBets[supportedTokens[i]];
        }

        return userTotalBet;
    }

    function distributeFee(address[] memory supportedTokens, uint256 feeAmount, uint256 poolId) internal {
    for (uint256 i = 0; i < supportedTokens.length; i++) {
        address token = supportedTokens[i];
        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        uint256 feeTokenAmount = (feeAmount * tokenBalance) / calculateTotalPoolSize(poolId);

        feeTokenAmount = feeTokenAmount - (feeTokenAmount % 1); // Round down

        if (feeTokenAmount > 0) {
            IERC20(token).transfer(feeCollector, feeTokenAmount);
        }
    }
}

    function distributeTokensToWinner(BettingPool storage pool, address winner, uint256 userShare, uint256 randNonce) internal {
    uint256 tokenCount = pool.supportedTokens.length;
    for (uint256 i = 0; i < tokenCount; i++) {
        // Pseudo-random index selection
        uint256 idx = (i + randNonce) % tokenCount;
        address token = pool.supportedTokens[idx];
        
        uint256 tokenBalance = IERC20(token).balanceOf(address(this));
        uint256 userTokenShare = (userShare * tokenBalance) / calculateTotalPoolSize(pool.poolId);

        userTokenShare = userTokenShare - (userTokenShare % 1); // Round down

        if (userTokenShare > 0 && tokenBalance >= userTokenShare) {
            IERC20(token).transfer(winner, userTokenShare);
        }
    }
}




    function getPoolDetails(uint256 poolId) public view returns (address[] memory, uint256[] memory) {
    require(poolId < allPools.length, "Invalid pool ID");

    BettingPool storage pool = allPools[poolId];
    uint256 tokenCount = pool.supportedTokens.length;

    address[] memory tokens = new address[](tokenCount);
    uint256[] memory amounts = new uint256[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
        address tokenAddress = pool.supportedTokens[i];
        tokens[i] = tokenAddress;
        amounts[i] = pool.tokenPoolAmount[tokenAddress];
    }

    return (tokens, amounts);
}

function getPoolBettors(uint256 poolId) public view returns (address[] memory, address[][] memory, uint256[][] memory) {
    require(poolId < allPools.length, "Invalid pool ID");

    BettingPool storage pool = allPools[poolId];
    uint256 userCount = pool.users.length;

    address[] memory bettors = new address[](userCount);
    address[][] memory betTokens = new address[][](userCount);
    uint256[][] memory betAmounts = new uint256[][](userCount);

    for (uint256 i = 0; i < userCount; i++) {
        address bettor = pool.users[i];
        bettors[i] = bettor;

        UserBet storage userBet = pool.userBets[bettor];
        uint256 tokenCount = pool.supportedTokens.length;

        address[] memory tokens = new address[](tokenCount);
        uint256[] memory amounts = new uint256[](tokenCount);

        for (uint256 j = 0; j < tokenCount; j++) {
            address tokenAddress = pool.supportedTokens[j];
            tokens[j] = tokenAddress;
            amounts[j] = userBet.tokenBets[tokenAddress];
        }

        betTokens[i] = tokens;
        betAmounts[i] = amounts;
    }

    return (bettors, betTokens, betAmounts);
}

function getAllPools() public view returns (
    uint256[] memory poolIds,
    string[] memory sports,
    string[] memory questions,
    string[] memory outcomes,
    uint256[] memory createdTimestamps,
    uint256[] memory deadlines,
    bool[] memory completedStatuses,
    uint256[] memory numberOfBettors,
    uint256[] memory totalValues,
    string[][] memory tokenNames,
    string[][] memory tokenSymbols,
    uint256[][] memory tokenValues
) {
    uint256 poolCount = allPools.length;
    poolIds = new uint256[](poolCount);
    sports = new string[](poolCount);
    questions = new string[](poolCount);
    outcomes = new string[](poolCount);
    createdTimestamps = new uint256[](poolCount);
    deadlines = new uint256[](poolCount);
    completedStatuses = new bool[](poolCount);
    numberOfBettors = new uint256[](poolCount);
    totalValues = new uint256[](poolCount);
    tokenNames = new string[][](poolCount);
    tokenSymbols = new string[][](poolCount);
    tokenValues = new uint256[][](poolCount);

    for (uint256 i = 0; i < poolCount; i++) {
        BettingPool storage pool = allPools[i];
        poolIds[i] = pool.poolId;
        sports[i] = pool.sport;
        questions[i] = pool.question;
        outcomes[i] = pool.outcome;
        createdTimestamps[i] = pool.createdTimestamp;
        deadlines[i] = pool.deadline;
        completedStatuses[i] = pool.completed;
        numberOfBettors[i] = pool.users.length;
        uint256 tokenCount = pool.supportedTokens.length;
        tokenNames[i] = new string[](tokenCount);
        tokenSymbols[i] = new string[](tokenCount);
        tokenValues[i] = new uint256[](tokenCount);
        uint256 totalValue = 0;

        for (uint256 j = 0; j < tokenCount; j++) {
            address tokenAddress = pool.supportedTokens[j];
            uint256 tokenAmount = pool.tokenPoolAmount[tokenAddress];
            totalValue += tokenAmount;
            tokenValues[i][j] = tokenAmount;
            IERC20 token = IERC20(tokenAddress);
            tokenNames[i][j] = token.name();
            tokenSymbols[i][j] = token.symbol();
        }

        totalValues[i] = totalValue;
    }

    return (
        poolIds,
        sports,
        questions,
        outcomes,
        createdTimestamps,
        deadlines,
        completedStatuses,
        numberOfBettors,
        totalValues,
        tokenNames,
        tokenSymbols,
        tokenValues
    );
}


function getUserBets(uint256 poolId, address userAddress) public view returns (BetDetails[] memory) {
    require(poolId < allPools.length, "Invalid pool ID");

    BettingPool storage pool = allPools[poolId];
    UserBet storage userBet = pool.userBets[userAddress];
    uint256 tokenCount = pool.supportedTokens.length;

    BetDetails[] memory bets = new BetDetails[](tokenCount);

    for (uint256 i = 0; i < tokenCount; i++) {
        address tokenAddress = pool.supportedTokens[i];
        IERC20 token = IERC20(tokenAddress);

        bets[i] = BetDetails({
            tokenAddress: tokenAddress,
            tokenName: token.name(),
            tokenSymbol: token.symbol(),
            betAmount: userBet.tokenBets[tokenAddress],
            betAnswer: userBet.answer
        });
    }

    return bets;
}

function getAllUserStats() public view returns(UserStat[] memory){
    return userStats;
}

}
