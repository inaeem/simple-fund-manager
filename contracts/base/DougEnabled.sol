pragma solidity ^0.4.11;


/**
 * @title DougEnabled
 * @dev The DougEnabled contract has an DOUG address, and provides basic authorization control functions.
 */
contract DougEnabled {
    address public DOUG;

    function DougEnabled() payable { } 

    function setDougAddress(address dougAddr) returns (bool result){
        // Once the doug address is set, don't allow it to be set again.
        if(DOUG != 0x0 && dougAddr != DOUG){
            return false;
        }
        DOUG = dougAddr;
        return true;
    }

    // Makes it so that Doug is the only contract that may kill it.
    // All funds in contract will be sent to the DOUG address
    function destroy(){
        if(msg.sender == DOUG){
            selfdestruct(DOUG);
        }
    }

}
