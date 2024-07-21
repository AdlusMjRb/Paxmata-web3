// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./StateChannel.sol";

contract PaxmataProjectsV1 is ERC721URIStorage, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => address) public stateChannels;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant CHANNEL_ADMIN_ROLE = keccak256("CHANNEL_ADMIN_ROLE");

    event StateChannelOpened(uint256 indexed tokenId, address stateChannel);
    event AccessGranted(uint256 indexed tokenId, address user);

    constructor() ERC721("PaxmataProjectsV1", "PAXMAP") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MINTER_ROLE, msg.sender);
    }

    function safeMint(address to, string memory metadataUrl) public onlyRole(MINTER_ROLE) {
        require(bytes(metadataUrl).length > 0, "Metadata URL cannot be empty");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataUrl);

        // Deploy a new StateChannel contract for each new NFT
        StateChannel stateChannel = new StateChannel(address(this), tokenId, to);
        stateChannels[tokenId] = address(stateChannel);

        _grantRole(CHANNEL_ADMIN_ROLE, to);
        emit StateChannelOpened(tokenId, address(stateChannel));
    }

    function grantAccess(uint256 tokenId, address user) public {
        require(hasRole(CHANNEL_ADMIN_ROLE, msg.sender), "Caller is not a channel admin");
        require(stateChannels[tokenId] != address(0), "No state channel exists for this tokenId");
        AccessControl(stateChannels[tokenId]).grantRole(CHANNEL_ADMIN_ROLE, user);
        emit AccessGranted(tokenId, user);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
        delete stateChannels[tokenId];
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721Enumerable, ERC721URIStorage, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }
}
