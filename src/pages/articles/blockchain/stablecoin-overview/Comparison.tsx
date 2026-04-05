export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">유형별 트레이드오프 비교</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">트레이드오프 매트릭스</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">속성</th>
                <th className="border border-border px-3 py-2 text-left">Fiat (USDC)</th>
                <th className="border border-border px-3 py-2 text-left">Crypto (DAI)</th>
                <th className="border border-border px-3 py-2 text-left">Algo (UST)</th>
                <th className="border border-border px-3 py-2 text-left">Synthetic (USDe)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">페그 안정성</td>
                <td className="border border-border px-3 py-2 text-green-600">매우 높음</td>
                <td className="border border-border px-3 py-2 text-green-600">높음</td>
                <td className="border border-border px-3 py-2 text-red-600">실패</td>
                <td className="border border-border px-3 py-2 text-amber-600">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">탈중앙화</td>
                <td className="border border-border px-3 py-2 text-red-600">낮음</td>
                <td className="border border-border px-3 py-2 text-amber-600">중간</td>
                <td className="border border-border px-3 py-2 text-green-600">높음</td>
                <td className="border border-border px-3 py-2 text-amber-600">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">자본 효율</td>
                <td className="border border-border px-3 py-2 text-green-600">100%</td>
                <td className="border border-border px-3 py-2 text-red-600">65%</td>
                <td className="border border-border px-3 py-2 text-green-600">100%</td>
                <td className="border border-border px-3 py-2 text-green-600">95%+</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">검열 저항</td>
                <td className="border border-border px-3 py-2 text-red-600">낮음</td>
                <td className="border border-border px-3 py-2 text-amber-600">중간</td>
                <td className="border border-border px-3 py-2 text-green-600">높음</td>
                <td className="border border-border px-3 py-2 text-amber-600">중간</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">규제 준수</td>
                <td className="border border-border px-3 py-2 text-green-600">완전</td>
                <td className="border border-border px-3 py-2 text-amber-600">부분</td>
                <td className="border border-border px-3 py-2 text-red-600">회색</td>
                <td className="border border-border px-3 py-2 text-red-600">회색</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">확장성</td>
                <td className="border border-border px-3 py-2 text-green-600">무제한</td>
                <td className="border border-border px-3 py-2 text-amber-600">담보 한도</td>
                <td className="border border-border px-3 py-2 text-green-600">무제한</td>
                <td className="border border-border px-3 py-2 text-amber-600">파생 유동성</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">수익률</td>
                <td className="border border-border px-3 py-2">~5% (CCTP)</td>
                <td className="border border-border px-3 py-2">~8% (DSR)</td>
                <td className="border border-border px-3 py-2">~20% (실패)</td>
                <td className="border border-border px-3 py-2">8-30%</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">사용 사례별 권장</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`일상 결제, CEX 거래, 크로스보더 송금:
  → USDC, USDT (유동성·수용성 최고)

DeFi lending/borrowing:
  → USDC (가장 널리 지원)
  → DAI (탈중앙 원하면)

기관 투자:
  → USDC (규제 준수·투명성)

크립토 국가주의·검열 저항:
  → DAI, LUSD (탈중앙 담보)

수익률 추구 (리스크 감수):
  → USDe, sDAI, PYUSD (yield-bearing)

신흥국 USD 저축:
  → USDT (가장 널리 쓰임)

범용 "안전한 선택":
  → USDC (중앙화 감수하되 안정적)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">미래 전망 — 5가지 트렌드</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`1. Yield-bearing stablecoins 대중화
   - sDAI, USDe, sFRAX, stUSDT
   - "돈 그냥 가만히 두면 이자"가 표준 됨

2. 국가 발행 스테이블코인 (CBDC 또는 승인 stablecoin)
   - USD: PYUSD (PayPal), 규제 승인
   - 홍콩, 일본 CBDC 파일럿

3. Real World Assets 담보 확대
   - MakerDAO 국채 담보
   - Ondo USDY (tokenized T-bills)

4. Multi-chain native deployment
   - CCTP 확산
   - Native stablecoin on new chains

5. 스테이블코인 중심 DeFi 체인
   - Ethena Network
   - Plasma, Stable Sonic 등
   - USDC 만이 통화인 체인`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">DeFi에서 스테이블코인의 역할</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// DeFi의 "기축 통화"
1. DEX 기준 거래쌍 (ETH/USDC, BTC/USDC)
2. Lending 기축 자산 (Aave, Compound V3)
3. Derivatives 결제 (Perp funding, Options)
4. Yield farming 기본 단위
5. Cross-chain 브리지 표준

// TVL(Total Value Locked) 중 스테이블코인 비중: 40%+

// "스테이블코인 없는 DeFi"는 불가능
- 변동성 자산끼리만 거래하면 가격 발견 어려움
- LP들의 기준선 없음
- 파생상품 결제 복잡
- 일상 거래 불가능`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 스테이블코인의 진짜 의미</p>
          <p>
            스테이블코인은 <strong>"크립토와 전통 금융의 다리"</strong>
          </p>
          <p className="mt-2">
            역할:<br />
            ✓ DeFi 생태계의 liquidity 주춧돌<br />
            ✓ 개발도상국의 달러 접근 수단 (USDT in 터키, 아르헨티나)<br />
            ✓ 무허가 금융 서비스의 가치 저장<br />
            ✓ 실시간 글로벌 결제 (은행 영업시간 무관)
          </p>
          <p className="mt-2">
            도전:<br />
            ✗ 규제 압박 지속 (MiCA, 미국 법안)<br />
            ✗ CBDC와 경쟁<br />
            ✗ 은행·금융 당국과의 긴장<br />
            ✗ "진정한 탈중앙 스테이블" 미완성
          </p>
          <p className="mt-2">
            <strong>결론</strong>: 스테이블코인은 크립토가 실제 유용함을 증명한 대표 사례<br />
            Fiat-backed가 현재 지배적이지만, 탈중앙 대안도 계속 진화<br />
            다양한 유형이 <strong>공존</strong>하며 각자 niche 차지할 것
          </p>
        </div>

      </div>
    </section>
  );
}
