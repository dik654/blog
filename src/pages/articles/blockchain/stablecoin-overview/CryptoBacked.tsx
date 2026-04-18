import CdpViz from './viz/CdpViz';

export default function CryptoBacked() {
  return (
    <section id="crypto-backed" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호자산 담보 (DAI)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CdpViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">DAI — 최초의 탈중앙 스테이블코인</h3>
        <p>
          DAI (2017년 출시, MakerDAO): <strong>암호자산 담보로 발행되는 USD-pegged 토큰</strong><br />
          특징: 은행 없음, 중앙 권한 없음 (DAO 거버넌스만), ETH 등 크립토로 담보<br />
          2024년: Sky Protocol로 리브랜딩 (DAI → USDS)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CDP — Collateralized Debt Position</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">CDP = 과담보 대출 포지션</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">1</span>
              <span>User: 10 ETH 예치 ($30,000 at $3,000/ETH)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">2</span>
              <span>System: CDP 생성, DAI 발행 (예: 15,000 DAI)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">3</span>
              <span>User: 15,000 DAI 수령 (USD처럼 사용)</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">Collateralization Ratio</p>
              <p>담보 가치 / 부채 가치</p>
              <p className="font-mono mt-1">$30,000 / $15,000 = <strong>200%</strong></p>
              <p className="text-xs text-muted-foreground">ETH CDP 최소 비율: 150%</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">ETH 가격 하락 시</p>
              <p>가격 $2,250 → 담보 $22,500</p>
              <p className="font-mono mt-1">$22,500 / $15,000 = <strong>150%</strong></p>
              <p className="text-xs text-red-500">임계치 도달 — 더 하락 시 청산 대상</p>
            </div>
          </div>
        </div>
        <p>
          <strong>과담보 150%+</strong>: 담보 가치 급락 버퍼<br />
          Fiat-backed의 1:1과 다름 — 자본 효율 낮음<br />
          but 탈중앙화 보장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Multi-Collateral DAI (MCD)</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-2">Multi-Collateral DAI 지원 담보</p>
          <p className="text-xs text-muted-foreground mb-3">초기 SAI: ETH only → 2019년 MCD: 여러 담보 지원</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {['ETH (stETH 포함)', 'WBTC', 'USDC/USDT (PSM)', 'RWA (국채 등)'].map(c => (
              <span key={c} className="bg-background border border-border rounded px-2 py-1 text-xs">{c}</span>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1"><code className="text-xs">IlkData</code> — 담보별 파라미터</p>
              <p><code className="text-xs">Art</code> — 총 발행 DAI</p>
              <p><code className="text-xs">rate</code> — 안정성 수수료 누적값</p>
              <p><code className="text-xs">spot</code> — 청산 가격</p>
              <p><code className="text-xs">line</code> — 담보 최대 부채 한도</p>
              <p><code className="text-xs">dust</code> — 최소 부채</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1"><code className="text-xs">Urn</code> — Vault 구조</p>
              <p><code className="text-xs">ink</code> — 예치 담보 양</p>
              <p><code className="text-xs">art</code> — 부채 (<code className="text-xs">rate</code> 곱하면 DAI 환산)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>담보별 독립 파라미터</strong>: ETH-A, WBTC-A, USDC-A 등<br />
          각 담보 유형은 <strong>Ilk</strong>(잉크)라 부름 — 독립 리스크 관리<br />
          RWA(Real World Assets) 담보 추가 — 국채, 기업 대출 등
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Stability Fee — 차입 이자</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Stability Fee — 차입 이자</p>
          <div className="bg-background rounded px-3 py-2 mb-3 text-sm">
            <p className="text-xs text-muted-foreground mb-1">연 2-15% (담보 유형별), 누적 계산</p>
            <p className="font-mono">rate[t] = rate[t-1] x (1 + SF)^(dt/year)</p>
          </div>
          <p className="font-semibold text-xs text-muted-foreground mb-2">예시: 15,000 DAI 차입, SF 5%/year</p>
          <div className="grid grid-cols-2 gap-2 text-sm mb-3">
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">1년 후</p>
              <p className="font-mono">15,000 x 1.05 = <strong>15,750 DAI</strong></p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">2년 후</p>
              <p className="font-mono">15,000 x 1.05² = <strong>16,537.5 DAI</strong></p>
            </div>
          </div>
          <div className="bg-background rounded px-3 py-2 text-sm">
            <p className="font-semibold text-xs text-muted-foreground mb-1">상환 시</p>
            <p>User repays 15,750 DAI → CDP closed — 750 DAI는 시스템에 귀속 (protocol surplus)</p>
          </div>
        </div>
        <p>
          <strong>변동 금리</strong>: MakerDAO 거버넌스가 조정<br />
          이자는 <strong>DAI로 지불</strong> — 순환 구조<br />
          누적된 수수료 → protocol surplus → MKR 소각 (버퍼)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">청산 경매</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">청산 트리거</p>
          <div className="bg-red-50 dark:bg-red-900/20 rounded px-3 py-2 mb-4 text-sm">
            <p>ETH 가격 $1,800 → 담보 10 x $1,800 = $18,000 / 부채 15,750 DAI</p>
            <p className="font-mono mt-1">비율: 18,000 / 15,750 = <strong className="text-red-600">114% &lt; 150%</strong> → 청산!</p>
          </div>
          <p className="font-semibold text-sm mb-2">Liquidations 2.0 (Dutch Auction)</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">1</span>
              <span>Auction 시작 가격: 현재 가격 x 1.1 (10% 할증)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">2</span>
              <span>시간 경과에 따라 가격 선형 감소 (step down)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">3</span>
              <span>첫 구매자가 담보 획득</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">4</span>
              <span>구매자 DAI → system burn</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">5</span>
              <span>나머지 담보 → user에게 환급</span>
            </div>
          </div>
          <p className="font-semibold text-xs text-muted-foreground mb-2">경매 예시</p>
          <div className="grid grid-cols-3 gap-2 text-sm mb-2">
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">초기</p>
              <p className="font-mono">$1,980/ETH</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">5분 후</p>
              <p className="font-mono">$1,850</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">10분 후</p>
              <p className="font-mono">$1,720 → 매수</p>
            </div>
          </div>
          <div className="bg-background rounded px-3 py-2 text-sm">
            <p>구매자: 15,750 DAI 지불 → 9.16 ETH 획득</p>
            <p>User: 10 - 9.16 = <strong>0.84 ETH</strong> 남은 담보 환급</p>
          </div>
        </div>
        <p>
          <strong>Dutch Auction</strong>: 가격 하락하며 첫 매수자 승리<br />
          기존 영어 경매(올라가는)보다 속도 빠름·투명<br />
          Penalty: user는 13% 벌금 + 나머지 담보만 반환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Peg Stability Module (PSM)</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-2">PSM — USDC ↔ DAI 1:1 즉시 교환</p>
          <p className="text-xs text-muted-foreground mb-3">디페그 방어 메커니즘</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1"><code className="text-xs">sellGem(dst, amt)</code></p>
              <p>USDC → DAI 전환</p>
              <p className="text-xs text-muted-foreground mt-1">USDC <code className="text-xs">transferFrom</code> → DAI <code className="text-xs">mint</code> (decimals 조정)</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1"><code className="text-xs">buyGem(dst, amt)</code></p>
              <p>DAI → USDC 전환</p>
              <p className="text-xs text-muted-foreground mt-1">DAI <code className="text-xs">burn</code> → USDC <code className="text-xs">transfer</code></p>
            </div>
          </div>
          <div className="bg-background rounded px-3 py-2 text-sm">
            <p className="font-semibold text-xs text-muted-foreground mb-1">차익거래 효과</p>
            <p>DAI &gt; $1 → USDC → DAI (차익거래) → 가격 하락</p>
            <p>DAI &lt; $1 → DAI → USDC (차익거래) → 가격 상승</p>
            <p className="text-xs text-muted-foreground mt-1">자연스럽게 $1로 수렴</p>
          </div>
        </div>
        <p>
          <strong>PSM은 MakerDAO의 "배신"</strong>: USDC에 의존해서 페그 유지<br />
          현재 DAI 담보의 50%+ 가 USDC → <strong>간접 중앙화</strong><br />
          완전 탈중앙화 DAI는 이상이고, 실용적 타협이 현실
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DAI Savings Rate (DSR)</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-2">DAI Savings Rate (DSR)</p>
          <p className="text-xs text-muted-foreground mb-3">Stability Fee - 운영비 = DSR로 분배, 현재 5-8% APY</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-3">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">메커니즘</p>
              <p>User: 1,000 DAI → DSR contract 예치</p>
              <p>1년 후: ~1,080 DAI 수령</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">수익 원천</p>
              <p>Stability Fee 수익 + RWA 국채 수익</p>
              <p className="text-xs text-muted-foreground mt-1">→ protocol surplus → DSR 분배</p>
            </div>
          </div>
          <div className="bg-background rounded px-3 py-2 text-sm">
            <p><code className="text-xs">sDAI</code> — DSR 예치 영수증 (ERC4626 vault)</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DAI의 진화와 타협</p>
          <p>
            DAI는 <strong>"탈중앙 이상" vs "실용성" 사이 끊임없는 줄타기</strong>
          </p>
          <p className="mt-2">
            타임라인:<br />
            2017: SAI (ETH only) — 순수 탈중앙<br />
            2019: MCD (다중 담보) — 확장성<br />
            2020: USDC를 담보로 추가 — "임시 조치"<br />
            2023: RWA 도입 (국채) — 수익률 확보<br />
            2024: Sky 리브랜딩 (DAI → USDS) — 새 출발
          </p>
          <p className="mt-2">
            <strong>교훈</strong>:<br />
            - 순수 탈중앙 스테이블코인은 아직 증명 안 됨<br />
            - 사용자는 <strong>안정성을 위해 중앙화 수용</strong><br />
            - "탈중앙" 강조보다 <strong>리스크 투명성</strong>이 더 중요
          </p>
        </div>

      </div>
    </section>
  );
}
