import SapphireDetailViz from './viz/SapphireDetailViz';
import PrecompileViz from './viz/PrecompileViz';
import StorageSlotEncViz from './viz/StorageSlotEncViz';
import RoflFlowViz from './viz/RoflFlowViz';
import SignedQueryViz from './viz/SignedQueryViz';

export default function SapphireDetail() {
  return (
    <section id="sapphire-detail" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sapphire EVM 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>암호화 파이프라인</strong>: X25519 키 교환 → DeoxysII AEAD →
          SGX EVM 실행 → AES-256-GCM 상태 암호화<br />
          입력(calldata)부터 출력(returnData)까지 전 과정 암호화<br />
          노드 운영자, 관리자, 다른 vCPU 전부 평문 접근 불가<br />
          <strong>Precompile</strong>로 SGX 전용 암호 연산 노출
        </p>
      </div>

      <SapphireDetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Storage Slot 암호화</h3>
      </div>
      <div className="not-prose mb-4"><StorageSlotEncViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">Sapphire Precompiles</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Address</th>
                <th className="border border-border px-3 py-2 text-left">Precompile</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...01</td>
                <td className="border border-border px-3 py-2"><code>randomBytes</code></td>
                <td className="border border-border px-3 py-2">CSPRNG 난수 (TEE 내부)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...02</td>
                <td className="border border-border px-3 py-2"><code>x25519Derive</code></td>
                <td className="border border-border px-3 py-2">ECDH 키 파생</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...03</td>
                <td className="border border-border px-3 py-2"><code>deoxysII_encrypt</code></td>
                <td className="border border-border px-3 py-2">AEAD 암호화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...04</td>
                <td className="border border-border px-3 py-2"><code>deoxysII_decrypt</code></td>
                <td className="border border-border px-3 py-2">AEAD 복호화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...05</td>
                <td className="border border-border px-3 py-2"><code>keypairGenerate</code></td>
                <td className="border border-border px-3 py-2">X25519/Ed25519 키쌍</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...06</td>
                <td className="border border-border px-3 py-2"><code>sign</code></td>
                <td className="border border-border px-3 py-2">ECDSA/EdDSA 서명</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...07</td>
                <td className="border border-border px-3 py-2"><code>verify</code></td>
                <td className="border border-border px-3 py-2">서명 검증</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0x0100000000...09</td>
                <td className="border border-border px-3 py-2"><code>subcall</code></td>
                <td className="border border-border px-3 py-2">Runtime call from EVM (ROFL)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">ROFL — Runtime OFfchain Logic</h3>
      </div>
      <div className="not-prose mb-4"><RoflFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">암호화 프리컴파일</h3>
      </div>
      <PrecompileViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">view function 호출 — Sign+Read 모델</h3>
      </div>
      <div className="not-prose mb-4"><SignedQueryViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Sapphire의 실전 사용 사례</p>
          <p>
            <strong>활발한 카테고리</strong>:<br />
            - <strong>Confidential DeFi</strong>: MEV 보호, front-running 방어<br />
            - <strong>Private NFT</strong>: 소유자만 메타데이터 열람<br />
            - <strong>Sealed-bid Auctions</strong>: 입찰 종료 후만 공개<br />
            - <strong>Identity</strong>: 영지식 증명 대안 (TEE 기반)
          </p>
          <p className="mt-2">
            <strong>한계</strong>:<br />
            ✗ SGX Quote 검증 실패 시 노드 오프라인<br />
            ✗ Public data와 혼용 시 leak 가능성 (storage 분리 필요)<br />
            ✗ TEE 취약점 발견 시 전체 노드 업그레이드 필요
          </p>
          <p className="mt-2">
            <strong>생태계 규모</strong>:<br />
            - TVL 수천만 ~ 억 달러 수준<br />
            - Ethereum 대비 훨씬 작지만 독자 포지션<br />
            - 기밀성 필수 유스케이스의 사실상 표준
          </p>
        </div>

      </div>
    </section>
  );
}
