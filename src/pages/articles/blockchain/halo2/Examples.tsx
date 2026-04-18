import ECDSAVerifyViz from './viz/ECDSAVerifyViz';

export default function Examples({ title }: { title?: string }) {
  return (
    <section id="examples" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '실전 예제: ECDSA 검증 & BN254 Pairing'}</h2>
      <div className="not-prose mb-8"><ECDSAVerifyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          halo2-ecc는 실제 암호학적 프로토콜을 회로 내에서 구현합니다.
          <strong>ECDSA 서명 검증</strong>은 secp256k1 곡선에서 10단계로 처리되며,
          <code>ecdsa_verify_no_pubkey_check</code> 함수가 핵심입니다.<br />
          회로 파라미터 k=12, advice=60일 때 약 45ms(M2 Max)로 증명 가능합니다.
        </p>
        <p>
          <strong>BN254 Pairing</strong>은 Miller Loop(double-and-add + line function) +
          Final Exponentiation(easy part + hard part)으로 구성됩니다.<br />
          Sparse Fp12 곱셈으로 약 3배 성능 향상을 달성합니다.
        </p>

        {/* ECDSA 검증 10단계 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">ECDSA 서명 검증 &mdash; 10단계 파이프라인</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">1-2. 입력 로드</p>
              <p className="text-xs text-muted-foreground mt-1">
                서명 <code>(r, s)</code>, 메시지 해시 <code>msghash</code>, 공개키 <code>pubkey</code> 를 non-native field로 적재
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">3-4. 역원 계산</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>s_inv = s.invert()</code> &mdash; Extended Euclidean으로 non-native 역원. 회로 내 가장 비싼 연산
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">5-6. 스칼라 곱</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>u1 = msghash * s_inv</code>, <code>u2 = r * s_inv</code> &mdash; scalar multiplication 2회
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">7-8. 점 곱</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>R1 = u1 * G</code>, <code>R2 = u2 * pubkey</code> &mdash; window method로 EC scalar mult
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">9. 점 합</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>R = R1 + R2</code> &mdash; EC point addition
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-xs">10. x좌표 비교</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>R.x == r</code> 검증 &mdash; <code>StrictEcPoint</code>의 reduced x로 효율적 비교
              </p>
            </div>
          </div>
        </div>

        {/* BN254 Pairing */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">BN254 Pairing &mdash; Miller Loop + Final Exp</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Miller Loop</p>
              <p className="text-xs text-muted-foreground mt-1">
                Double-and-add 알고리즘 + line function 평가.
                <code>multi_miller_loop()</code>로 여러 페어링을 하나의 루프에서 처리하여 효율화
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Final Exponentiation</p>
              <p className="text-xs text-muted-foreground mt-1">
                Easy part (Frobenius + 역원) + Hard part (BN254 specific).
                Sparse Fp12 곱셈으로 약 3x 성능 향상 &mdash; 0이 많은 계수를 건너뜀
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">실전 활용 사례</h3>

        {/* 프로젝트 카드 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-sky-300">Axiom</p>
              <p className="text-xs text-muted-foreground mt-1">On-chain ZK coprocessor &mdash; 블록체인 storage 읽기 증명, historical block header access. halo2-ecc ECDSA 검증 활용</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-emerald-300">Succinct (SP1)</p>
              <p className="text-xs text-muted-foreground mt-1">zkVM &mdash; Rust 프로그램을 ZK proof로 변환. crypto 연산 precompile 제공</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-amber-300">Scroll zkEVM</p>
              <p className="text-xs text-muted-foreground mt-1">halo2 기반 zkEVM &mdash; BN254 pairing으로 recursive SNARK aggregation</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold text-purple-300">Taiko</p>
              <p className="text-xs text-muted-foreground mt-1">Type-1 zkEVM &mdash; Full Ethereum equivalence. halo2 + SP1 hybrid</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: halo2-ecc의 제약</p>
          <p>
            <strong>성능 현실</strong>:<br />
            - ECDSA 검증: 40-100ms (증명 생성)<br />
            - Pairing: 500ms-2s<br />
            - 대량 연산은 여전히 비쌈
          </p>
          <p className="mt-2">
            <strong>최적화 대안</strong>:<br />
            - Precompiled circuits (재사용)<br />
            - Recursive aggregation (여러 proof 합침)<br />
            - Plonky2/Plonky3 (STARKs, 더 빠름)<br />
            - GPU acceleration (ICICLE, SPPARK)
          </p>
        </div>

      </div>
    </section>
  );
}
