'use strict';
const assertJump = require('./helpers/assertJump');

var DougEnabled = artifacts.require('../contracts/base/DougEnabled.sol');

contract('DougEnabled', function(accounts) {
  let dougEnabled;

  beforeEach(async function() {
    dougEnabled = await DougEnabled.new();
  });

  it('should have an unintialize DOUG', async function() {
    let doug = await dougEnabled.DOUG();
    assert.isTrue(doug == 0x0);
  });

  it('changes DOUG after setDougAddress', async function() {
    let other = accounts[1];
    await dougEnabled.setDougAddress(other);
    let doug = await dougEnabled.DOUG();
    assert.isTrue(doug === other);
  });

  it('should prevent changing DOUG after setting DOUG once', async function() {
    let other = accounts[1];
    await dougEnabled.setDougAddress(other);
    let doug = await dougEnabled.DOUG();
    assert.isTrue(doug === other);
    try {
      let newDoug = accounts[2];
      await dougEnabled.setDougAddress(newDoug);
      doug = await dougEnabled.DOUG();
      assert.isTrue(doug === other);
    } catch(error) {
      assertJump(error);
    }
  });

  it('should send balance to the DOUG address after destruction', async function() {
    let dougEnabled = await DougEnabled.new({from: accounts[0], value: web3.toWei('10','ether')});
    await dougEnabled.setDougAddress(accounts[0]);
    let dougAddr = await dougEnabled.DOUG();
    let initBalance = web3.eth.getBalance(dougAddr);
    await dougEnabled.destroy({from: dougAddr}); // For if(msg.sender == DOUG)
    let newBalance = web3.eth.getBalance(dougAddr);
    assert.isTrue(newBalance > initBalance);
  });

});
