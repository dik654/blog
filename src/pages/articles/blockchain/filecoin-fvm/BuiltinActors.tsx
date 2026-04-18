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

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Core System</h4>
            <ul className="text-xs space-y-1">
              <li><code>0x00</code> <strong>System</strong> — bootstrap</li>
              <li><code>0x01</code> <strong>Init</strong> — Actor 생성</li>
              <li><code>0x02</code> <strong>Reward</strong> — 블록 보상</li>
              <li><code>0x03</code> <strong>Cron</strong> — 주기적 태스크</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Storage System</h4>
            <ul className="text-xs space-y-1">
              <li><code>0x04</code> <strong>StoragePower</strong> — 활성 마이너 추적</li>
              <li><code>0x05</code> <strong>StorageMarket</strong> — 딜 관리</li>
              <li><code>0x06</code> <strong>VerifiedRegistry</strong> — FIL+</li>
              <li><code>0x07</code> <strong>StorageMiner</strong> — 마이너별 상태</li>
              <li><code>0x0d</code> <strong>DataCap</strong> — FIL+ DataCap</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Payment &amp; Accounts</h4>
            <ul className="text-xs space-y-1">
              <li><code>0x08</code> <strong>Multisig</strong> — 다중 서명</li>
              <li><code>0x09</code> <strong>PaymentChannel</strong> — 마이크로페이먼트</li>
              <li><code>0x0a</code> <strong>Account</strong> — 일반 계정</li>
              <li><code>0x0b</code> <strong>Placeholder</strong> — 사전 등록</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EVM Support (2023+)</h4>
            <ul className="text-xs space-y-1">
              <li><code>0x0e</code> <strong>EAM</strong> — EVM Actor Manager</li>
              <li><code>0x0f</code> <strong>EVMActor</strong> — Solidity 런타임</li>
              <li><code>0x10</code> <strong>EthAccount</strong> — ETH 주소</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">StorageMinerActor <code>0x07</code></h4>
            <p className="text-xs text-muted-foreground mb-1">SP(Storage Provider)별 인스턴스. 섹터 관리, PoSt 제출, 결함 처리, 데드라인 추적, 보상 청구</p>
            <p className="text-xs"><code>PreCommitSector</code>, <code>ProveCommit</code>, <code>DeclareFaults</code>, <code>SubmitWindowedPoSt</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">StorageMarketActor <code>0x05</code></h4>
            <p className="text-xs text-muted-foreground mb-1">딜 레지스트리, 검증, 정산, 슬래싱</p>
            <p className="text-xs"><code>PublishStorageDeals</code>, <code>ActivateDeals</code>, <code>OnMinerSectorsTerminate</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">StoragePowerActor <code>0x04</code></h4>
            <p className="text-xs text-muted-foreground mb-1">전체 네트워크 파워, 마이너별 파워, 마이너 등록</p>
            <p className="text-xs"><code>CreateMiner</code>, <code>UpdateClaimedPower</code>, <code>EnrollCronEvent</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">RewardActor <code>0x02</code></h4>
            <p className="text-xs text-muted-foreground mb-1">블록 보상 계산, 베스팅 스케줄, 청구</p>
            <p className="text-xs"><code>AwardBlockReward</code>, <code>UpdateNetworkKPI</code></p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EAM <code>0x0e</code> + EVMActor <code>0x0f</code></h4>
            <p className="text-xs text-muted-foreground mb-1">EAM: EVM 컨트랙트 배포, Delegated 주소 생성 (<code>Create</code>, <code>Create2</code>)</p>
            <p className="text-xs">EVMActor: Solidity 런타임, 컨트랙트 인스턴스별 EVM opcode + 표준 스토리지 모델</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Actor 업그레이드</h4>
            <p className="text-xs text-muted-foreground mb-1">네트워크 업그레이드 시 새 WASM 배포, 필요 시 상태 마이그레이션, Actor CID 변경. FIP를 통해 제안</p>
            <p className="text-xs">Shark (FEVM 도입) → Hygge → Lightning → Dragon</p>
          </div>
        </div>
        <p className="leading-7">
          15+ Built-in Actors: <strong>System, Storage, Market, Power, Reward, EVM</strong>.<br />
          WASM code CID로 관리 → network upgrade 시 교체.<br />
          FEVM (EAM + EVMActor)이 Solidity 지원.
        </p>
      </div>
    </section>
  );
}
