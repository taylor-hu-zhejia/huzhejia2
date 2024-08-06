const  XYZCoin  =  artifacts.require("XYZCoin");
const truffleAssert = require('truffle-assertions');

contract("XYZCoin", async accounts => { 
    it("should set the token name correctly", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        assert.equal(await xyzCoinInstance.name(), "XYZCoin");
    });
    it("should verify initial token balance equals total token supply", async () => {
         let xyzCoinInstance = await XYZCoin.deployed();
         let creatorBalance = await xyzCoinInstance.balanceOf(accounts[0]);
         let totalSupply = await xyzCoinInstance.totalSupply();
         assert.equal(creatorBalance.toString(), totalSupply.toString(), "Initial balance not equal to total supply");
});
    it("should transfer tokens using the transfer() function", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let amount = web3.utils.toBN(100); 
        let sender = accounts[0];
        let receiver = accounts[1];
        let senderBalance = await xyzCoinInstance.balanceOf(sender);
        await xyzCoinInstance.transfer(receiver, amount, { from: sender });
        let receiverBalance = await xyzCoinInstance.balanceOf(receiver);
        assert.equal(senderBalance.toString(), '1000', "Sender balance incorrect after transfer");
        assert.equal(receiverBalance.toString(), amount.toString(), "Receiver balance incorrect after transfer");
});
    it("should set and read allowance correctly", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let owner = accounts[0];
        let spender = accounts[1];
        let amount = web3.utils.toBN(1000); 
        await xyzCoinInstance.approve(spender, amount, { from: owner });
        let allowance = await xyzCoinInstance.allowance(owner, spender);
        assert.equal(allowance.toString(), amount.toString(), "Allowance not set correctly");
});
    it("should transfer tokens on behalf of another account", async () => {
        let xyzCoinInstance = await XYZCoin.deployed();
        let owner = accounts[0];
        let spender = accounts[1];
        let receiver = accounts[2];
        let amount = web3.utils.toBN(400); 
        await xyzCoinInstance.approve(spender, amount, { from: owner });
         await xyzCoinInstance.transferFrom(owner, receiver, amount, { from: spender });
         let ownerBalance = await xyzCoinInstance.balanceOf(owner);
         let receiverBalance = await xyzCoinInstance.balanceOf(receiver);
         assert.equal(ownerBalance.toString(), '500', "Owner balance incorrect after transferFrom");
         assert.equal(receiverBalance.toString(), amount.toString(), "Receiver balance incorrect after transferFrom");
});
it("should throw an error when transferring with insufficient balance", async () => {
    let xyzCoinInstance = await XYZCoin.deployed();
    let amount = web3.utils.toBN(1100); 
    let sender = accounts[0];
    let receiver = accounts[1];
    
    await truffleAssert.fails(
        xyzCoinInstance.transfer(receiver, amount, { from: sender }),
        truffleAssert.ErrorType.REVERT 
    );
});
it("should fire the Transfer event for transfers", async () => {
    let xyzCoinInstance = await XYZCoin.deployed();
    let amount = web3.utils.toBN(0);  
    let sender = accounts[0];
    let receiver = accounts[1];
    
    const result = await xyzCoinInstance.transfer(receiver, amount, { from: sender });
    truffleAssert.eventEmitted(result, 'Transfer');
});
it("should fire the Approval event", async () => {
    let xyzCoinInstance = await XYZCoin.deployed();
    let owner = accounts[0];
    let spender = accounts[1];
    let amount = web3.utils.toBN(1000);
    
    const result = await xyzCoinInstance.approve(spender, amount, { from: owner });
    truffleAssert.eventEmitted(result, 'Approval');
});
});
