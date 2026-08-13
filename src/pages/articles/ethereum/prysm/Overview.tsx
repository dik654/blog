import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Prysm: consensus object가 state와 validator duty가 되는 경로
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          Prysm은 Ethereum consensus layer를 구현한 beacon node와 validator
          client다. beacon node는 block·attestation을 검증해 beacon state와 fork
          choice를 갱신하고, validator client는 배정된 제안·증명 임무에
          서명한다. execution payload의 EVM 실행은 Engine API 너머의 execution
          client가 담당한다.
        </p>
        <p className="leading-7">
          따라서 패키지 이름부터 외우기보다{" "}
          <strong>
            wire object→검증→state transition→head/finality→duty·API
          </strong>{" "}
          순서로 읽는 편이 안전하다. client 점유율처럼 자주 바뀌는 수치는 이
          아키텍처 지도에서 제외하고, consensus spec과 현재 Prysm 코드의 책임만
          연결한다.
        </p>
      </div>
      <SeriesReadingMap
        categorySlug="blockchain"
        path={SERIES_READING_PATHS.prysm}
      />
    </section>
  );
}
