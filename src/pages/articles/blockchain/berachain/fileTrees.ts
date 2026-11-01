import type { FileNode } from "@/components/code/types";

const f = (name: string, path: string, codeKey?: string): FileNode => ({
  name,
  type: "file",
  path,
  codeKey,
});
const d = (name: string, children: FileNode[]): FileNode => ({
  name,
  type: "dir",
  children,
});

export const berachainSources: FileNode = d("Berachain · pinned sources", [
  d("beacon-kit · v1.4.1", [
    d("beacon/validator", [
      f(
        "block_builder.go",
        "beacon-kit/beacon/validator/block_builder.go",
        "beaconkit-payload",
      ),
    ]),
    d("state-transition/core/state", [
      f(
        "statedb.go",
        "beacon-kit/state-transition/core/state/statedb.go",
        "beaconkit-inflation",
      ),
    ]),
  ]),
  d("bera-reth · v1.4.4", [
    d("src/transaction", [
      f("pol.rs", "bera-reth/src/transaction/pol.rs", "reth-pol-transaction"),
    ]),
    d("src/node/evm", [
      f("executor.rs", "bera-reth/src/node/evm/executor.rs", "reth-pol-first"),
    ]),
  ]),
  d("contracts · 70e392fc", [
    d("src/pol/rewards", [
      f(
        "Distributor.sol",
        "contracts/src/pol/rewards/Distributor.sol",
        "distributor-route",
      ),
      f(
        "BlockRewardController.sol",
        "contracts/src/pol/rewards/BlockRewardController.sol",
        "reward-controller",
      ),
      f(
        "BeraChef.sol",
        "contracts/src/pol/rewards/BeraChef.sol",
        "berachef-allocation",
      ),
      f(
        "RewardVault.sol",
        "contracts/src/pol/rewards/RewardVault.sol",
        "vault-migration",
      ),
    ]),
    d("src/base", [
      f(
        "StakingRewards.sol",
        "contracts/src/base/StakingRewards.sol",
        "vault-accounting",
      ),
    ]),
  ]),
]);
