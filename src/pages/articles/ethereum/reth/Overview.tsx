import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Reth: 실행 클라이언트를 조립 가능한 데이터 경로로 보기
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          Reth는 Rust로 작성된 Ethereum execution client이면서, node component를
          라이브러리처럼 교체할 수 있게 나눈 코드베이스다. 입문자가 먼저 잡을
          것은 crate 개수가 아니라{" "}
          <strong>
            network 입력이 검증·실행·저장·조회로 넘어가는 책임 경계
          </strong>
          다.
        </p>
        <p className="leading-7">
          긴 과거 구간은 staged pipeline과 backfill이, head 근처의 payload는
          live engine path가 처리한다. 실행 결과는 provider가 일관된
          snapshot으로 감싸고, DB·static files·RPC·ExEx가 각자 다른 수명과
          소비자를 맡는다. 아래 지도는 이 경로를 따라 심층 글을 한 번씩만
          연결한다.
        </p>
      </div>
      <SeriesReadingMap
        categorySlug="blockchain"
        path={SERIES_READING_PATHS.reth}
      />
    </section>
  );
}
