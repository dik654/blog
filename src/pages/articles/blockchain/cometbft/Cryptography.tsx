import CodePanel from "@/components/ui/code-panel";
import { CitationBlock } from "../../../../components/ui/citation";
import CryptoFlowViz from "./viz/CryptoFlowViz";
import {
  CRYPTO_STACK_CODE,
  CRYPTO_STACK_ANNOTATIONS,
  SIGN_VERIFY_CODE,
  SIGN_VERIFY_ANNOTATIONS,
  SIG_COMPARE_TABLE,
} from "./CryptographyData";
import type { CodeRef } from "@/components/code/types";

const CELL = "border border-border px-4 py-2";

export default function Cryptography({
  onCodeRef: _onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="cryptography" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호화 & 보안</h2>
      <div className="not-prose mb-8">
        <CryptoFlowViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT는 세 가지 핵심 암호화 프리미티브(Cryptographic Primitive,
          기본 암호 연산)를 조합합니다.
          <strong>SHA-256</strong>(해시), <strong>Ed25519</strong>(기본 서명),{" "}
          <strong>ChaCha20-Poly1305</strong>(P2P 암호화)입니다. 추가 key type의
          지원 범위는 CometBFT와 이를 사용하는 application의 버전에 따라
          달라지므로, validator key를 정할 때 실제 build의 지원 목록을 함께
          확인해야 합니다.
        </p>
        <CitationBlock
          source="cometbft/crypto/ed25519"
          citeKey={10}
          type="code"
          href="https://github.com/cometbft/cometbft/tree/main/crypto/ed25519"
        >
          <div className="text-xs text-foreground/70 space-y-1">
            <p>
              Ed25519 — <code>PubKeySize=32</code> /{" "}
              <code>PrivateKeySize=64</code> / <code>SignatureSize=64</code>{" "}
              (bytes)
            </p>
            <p>
              빠른 서명 생성/검증, 사이드 채널 공격 저항성, 결정론적 서명. 배치
              검증 + 캐싱 검증기로 성능 최적화
            </p>
          </div>
        </CitationBlock>
        <h3 className="text-xl font-semibold mt-6 mb-3">
          암호화 스택 전체 구조
        </h3>
        <CodePanel
          title="해시 + 서명 + 머클 + P2P 보안"
          code={CRYPTO_STACK_CODE}
          annotations={CRYPTO_STACK_ANNOTATIONS}
        />
        <h3 className="text-xl font-semibold mt-6 mb-3">서명 검증 흐름</h3>
        <CodePanel
          title="생성 → 브로드캐스트 → 검증 → 배치"
          code={SIGN_VERIFY_CODE}
          annotations={SIGN_VERIFY_ANNOTATIONS}
        />
        <h3 className="text-xl font-semibold mt-6 mb-3">서명 알고리즘 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className={`${CELL} text-left`}>알고리즘</th>
                <th className={`${CELL} text-left`}>키 크기</th>
                <th className={`${CELL} text-left`}>서명 크기</th>
                <th className={`${CELL} text-left`}>속도</th>
                <th className={`${CELL} text-left`}>용도</th>
              </tr>
            </thead>
            <tbody>
              {SIG_COMPARE_TABLE.map((r) => (
                <tr key={r.algo}>
                  <td className={`${CELL} font-mono text-xs`}>{r.algo}</td>
                  <td className={CELL}>{r.keySize}</td>
                  <td className={CELL}>{r.sigSize}</td>
                  <td className={CELL}>{r.speed}</td>
                  <td className={CELL}>{r.use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── 서명 알고리즘 선택 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Validator Key Type 선택
        </h3>
        <div className="not-prose grid gap-4 mb-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Ed25519 (기본)
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="text-green-600 dark:text-green-400">
                  + compact key와 성숙한 구현
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + Batch verification 우수
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + Go 표준 라이브러리 성숙
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + side-channel 저항성
                </li>
                <li className="text-red-600 dark:text-red-400">
                  - 모바일/HW wallet 약함
                </li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                Secp256k1
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="text-green-600 dark:text-green-400">
                  + BTC/ETH 호환
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + HW wallet 광범위 지원
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + ECDSA 표준
                </li>
                <li className="text-red-600 dark:text-red-400">
                  - 검증 상대적 느림
                </li>
                <li className="text-red-600 dark:text-red-400">- Batch 불가</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                BLS12-381 (별도 protocol 설계)
              </p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="text-green-600 dark:text-green-400">
                  + 서명 집계 가능
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + ZK proof 호환
                </li>
                <li className="text-green-600 dark:text-green-400">
                  + 다중 서명자 scenarios
                </li>
                <li className="text-red-600 dark:text-red-400">
                  - pairing 비용과 proof-of-possession 고려
                </li>
                <li className="text-red-600 dark:text-red-400">
                  - Pairing 연산 비쌈
                </li>
              </ul>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                선택 전에 확인할 것
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>CometBFT build가 허용하는 validator key type</p>
                <p>HSM·remote signer와 key rotation 지원</p>
                <p>canonical sign bytes와 address derivation</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-foreground mb-2">
                서명 검증 benchmark
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  Vote 서명: <code>Precommit</code> → validator key / Extension
                  → 동일 key (별도 sig)
                </p>
                <p>현재 validator set 크기의 commit fixture 사용</p>
                <p>individual·batch path와 invalid signature fallback 비교</p>
                <p>CPU architecture·Go version·crypto backend를 결과에 기록</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Validator key 선택은 단순 benchmark가 아니라 ecosystem 호환성, key
          관리 도구, 검증 비용을 함께 보는 문제다. CometBFT의 일반적인
          validator 서명 경로는 Ed25519를 사용하며, 다른 signature scheme을
          도입하려면 현재 protocol과 application이 그 key type을 실제로
          지원하는지부터 확인해야 한다.
        </p>
      </div>
    </section>
  );
}
