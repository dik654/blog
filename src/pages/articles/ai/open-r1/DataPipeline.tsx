import DataLineageViz from "./viz/DataLineageViz";

export default function DataPipeline() {
  return (
    <section id="data-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Reasoning data는 생성된 답보다 다시 검증할 수 있는 lineage가 중요하다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Teacher가 긴 solution을 만들었다고 곧바로 좋은 SFT data가 되지는 않습니다. Final answer가 맞아도 중간 설명은 모순될 수 있습니다. Parser가
          받기 쉬운 표현만 남기면 data distribution도 좁아집니다.
        </p>
        <p className="leading-8">
          Raw generation은 덮어쓰지 않습니다. Parser output, verifier result와 filtering reason을 별도 열로 보존해 두면 verifier가
          개선된 뒤에도 전체 trace를 다시 생성하지 않고 재처리합니다.
        </p>
      </div>

      <DataLineageViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Dataset 숫자는 generation 수와 unique problem 수를 구분한다</h3>
        <p className="leading-8">
          OpenR1-Math-220k update는 약 40만 problem에 두 답씩, 총 80만 trace를 생성한 뒤 correctness filtering을 거쳐 약 22만
          problem의 trace를 남겼습니다. 그 과정을 공개했습니다.
        </p>
        <p className="leading-8">
          이를 “220k trace를 생성했다”라고 줄이면 sampling budget과 selection rate를 잃습니다. Problem ID, candidate index,
          teacher checkpoint와 sampling setting을 함께 보존해야 여러 candidate와 최종 행 수가 구분됩니다.
        </p>

        <h3>Stricter filtering은 항상 더 좋은 학습 data를 뜻하지 않는다</h3>
        <p className="leading-8">
          정답 verifier와 길이·format filter를 강화하면 noise가 줄어듭니다. 대신 어렵거나 표현이 다양한 problem까지 같이 사라질 수 있습니다.
        </p>
        <p className="leading-8">
          작은 token budget에서는 깨끗한 subset이 더 빨리 학습되기도 합니다. 긴 training으로 가면 넓은 coverage가 다시 중요해집니다. 그래서 동일한
          update token budget에서 filter와 coverage를 ablation합니다.
        </p>

        <h3>Contamination은 prompt provenance와 n-gram을 함께 본다</h3>
        <p className="leading-8">
          현재 Open-R1 저장소는 benchmark prompt와의 8-gram overlap을 이용한 decontamination script를 제공합니다. 재현 가능한 기준선이지만
          semantic paraphrase나 teacher가 기억한 풀이까지 제거하지는 못합니다.
        </p>
        <p className="leading-8">
          Exact 또는 n-gram으로 제거한 수를 source, contest, year split과 함께 보고합니다. Semantic audit 결과와 benchmark release
          이후의 problem을 별도 holdout으로 두면 검증이 한층 단단해집니다.
        </p>

        <h3>Data release도 executable artifact처럼 versioning한다</h3>
        <p className="leading-8">
          Dataset revision은 source license, raw generation pointer, parser와 verifier commit, filter config,
          removed-count breakdown과 split manifest를 함께 담습니다. 그래야 성능 차이가 model update에서 왔는지 data revision에서 왔는지
          갈라집니다. 다른 팀도 같은 기준으로 SFT와 RL prompt pool을 다시 만들 수 있습니다.
        </p>
      </div>

      <div
        id="standard-open-r1-data"
        className="not-prose my-8 scroll-mt-24 border-l border-border pl-4"
      >
        <p className="text-xs font-bold text-foreground">
          공식 프로젝트 기록 · OpenR1-Math data generation
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Open-R1 update는 source problem에서 여러 teacher completion을 만들고 correctness filter를 거쳐 학습 subset을
          공개했습니다. 그 과정을 기록한 문서는 최종 행 수뿐 아니라 generation budget, filter와 training 결과를 함께 비교합니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          특정 update에서 깨끗한 subset이 유리했다는 관찰을 모든 token budget과 domain의 일반 법칙으로 넓히면 안 됩니다. 동일 budget의 coverage
          ablation으로 다시 확인하는 편이 낫습니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://huggingface.co/blog/open-r1/update-2"
          target="_blank"
          rel="noreferrer"
        >
          생성 수·filter·distillation 결과의 공식 기록 보기
        </a>
      </div>
    </section>
  );
}
