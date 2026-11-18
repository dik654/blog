import { Arrow, Node } from "./FlowParts";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 물건·돈·정보·위험·탄소 다섯 흐름의 방향.
 * 물건: 공급자 → 항만 → 소비자. 돈: 소비자 결제액 → 플랫폼·판매자·물류·공급자.
 * 정보: 소비자 → 반대 방향으로 생산량·노동 배정. 위험: 계약·보험으로 배분, 사라지지 않음.
 * 탄소: 생산·운송 배출, 폐기물·재난 피해 → 가격 밖 주민·정부·미래 세대(남을 수 있음).
 * 칸 위치와 화살표 길이는 거리나 금액을 뜻하지 않는다.
 */
const GOODS = "#2563eb";
const MONEY = "#16a34a";
const INFO = "#7c3aed";
const RISK = "#d97706";
const CARBON = "#dc2626";

const NAMES = ["공급자", "항만·물류", "판매자", "플랫폼", "소비자"] as const;
const BOX_W = 62;
const BOX_Y = 104;
const BOX_H = 36;
const left = (index: number) => 9 + index * 70;
const cx = (index: number) => left(index) + BOX_W / 2;

const SCENES = [
  { label: "물건이 갑니다", summary: "공급자 → 항만 → 소비자", lit: [0, 1, 4], note: "부품과 완제품은 항만을 거쳐 소비자에게 갑니다. 컨테이너가 배·철도·트럭 사이를 갈아타는 구간이 항만·물류 칸입니다." },
  { label: "돈이 나뉩니다", summary: "결제액 → 네 곳", lit: [0, 1, 2, 3, 4], note: "소비자가 낸 결제액은 플랫폼·판매자·물류·공급자에게 나뉩니다. 물건과 반대 방향입니다." },
  { label: "정보가 거꾸로 갑니다", summary: "소비자 쪽 → 생산 쪽", lit: [0, 4], note: "주문·재고·평점 정보는 물건과 반대 방향으로 흘러 생산량과 노동 배정을 바꿉니다. 정보라서 점선으로 그렸습니다." },
  { label: "위험은 나눠질 뿐입니다", summary: "계약·보험으로 배분", lit: [0, 1, 2, 3, 4], note: "지연·환율·재난 위험은 계약과 보험을 통해 여러 참여자에게 배분되지만 사라지지 않습니다. 누가 얼마를 지는지는 계약마다 달라 칸마다 크기를 정하지 않았습니다." },
  { label: "탄소는 가격 밖에 남을 수 있습니다", summary: "주민·정부·미래 세대", lit: [0, 1], note: "생산과 운송의 온실가스, 폐기물과 기후 재난의 피해는 상품가격 밖의 주민·정부와 미래 세대에 남을 수 있습니다. 1절의 기후 위험 대비 10은 가격 안의 몫이고, 이 칸은 그 밖입니다." },
] as const;

export default function FiveFlowsViz() {
  return (
    <SceneShell
      eyebrow="상자 하나의 다섯 흐름"
      title="물건과 돈과 정보는 서로 다른 방향으로 움직입니다"
      description="단순하게 그린 약도입니다(가정). 칸 위치와 화살표 길이는 거리나 금액을 뜻하지 않습니다."
      ariaLabel="공급자, 항만·물류, 판매자, 플랫폼, 소비자 사이의 물건, 돈, 정보, 위험, 탄소 흐름"
      scenes={SCENES}
      render={(active) => {
        const lit: readonly number[] = SCENES[active].lit;
        return (
          <svg viewBox="0 0 360 252" className="mx-auto h-auto w-full max-w-[440px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active === 3 && (
              <>
                <rect x={4} y={96} width={352} height={52} rx={8} fill="none" stroke={RISK} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={180} y={90} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={RISK}>지연·환율·재난 위험 → 계약·보험으로 나눔</text>
              </>
            )}

            {NAMES.map((name, index) => (
              <Node key={name} x={left(index)} y={BOX_Y} w={BOX_W} h={BOX_H} title={name} on={lit.includes(index)} />
            ))}

            <Arrow points={[[cx(4) + 14, BOX_Y - 2], [cx(4) + 14, 30], [cx(0) - 14, 30], [cx(0) - 14, BOX_Y - 2]]} color={INFO} on={active === 2} dashed />
            {active === 2 && <text x={180} y={22} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={INFO}>주문·재고·평점 → 생산량·노동 배정</text>}

            <Arrow points={[[cx(0), BOX_Y - 2], [cx(0), 72], [cx(4), 72], [cx(4), BOX_Y - 2]]} color={GOODS} on={active === 0} />
            <g opacity={active === 0 ? 1 : 0.25}>
              <circle cx={cx(1)} cy={72} r={3} fill={GOODS} />
              <line x1={cx(1)} y1={72} x2={cx(1)} y2={BOX_Y} stroke={GOODS} strokeWidth={1} />
            </g>
            {active === 0 && <text x={215} y={64} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={GOODS}>부품·완제품 (항만 경유)</text>}

            <Arrow points={[[cx(4), BOX_Y + BOX_H + 2], [cx(4), 168], [cx(0), 168]]} color={MONEY} on={active === 1} head={false} />
            {[0, 1, 2, 3].map((index) => (
              <Arrow key={index} points={[[cx(index), 168], [cx(index), BOX_Y + BOX_H + 2]]} color={MONEY} on={active === 1} />
            ))}
            {active === 1 && <text x={180} y={184} textAnchor="middle" fontSize={11.5} fontWeight={700} fill={MONEY}>소비자 결제액이 네 곳으로 나뉨</text>}

            <Node x={9} y={208} w={342} h={36} title="가격 밖: 주민·정부·미래 세대" on={active === 4} color={CARBON} dashed />
            {[0, 1].map((index) => (
              <Arrow key={index} points={[[cx(index) + 8, BOX_Y + BOX_H + 2], [cx(index) + 8, 206]]} color={CARBON} on={active === 4} dashed />
            ))}
            {active === 4 && (
              <>
                <text x={cx(0) + 14} y={196} fontSize={11} fontWeight={700} fill={CARBON}>생산</text>
                <text x={cx(1) + 14} y={196} fontSize={11} fontWeight={700} fill={CARBON}>운송</text>
                <text x={250} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill={CARBON}>+ 폐기물·재난 피해</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
