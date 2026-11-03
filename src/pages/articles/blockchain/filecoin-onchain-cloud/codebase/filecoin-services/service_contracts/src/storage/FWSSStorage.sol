// FilOzone/filecoin-services v1.5.0
// service_contracts/src/storage/FWSSStorage.sol
// Exact source excerpt. PlannedUpgrade and unrelated storage fields are omitted.

// SPDX-License-Identifier: Apache-2.0 OR MIT
pragma solidity 0.8.37;

/// @dev Legacy slots 0-23. Preserve field order, types and packing in every inheriting module.
abstract contract FWSSStorage {
    struct DataSetInfo {
        uint256 pdpRailId; // ID of the PDP payment rail
        uint256 cacheMissRailId; // For CDN add-on: ID of the cache miss payment rail, which rewards the SP for serving data to the CDN when it doesn't already have it cached
        uint256 cdnRailId; // For CDN add-on: ID of the CDN payment rail, which rewards the CDN for serving data to clients
        address payer; // Address paying for storage
        address payee; // SP's beneficiary address
        address serviceProvider; // Current service provider of the dataset
        uint256 commissionBps; // Commission rate for this data set (dynamic based on whether the client purchases CDN add-on)
        uint256 clientDataSetId; // ClientDataSetID
        uint256 pdpEndEpoch; // 0 if PDP rail are not terminated
        uint256 providerId; // Provider ID from the ServiceProviderRegistry
        uint96 pendingOneTimePayments; // fees accumulated since last flush via updateStorageRates
        uint96 lifecycleReserveBalance; // local mirror of rail's lockupFixed; decremented on flush
    }

    // Track which proving periods have valid proofs with bitmap
    mapping(uint256 dataSetId => mapping(uint256 periodId => uint256)) internal provenPeriods;
    // Track when proving was first activated for each data set
    mapping(uint256 dataSetId => uint256) internal provingActivationEpoch;

    mapping(uint256 dataSetId => uint256) internal provingDeadlines;
    mapping(uint256 dataSetId => bool) internal provenThisPeriod;

    mapping(uint256 dataSetId => DataSetInfo) internal dataSetInfo;
    mapping(uint256 pdpRailId => uint256) internal railToDataSet;
}
