import SeriesReadingMap from "@/components/articles/series-reading-map";
import { SERIES_READING_PATHS } from "@/content/series-reading-paths";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        CometBFT: 합의와 애플리케이션을 ABCI++로 분리하기
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          CometBFT는 transaction을 실행하는 애플리케이션 자체가 아니라, block
          proposal과 vote를 교환해 하나의 순서를 합의하는 replicated state
          machine 엔진이다. 애플리케이션은 ABCI++ 요청에 따라 proposal을
          준비·검사하고 확정 block을 실행한 뒤 app hash를 반환한다.
        </p>
        <p className="leading-7">
          이 큰 경계를 먼저 잡으면 legacy MConnection·4-connection 설명과 현재
          libp2p·ABCI++ 경로를 섞지 않게 된다. 아래 지도는
          <strong>입력→후보→합의→앱 실행→commit state</strong>의 한 방향으로만
          심층 글을 연결한다.
        </p>
      </div>
      <SeriesReadingMap
        categorySlug="blockchain"
        path={SERIES_READING_PATHS.cometbft}
      />
    </section>
  );
}
