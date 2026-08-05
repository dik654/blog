import SapphireFlowViz from './viz/SapphireFlowViz';
import SapphireCodeViz from './viz/SapphireCodeViz';
import CalldataEncryptViz from './viz/CalldataEncryptViz';
import RuntimeDecryptViz from './viz/RuntimeDecryptViz';
import SoliditySampleViz from './viz/SoliditySampleViz';

export default function Sapphire({ title }: { title?: string }) {
  return (
    <section id="sapphire" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'Sapphire: 기밀 EVM'}</h2>
      <div className="not-prose mb-8"><SapphireFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Sapphire 개요</h3>
        <p>
          <strong>Sapphire</strong>: EVM 호환 기밀 ParaTime — 2023년 메인넷 런칭<br />
          <strong>SGX 기반</strong>: 컴퓨트 노드가 엔클레이브 안에서 Geth 포크 실행<br />
          <strong>Ethereum 호환</strong>: Metamask, Hardhat, Foundry 그대로 사용<br />
          <strong>추가 API</strong>: 기밀 스토리지, ROFL(off-chain), 기밀 난수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기밀성 특성</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          {[
            { name: '상태 암호화', desc: '컨트랙트 스토리지가 SGX 내에서만 복호화. 외부는 암호문만 관측.' },
            { name: '트랜잭션 기밀성', desc: 'calldata를 클라이언트가 KM 공개키로 암호화. SGX 내에서만 복호화.' },
            { name: '기밀 난수', desc: 'SGX 내 CSPRNG으로 생성. 외부 예측 불가. (Chainlink VRF 불필요)' },
            { name: 'msg.sender 보호', desc: '기밀 컨텍스트에서 발신자 주소 숨김 옵션.' },
          ].map(f => (
            <div key={f.name} className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="font-semibold text-sm text-emerald-400">{f.name}</p>
              <p className="text-sm mt-1 text-foreground/75">{f.desc}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Calldata 암호화 흐름</h3>
      </div>
      <div className="not-prose mb-4"><CalldataEncryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Runtime 측 복호화</h3>
      </div>
      <div className="not-prose mb-4"><RuntimeDecryptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Solidity 측 API</h3>
      </div>
      <div className="not-prose mb-4"><SoliditySampleViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">기밀 컨트랙트 · 키 파생 · Ethereum 호환</h3>
      </div>
      <SapphireCodeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sapphire vs ZK-based privacy</p>
          <p>
            <strong>Sapphire(TEE)</strong>:<br />
            ✓ EVM 바이트코드 그대로 실행 — 기존 Solidity 호환<br />
            ✓ 성능 네이티브 — ZK 증명 생성 오버헤드 없음<br />
            ✓ 임의 복잡도 로직 가능<br />
            ✗ TEE 신뢰 필요 (Intel vendor)<br />
            ✗ Side-channel 공격 가능성
          </p>
          <p className="mt-2">
            <strong>Aztec/Aleo(ZK)</strong>:<br />
            ✓ 수학적 보장 — 하드웨어 신뢰 불필요<br />
            ✓ 영구적 (post-quantum)<br />
            ✗ 새 언어·DSL 필요 (Noir, Leo)<br />
            ✗ 증명 생성 수초~수분
          </p>
          <p className="mt-2">
            <strong>실무 선택</strong>:<br />
            - Sapphire: 기존 DApp 마이그레이션, 복잡 로직, 낮은 지연<br />
            - ZK chain: 최고 보안성, 단순 로직, 증명 수락 가능한 UX
          </p>
        </div>

      </div>
    </section>
  );
}
