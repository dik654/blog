import RateBars from "./RateBars";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source 둘째 문단 — UN 『세계인구전망 2024』 한국 추정치(확인일 2026-10-09).
 * 1960 42.1−13.0=+29.1, 1990 15.5−5.7=+9.8, 2023 4.6−6.7=−2.1.
 */
const GROUPS = [
  { label: "1960년", birth: 42.1, death: 13.0 },
  { label: "1990년", birth: 15.5, death: 5.7 },
  { label: "2023년", birth: 4.6, death: 6.7 },
] as const;

const SCENES = [
  { label: "1960년", summary: "42.1 − 13.0 = +29.1명", note: "출생 막대가 사망 막대보다 훨씬 높아 틈이 29.1명입니다. 글의 둘째 단계 40−15=25와 비슷한 모양입니다." },
  { label: "1990년", summary: "15.5 − 5.7 = +9.8명", note: "두 막대가 모두 내려가 틈이 9.8명으로 좁아졌습니다. 글의 셋째 단계 18−8=10과 비슷한 모양입니다." },
  { label: "2023년", summary: "4.6 − 6.7 = −2.1명", note: "출생 막대가 사망 막대보다 낮아졌습니다. 사망이 출생보다 1,000명당 2.1명 많아 자연증가가 음수이고, 글의 세 단계 밖에 있습니다. 이주를 더한 총인구 변화는 이 막대로 알 수 없습니다." },
] as const;

export default function KoreaRatesViz() {
  return (
    <SceneShell
      eyebrow="실제 추정치와 대조"
      title="한국의 출생·사망 막대는 틈이 좁아지다가 뒤집힙니다"
      description="UN 『세계인구전망 2024』의 한국 추정치로, 인구 1,000명당 한 해의 출생과 사망입니다(확인일 2026-10-09). 자연증가는 출생에서 사망을 뺀 값이라 이주는 들어 있지 않습니다."
      ariaLabel="한국의 1960년, 1990년, 2023년 1,000명당 출생과 사망, 자연증가가 29.1에서 9.8, 마이너스 2.1로 바뀌는 모습"
      scenes={SCENES}
      render={(active) => <RateBars groups={GROUPS} shown={active} decimals={1} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />}
    />
  );
}
