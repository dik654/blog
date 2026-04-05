import OasisLayerViz from './viz/OasisLayerViz';
import OasisArchFlowViz from './viz/OasisArchFlowViz';
import LayerDesignViz from './viz/LayerDesignViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '개요 & 2계층 아키텍처'}</h2>
      <div className="not-prose mb-8"><OasisLayerViz /></div>
      <div className="not-prose mb-8">
        <h3 className="text-lg font-semibold mb-3">2계층 아키텍처 플로우</h3>
        <OasisArchFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Oasis Network 등장 배경</h3>
        <p>
          <strong>Oasis Network</strong>: 2020년 메인넷 런칭 — TEE 기반 기밀 컴퓨팅 전용 L1<br />
          <strong>핵심 문제</strong>: Ethereum의 공개 트랜잭션 모델 → 금융·의료 데이터 처리 불가<br />
          <strong>해결</strong>: 실행을 TEE(Intel SGX/TDX) 안에서 → 입력·상태·출력 전부 기밀
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2계층 분리 설계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 계층 책임 분리

// Consensus Layer (합의 계층)
// - CometBFT(구 Tendermint) BFT 합의
// - 검증인 관리, 스테이킹, 거버넌스
// - ParaTime의 루트 해시만 커밋
// - 자체 트랜잭션 실행 X
// - 수십~수백 TPS

// Runtime Layer (ParaTime)
// - 독립된 실행 환경 (shard와 유사하지만 heterogeneous)
// - 각 ParaTime이 고유 VM·정책·TEE 설정
// - 컴퓨트 노드가 병렬로 실행
// - 결과를 Consensus에 batch commit
// - 각 ParaTime별 수천 TPS 가능

// 주요 ParaTime
// - Sapphire: 기밀 EVM (TEE 필수)
// - Emerald: 일반 EVM (TEE 선택)
// - Cipher: Wasm 기반 기밀 (experimental)`}</pre>
        <p>
          <strong>분리의 의의</strong>: Consensus는 보안·안정성 최우선, Runtime은 성능·유연성 최우선<br />
          <strong>Cosmos와 유사</strong>: Oasis ParaTime ≈ Cosmos Zone<br />
          <strong>차이</strong>: Oasis는 TEE 기밀성을 1차 요건으로, 합의 레이어가 명시적 shared security 제공
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">계층 구조 상세</h3>
        <div className="not-prose space-y-2 my-4">
          {[
            {
              name: '합의 계층 (Consensus Layer)',
              color: '#6366f1',
              items: ['CometBFT 기반 BFT 합의 (2/3 정족수)', '검증인 관리 & 스테이킹 (≥100 ROSE delegation)', '거버넌스 & 레지스트리 (노드·ParaTime 등록)', '루트해시 서비스 (Runtime 상태 루트 커밋)', 'Staking module: 위임·보상·slashing'],
            },
            {
              name: '런타임 계층 (Runtime Layer / ParaTime)',
              color: '#10b981',
              items: ['컴퓨트 워커: 트랜잭션 실행 (TEE 안에서)', 'Storage 워커: Merkle Patricia Trie 저장', '키매니저: per-contract 암호화 키 관리', 'Client 노드: 게이트웨이/RPC', 'Sapphire: EVM + 기밀 스토리지'],
            },
          ].map(l => (
            <div key={l.name} className="rounded-xl border p-4"
              style={{ borderColor: l.color + '30', background: l.color + '06' }}>
              <p className="font-semibold text-sm mb-2" style={{ color: l.color }}>{l.name}</p>
              <ul className="space-y-1">
                {l.items.map(i => (
                  <li key={i} className="text-sm text-foreground/75 flex gap-2">
                    <span className="text-foreground/30">•</span>{i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Full Node 진입점</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// go/oasis-node/cmd/node/node.go

// 노드 실행 시
func Run(cmd *cobra.Command, args []string) {
    // 1) 설정 로드
    cfg := config.GlobalConfig

    // 2) Common infra 초기화 (Identity, P2P, IPC)
    commonSvc := common.NewService()

    // 3) Consensus backend 시작 (CometBFT)
    consensusSvc := tendermint.New(cfg)

    // 4) Runtime host 시작 (활성화된 경우)
    if cfg.Runtime.Mode == RuntimeModeCompute {
        runtimeHost := runtime.NewHost(cfg)
        runtimeHost.Start()
    }

    // 5) Service 등록 & 메인 루프
    node.Register(commonSvc, consensusSvc, runtimeHost)
    node.Run()
}

// Node는 역할별 서비스 조합
// - Consensus only  → 검증인 노드
// - Compute + Consensus → ParaTime 실행 노드
// - Storage → Storage 워커 노드
// - Client → 쿼리 전용 게이트웨이`}</pre>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('full-service', codeRefs['full-service'])} />
            <span className="text-[10px] text-muted-foreground self-center">full.go · 합의 노드</span>
            <CodeViewButton onClick={() => onCodeRef('executor-worker', codeRefs['executor-worker'])} />
            <span className="text-[10px] text-muted-foreground self-center">worker.go · 런타임 워커</span>
          </div>
        )}

        <h3 className="text-xl font-semibold mt-8 mb-3">경쟁 기술과의 위치</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로젝트</th>
                <th className="border border-border px-3 py-2 text-left">TEE 활용</th>
                <th className="border border-border px-3 py-2 text-left">기밀성 범위</th>
                <th className="border border-border px-3 py-2 text-left">EVM 호환</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><strong>Oasis Sapphire</strong></td>
                <td className="border border-border px-3 py-2">SGX/TDX 필수</td>
                <td className="border border-border px-3 py-2">Per-contract 암호화</td>
                <td className="border border-border px-3 py-2">Yes (솔리디티)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Secret Network</td>
                <td className="border border-border px-3 py-2">SGX 필수</td>
                <td className="border border-border px-3 py-2">네트워크 전체 암호화</td>
                <td className="border border-border px-3 py-2">No (CosmWasm)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Phala Network</td>
                <td className="border border-border px-3 py-2">SGX 필수</td>
                <td className="border border-border px-3 py-2">Phat Contract 내부</td>
                <td className="border border-border px-3 py-2">No (Ink!/PRuntime)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Aleo</td>
                <td className="border border-border px-3 py-2">ZK (not TEE)</td>
                <td className="border border-border px-3 py-2">ZK-SNARK 기반</td>
                <td className="border border-border px-3 py-2">No (Leo)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Aztec</td>
                <td className="border border-border px-3 py-2">ZK (not TEE)</td>
                <td className="border border-border px-3 py-2">ZK-SNARK 기반</td>
                <td className="border border-border px-3 py-2">No (Noir)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">분리 설계의 장점</h3>
      </div>
      <LayerDesignViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>1. 독립적 확장</strong>: 합의 TPS 제약 없이 ParaTime별 병렬 실행<br />
          <strong>2. Heterogeneous VM</strong>: EVM, Wasm, 네이티브 Go 코드 혼합 가능<br />
          <strong>3. 선택적 기밀성</strong>: TEE 필요 ParaTime만 SGX 요구<br />
          <strong>4. Hot-swappable runtime</strong>: ParaTime 바이너리 교체 가능 (거버넌스 통해)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Oasis의 TEE 의존성</p>
          <p>
            <strong>SGX/TDX 필수</strong>: Sapphire 컴퓨트 노드는 하드웨어 TEE 없으면 실행 불가<br />
            <strong>리스크</strong>:
          </p>
          <p className="mt-2">
            ✗ SGX EOL — Intel이 클라이언트 CPU SGX 단계적 종료<br />
            ✗ TDX 전환 필요 — 서버급 CPU만 지원 → 노드 진입 장벽<br />
            ✗ 사이드채널 공격에 TEE 공통 취약 (AEPIC, Downfall 등)<br />
            ✗ Intel 의존성 — vendor lock-in
          </p>
          <p className="mt-2">
            <strong>대응</strong>:<br />
            - AMD SEV-SNP, ARM CCA 지원 진행 중<br />
            - Multi-TEE attestation 추상화 레이어 설계<br />
            - ZK 보완 연구 (TEE+ZK 하이브리드)
          </p>
        </div>

      </div>
    </section>
  );
}
