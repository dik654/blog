import IMAFlowViz from './viz/IMAFlowViz';

export default function IMAIntegrity() {
  return (
    <section id="ima-integrity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IMA 무결성 측정</h2>
      <p className="leading-7 mb-4">
        IMA — Linux 커널 내장 파일 무결성 측정 시스템<br />
        Keylime은 IMA와 통합하여 원격 시스템의 런타임 파일 무결성 지속 검증<br />
        파일 실행이나 메모리 매핑 시마다 해시가 계산되어
        TPM PCR(Platform Configuration Register) 10에 기록됩니다.
      </p>

      <IMAFlowViz />

      <div className="mt-6 space-y-4">
        <h3 className="text-lg font-semibold">IMA 템플릿 형식</h3>
        <div className="not-prose overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3 font-medium text-foreground/60">형식</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">내용</th>
                <th className="text-left py-2 px-3 font-medium text-foreground/60">용도</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['ima', 'SHA1 해시 + 파일 경로', '레거시 호환'],
                ['ima-ng', '알고리즘:해시 + 파일 경로', '표준 형식'],
                ['ima-sig', '해시 + 디지털 서명', '서명 검증'],
                ['ima-buf', '버퍼 데이터 측정', '커널 버퍼'],
              ].map(([fmt, content, usage]) => (
                <tr key={fmt} className="border-b border-border/50">
                  <td className="py-2 px-3 font-mono text-foreground/70">{fmt}</td>
                  <td className="py-2 px-3 text-foreground/80">{content}</td>
                  <td className="py-2 px-3 text-foreground/80">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-lg font-semibold mt-4">IMA 키링 관리</h3>
        <p className="leading-7">
          ImaKeyrings — 여러 키링 관리<br />
          각 키링은 keyidv2(SHA1 하위 4바이트)로 공개키 인덱싱<br />
          ima-sig 검증 시 서명 헤더에서 keyidv2 추출 → 공개키 매칭<br />
          RSA 또는 ECC로 디지털 서명 검증
        </p>
      </div>
    </section>
  );
}
