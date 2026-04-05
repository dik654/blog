import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function BuiltinActors({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="builtin-actors" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Built-in Actors</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fvm-machine', codeRefs['fvm-machine'])} />
          <span className="text-[10px] text-muted-foreground self-center">BuiltinActor enum</span>
        </div>
        <p>
          StorageMiner: 섹터 관리, PoSt 제출, 보상 청구. SP의 핵심 인터페이스.<br />
          StorageMarket: 스토리지 딜 생성, 검증, 정산. 클라이언트-SP 간 계약 관리
        </p>
        <p>
          StoragePower: SP 파워(저장 용량)를 추적. 블록 보상 분배 기준.<br />
          EAM: EVM Actor Manager — Solidity 컨트랙트를 FEVM으로 배포/실행
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 Actor 업그레이드</strong> — 네트워크 업그레이드 시 Built-in Actor를 교체 가능.<br />
          WASM 코드 CID만 변경하면 되므로 하드포크 없이도 로직 업데이트가 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Built-in Actors 전체 목록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Filecoin Built-in Actors (15+):

// Core System:
// 0x00 - System: bootstrap
// 0x01 - Init: creates actors
// 0x02 - Reward: block rewards
// 0x03 - Cron: periodic tasks

// Storage System:
// 0x04 - StoragePower: active miners tracking
// 0x05 - StorageMarket: deals management
// 0x06 - VerifiedRegistry: FIL+
// 0x07 - StorageMinerActor: per-miner state
// 0x0d - DataCapActor: FIL+ DataCap

// Payment:
// 0x08 - Multisig: multi-sig accounts
// 0x09 - PaymentChannel: micropayments

// Accounts:
// 0x0a - AccountActor: regular accounts
// 0x0b - Placeholder: pre-registered

// EVM Support (2023+):
// 0x0e - EAM (EVM Actor Manager)
// 0x0f - EVMActor: Solidity runtime
// 0x10 - EthAccount: ETH addresses

// Actor Details:

// StorageMinerActor (0x07):
// - per storage provider
// - sector management
// - PoSt submission
// - fault handling
// - deadline tracking
// - reward claiming
// - methods: PreCommitSector, ProveCommit,
//   DeclareFaults, SubmitWindowedPoSt, ...

// StorageMarketActor (0x05):
// - deal registry
// - deal validation
// - payment settlement
// - slashing
// - methods: PublishStorageDeals, ActivateDeals,
//   OnMinerSectorsTerminate, ...

// StoragePowerActor (0x04):
// - total network power
// - per-miner power
// - miner registration
// - methods: CreateMiner, UpdateClaimedPower,
//   EnrollCronEvent, ...

// RewardActor (0x02):
// - block reward calculation
// - vesting schedules
// - claiming
// - methods: AwardBlockReward,
//   UpdateNetworkKPI, ...

// EAM (0x0e):
// - deploys EVM contracts
// - creates Delegated addresses
// - bytecode deployment
// - methods: Create, Create2

// EVMActor (0x0f):
// - Solidity runtime
// - per contract instance
// - EVM opcodes
// - storage (standard Ethereum model)

// Actor Upgrades:
// - network upgrade → new WASM
// - state migration (if needed)
// - Actor CID changes
// - via FIPs (Filecoin Improvement Proposals)

// Examples of upgrades:
// - Shark: FEVM introduction (2023)
// - Hygge: more EVM features
// - Lightning: optimizations
// - Dragon: advanced features`}
        </pre>
        <p className="leading-7">
          15+ Built-in Actors: <strong>System, Storage, Market, Power, Reward, EVM</strong>.<br />
          WASM code CID로 관리 → network upgrade 시 교체.<br />
          FEVM (EAM + EVMActor)이 Solidity 지원.
        </p>
      </div>
    </section>
  );
}
