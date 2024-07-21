// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title PaxmataProjects
 * @dev ERC721 token contract with storage for data hashes and linkage to milestone contracts.
 */
contract PaxmataProjects is ERC721URIStorage, ERC721Enumerable, AccessControl {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Mapping from token ID to data hash
    mapping(uint256 => string) private _dataHashes;

    // Mapping from token ID to milestone contract address
    mapping(uint256 => address) public milestoneContracts;

    // Event for data hash updates
    event DataHashUpdated(
        uint256 indexed tokenId,
        string oldDataHash,
        string newDataHash,
        uint256 timestamp,
        address updatedBy
    );

    // Event for linking milestone contracts
    event MilestoneContractLinked(uint256 indexed tokenId, address milestoneContract);

    // Event for minting tokens
    event Minted(uint256 indexed tokenId, address to, string metadataUrl, string initialDataHash);

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Constructor that grants admin and minter roles to the deployer.
     */
    constructor() ERC721("PaxmataProjects", "PAXMAP") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }

    /**
     * @dev Mint a new token with metadata URL and initial data hash.
     * @param to The address to receive the token.
     * @param metadataUrl The metadata URI of the token.
     * @param initialDataHash The initial data hash associated with the token.
     */
    function safeMint(
        address to,
        string memory metadataUrl,
        string memory initialDataHash
    ) public onlyRole(MINTER_ROLE) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, metadataUrl);
        _dataHashes[tokenId] = initialDataHash;

        // Emit Minted event
        emit Minted(tokenId, to, metadataUrl, initialDataHash);
    }

    /**
     * @dev Update the data hash of a specific token.
     * @param tokenId The token ID.
     * @param newDataHash The new data hash to associate with the token.
     */
    function updateDataHash(uint256 tokenId, string memory newDataHash) public {
        require(hasRole(MINTER_ROLE, msg.sender) || address(this) == msg.sender, "Caller is not authorized to update hash");
        require(_exists(tokenId), "Query for nonexistent token");
        string memory oldDataHash = _dataHashes[tokenId];
        _dataHashes[tokenId] = newDataHash;
        emit DataHashUpdated(tokenId, oldDataHash, newDataHash, block.timestamp, msg.sender);
    }

    /**
     * @dev Get the data hash associated with a specific token.
     * @param tokenId The token ID.
     * @return The data hash.
     */
    function getDataHash(uint256 tokenId) public view returns (string memory) {
        require(_exists(tokenId), "Query for nonexistent token");
        return _dataHashes[tokenId];
    }

    /**
     * @dev Link a milestone contract to a token.
     * @param tokenId The token ID.
     * @param milestoneContract The address of the milestone contract.
     */
    function linkMilestoneContract(uint256 tokenId, address milestoneContract) external onlyRole(MINTER_ROLE) {
        require(_exists(tokenId), "ERC721: Milestone link to nonexistent token");
        milestoneContracts[tokenId] = milestoneContract;
        emit MilestoneContractLinked(tokenId, milestoneContract);
    }

    /**
     * @dev Get the milestone contract address linked to a specific token.
     * @param tokenId The token ID.
     * @return The address of the milestone contract.
     */
    function getMilestoneContract(uint256 tokenId) external view returns (address) {
        return milestoneContracts[tokenId];
    }

    // Overrides required by Solidity
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721Enumerable, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721URIStorage, ERC721) {
        super._burn(tokenId);
        // Clear the data hash and milestone contract upon burning the token
        delete _dataHashes[tokenId];
        delete milestoneContracts[tokenId];
    }

    function tokenURI(uint256 tokenId) public view override(ERC721URIStorage, ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev Get a list of token IDs owned by a specific address.
     * @param owner The owner address.
     * @return An array of token IDs.
     */
    function getTokenIdsOwnedBy(address owner) public view returns (uint256[] memory) {
        uint256 ownerTokenCount = balanceOf(owner);
        uint256[] memory tokensIds = new uint256[](ownerTokenCount);
        for (uint256 i = 0; i < ownerTokenCount; i++) {
            tokensIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokensIds;
    }
}
