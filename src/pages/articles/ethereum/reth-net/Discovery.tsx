import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { LOOKUP_STEPS, DISC_MESSAGES } from './DiscoveryData';

export default function Discovery({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const sel = LOOKUP_STEPS.find(s => s.step === activeStep);

  return (
    <section id="discovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Discovery v4 (Kademlia)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-discovery', codeRefs['net-discovery'])} />
          <span className="text-[10px] text-muted-foreground self-center">Discv4 구조체</span>
        </div>
        <p className="leading-7">
          <strong>Discv4</strong>는 UDP 기반 노드 디스커버리 프로토콜이다.<br />
          Kademlia DHT(분산 해시 테이블)의 변형으로, 256개 k-bucket에 피어를 XOR 거리 기준으로 분류한다.
        </p>
        <p className="leading-7">
          XOR 거리란 두 노드 ID의 비트별 XOR 연산 결과다.<br />
          같은 접두사(prefix)를 공유하는 노드일수록 거리가 가까우며, bucket 번호가 낮다.<br />
          이 구조 덕분에 O(log N) 홉으로 네트워크의 아무 노드나 탐색할 수 있다.
        </p>

        {/* ── Kademlia 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Kademlia k-bucket 구조</h3>
        <div className="not-prose space-y-3 my-4">
          <p className="text-sm text-foreground/60">노드 ID: 512비트(<code>secp256k1</code> 공개키). 실질 사용: <code>keccak256(pubkey)</code> 256비트.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">KBucketTable</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>buckets: [KBucket; 256]</code> — 비트 거리별 bucket</li>
                <li><code>local_id: NodeId</code> — 내 노드 ID</li>
              </ul>
              <p className="text-sm text-foreground/60 mt-2"><code>bucket[i]</code> = XOR 거리 [2^i, 2^(i+1)) 노드들. 각 bucket 최대 16개(k=16).</p>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">KBucket</p>
              <ul className="text-sm text-foreground/80 space-y-1">
                <li><code>nodes: VecDeque&lt;Node&gt;</code> — 최대 16개</li>
                <li><code>replacement_cache: VecDeque&lt;Node&gt;</code> — 대기 목록</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">XOR 거리 계산</p>
            <p className="text-sm text-foreground/80">
              <code>distance(a, b)</code> = <code>U256::from_be_bytes(a.0) ^ U256::from_be_bytes(b.0)</code><br />
              <code>bucket_index</code> = <code>255 - leading_zeros(distance)</code><br />
              예: <code>local=0xAAAA...</code>, <code>target=0xAAAB...</code> → XOR = <code>0x0001...</code> → <code>bucket[240]</code> 근처
            </p>
          </div>
        </div>
        <p className="leading-7">
          Kademlia의 핵심: <strong>XOR 거리로 가까운 노드 유지</strong>.<br />
          가까운 노드일수록 많은 bucket에 저장 → 정보 밀집.<br />
          먼 노드는 각 bucket에 16개만 → 전체적으로 분산된 view.
        </p>

        {/* ── lookup 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">lookup(target) — iterative 탐색</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">lookup(target) 알고리즘</p>
          <p className="text-sm text-foreground/80 mb-2">target <code>NodeId</code>에 가까운 K(16)개 노드를 iterative하게 탐색.</p>
          <div className="space-y-2">
            <div className="flex gap-3 items-start text-sm border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0 w-8">1</span>
              <span className="text-foreground/80">초기 후보: 내 table에서 target과 가까운 <code>ALPHA</code>(3)개 선택. <code>BinaryHeap</code>으로 관리.</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0 w-8">2</span>
              <span className="text-foreground/80">미조회 후보 중 가장 가까운 <code>ALPHA</code>개에게 <code>FindNode</code> 병렬 발송.</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0 w-8">3</span>
              <span className="text-foreground/80"><code>join_all</code>로 병렬 요청. 응답(각 16개 neighbor)을 후보에 추가.</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-blue-500/50 pl-3">
              <span className="font-mono text-xs text-blue-500 shrink-0 w-8">4</span>
              <span className="text-foreground/80">진전 없으면 종료. 결과: target에 가까운 K(16)개 노드 반환.</span>
            </div>
          </div>
        </div>
        <p className="leading-7">
          lookup은 <strong>iterative 알고리즘</strong>.<br />
          매 라운드 α(3)개 노드에 병렬 쿼리 → 응답으로 더 가까운 노드 확보 → 수렴까지 반복.<br />
          네트워크 크기 N에 대해 O(log N) 라운드 — 10K 노드 기준 ~13 라운드.
        </p>

        {/* ── ENR ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">ENR — Ethereum Node Record (EIP-778)</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">EnrRecord 구조체 (EIP-778)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>signature: Signature</code> — secp256k1 서명</span>
              <span><code>seq: u64</code> — 시퀀스 번호(증가 시 새 버전)</span>
              <span><code>secp256k1: PublicKey</code> — 공개키</span>
              <span><code>id_scheme: String</code> — "v4"</span>
              <span><code>ip: Option&lt;Ipv4Addr&gt;</code> / <code>ip6</code></span>
              <span><code>tcp</code> / <code>tcp6</code> — eth TCP 포트</span>
              <span><code>udp</code> / <code>udp6</code> — discovery UDP 포트</span>
              <span><code>eth2: Option&lt;Eth2Data&gt;</code> — fork_digest 등</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="text-xs text-foreground/60">자체 서명</p>
              <p className="text-xs text-foreground/40">변조 방지</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="text-xs text-foreground/60">확장 가능</p>
              <p className="text-xs text-foreground/40">새 필드 호환</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="text-xs text-foreground/60">시퀀스 번호</p>
              <p className="text-xs text-foreground/40">정보 변경 추적</p>
            </div>
            <div className="rounded border border-border/40 p-2 text-center">
              <p className="text-xs text-foreground/60">이중 스택</p>
              <p className="text-xs text-foreground/40">IPv4/IPv6</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>ENR</code>이 <strong>노드 identity의 정식 표현</strong>.<br />
          secp256k1 서명으로 "이 IP는 이 공개키의 노드"를 증명.<br />
          확장 가능 필드로 eth2 consensus layer 정보도 동일 레코드에 포함.
        </p>

        {/* ── Bootstrap ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Bootstrap — 네트워크 진입</h3>
        <div className="not-prose rounded-lg border border-border/60 bg-muted/30 p-4 my-4">
          <p className="text-xs font-bold text-foreground/70 mb-3">bootstrap() — 네트워크 진입 흐름</p>
          <p className="text-sm text-foreground/60 mb-3">메인넷 기본 bootnode 10~20개 하드코딩(<code>MAINNET_BOOTNODES</code>). EF, Lighthouse, Nethermind 등 다양한 운영자가 제공.</p>
          <div className="space-y-2 mb-3">
            <div className="flex gap-3 items-start text-sm border-l-2 border-green-500/50 pl-3">
              <span className="font-mono text-xs text-green-500 shrink-0 w-8">1</span>
              <span className="text-foreground/80">하드코딩된 부트노드에 <code>PING</code> 발송. <code>EnrRecord::parse</code>로 URL 파싱.</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-green-500/50 pl-3">
              <span className="font-mono text-xs text-green-500 shrink-0 w-8">2</span>
              <span className="text-foreground/80"><code>PONG</code> 응답 수신 → 부트노드를 k-bucket에 추가. 최소 10개 피어 확보.</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-green-500/50 pl-3">
              <span className="font-mono text-xs text-green-500 shrink-0 w-8">3</span>
              <span className="text-foreground/80">자기 자신에 대해 <code>lookup(self.local_id)</code> 실행 → neighbor 수집.</span>
            </div>
            <div className="flex gap-3 items-start text-sm border-l-2 border-green-500/50 pl-3">
              <span className="font-mono text-xs text-green-500 shrink-0 w-8">4</span>
              <span className="text-foreground/80">랜덤 target <code>refresh_buckets()</code> 주기 실행 → 수 분 내 100~300개 피어 파악.</span>
            </div>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-400">Bootnode는 "소개소" 역할만 — lookup 1회 완료 후 일반 피어와 동일. 악의적 부트노드도 일부 유효 피어만 제공하면 OK.</p>
        </div>
        <p className="leading-7">
          Bootnode는 <strong>초기 진입점 역할만</strong> — lookup 완료 후 일반 피어와 동일 취급.<br />
          하드코딩된 IP지만, 여러 운영자(EF, Lighthouse, Nethermind 등)가 각자 제공 → 탈중앙.<br />
          lookup 1회로 네트워크 수백 노드 파악 가능.
        </p>
      </div>

      {/* lookup() algorithm steps */}
      <h3 className="text-lg font-semibold mb-3">lookup() 알고리즘</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {LOOKUP_STEPS.map(s => (
          <button key={s.step}
            onClick={() => setActiveStep(activeStep === s.step ? null : s.step)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeStep === s.step ? s.color : 'var(--color-border)',
              background: activeStep === s.step ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>Step {s.step}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.title}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.step}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>Step {sel.step}: {sel.title}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discovery messages */}
      <h3 className="text-lg font-semibold mb-3">UDP 메시지 타입</h3>
      <div className="not-prose overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">메시지</th>
            <th className="border border-border px-4 py-2 text-left">방향</th>
            <th className="border border-border px-4 py-2 text-left">용도</th>
          </tr></thead>
          <tbody>
            {DISC_MESSAGES.map(m => (
              <tr key={m.name}>
                <td className="border border-border px-4 py-2 font-mono text-xs">{m.name}</td>
                <td className="border border-border px-4 py-2">{m.direction}</td>
                <td className="border border-border px-4 py-2">{m.purpose}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>refresh_buckets()</strong> — 주기적으로 랜덤 target에 대해 lookup을 실행한다.<br />
          이를 통해 Kademlia 버킷이 골고루 채워져 네트워크 연결성을 유지한다.<br />
          부트노드(bootnode)는 초기 접속점으로만 사용되며, lookup 이후에는 일반 피어와 동일하게 취급.
        </p>
      </div>
    </section>
  );
}
