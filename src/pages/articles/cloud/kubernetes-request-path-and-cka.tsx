import CloudCertificationArticle from "./CloudCertificationArticle";
import CkaInteractiveLab from "./CkaInteractiveLab";
import CkaResourceMap from "./CkaResourceMap";
import { kubernetesRequestPathAndCkaData } from "./kubernetesData";
import KubernetesSeriesLocator, { KubernetesMapReturn } from "./kubernetes-shared/KubernetesSeriesLocator";

const practiceSectionIds = new Set(["overview", "case", "picture", "mechanism", "source", "comparison", "limits"]);
const requestPracticeData = {
  ...kubernetesRequestPathAndCkaData,
  sections: kubernetesRequestPathAndCkaData.sections
    .filter((section) => practiceSectionIds.has(section.id))
    .map((section, index) => ({
      ...section,
      title: section.title.replace(/^\d+\./, `${index + 1}.`),
    })),
};

export default function KubernetesRequestPathAndCkaArticle() {
  return (
    <>
      <KubernetesSeriesLocator current="request" />
      <CloudCertificationArticle data={requestPracticeData} visualFirst />
      <div className="mt-16 space-y-16">
        <CkaResourceMap />
        <CkaInteractiveLab />
        <div id="practice-decision" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 실험 기록: 첫 실패 경계를 찾는 순서를 기본 진단법으로 둡니다</h2>
          <div className="not-prose grid gap-3 md:grid-cols-2">
            {[
              ["상태", "proposed · 예시 출력만 있으며 대상 환경의 결과는 아직 없습니다 [?]"],
              ["소유권", "각 controller가 자기 Condition·Event를 쓰고, 실험자는 원본 증거 묶음만 소유합니다 [O][A]"],
              ["최소 구성", "kubectl + journalctl + crictl + 실제 client 요청으로 시작합니다 [A]"],
              ["가설", "마지막 성공 전환 다음부터 보면 무작위 명령보다 원인 도달 시간이 짧습니다 [A]"],
              ["측정", "동일 장애 seed에서 첫 원인 발견 시간·잘못 바꾼 객체 수·복구 확인 시간을 비교합니다 [?]"],
              ["복구·되돌리기", "변경 전 YAML·로그·Event를 보존하고 한 번에 한 owner의 상태만 되돌립니다 [A]"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-border p-4">
                <strong className="text-sm text-primary">{label}</strong>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
          <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
            <p>이 결정은 실제 반복 실험에서 단계별 진단이 더 느리거나, 관측 권한 때문에 필수 증거에 접근할 수 없거나, 관리형 클러스터의 공식 진단 경로가 더 정확할 때 뒤집습니다. 제품 이름을 추가하기 전에 현재 기본 도구로 닫히지 않는 경계를 먼저 기록합니다.</p>
          </div>
          <KubernetesMapReturn current="request" />
        </div>
      </div>
    </>
  );
}
