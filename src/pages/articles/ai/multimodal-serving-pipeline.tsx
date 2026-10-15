import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ImageTokenViz from "./multimodal-serving-pipeline/viz/ImageTokenViz";
import KvFootprintViz from "./multimodal-serving-pipeline/viz/KvFootprintViz";
import EncoderScheduleViz from "./multimodal-serving-pipeline/viz/EncoderScheduleViz";
import PrefixKeyViz from "./multimodal-serving-pipeline/viz/PrefixKeyViz";
import EncoderCacheSlotViz from "./multimodal-serving-pipeline/viz/EncoderCacheSlotViz";
import { codeRefs } from "./multimodal-serving-pipeline/codeRefs";
import { multimodalTrees } from "./multimodal-serving-pipeline/fileTree";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

/**
 * 멀티모달 서빙: 사진 한 장이 서버 안에서 쓰는 계산과 메모리
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function MultimodalServingPipelineArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => (
    <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />
  );

  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 같은 사진에 질문 네 개가 붙으면 서버는 무엇을 몇 번 계산할까요?</h2>
          <div className={prose}>
            <p>
              상품 사진 한 장을 두고 네 사람이 서로 다른 질문을 보냈다고 해 봅시다. 글자만 있는 질문이라면 서버는 질문을 token으로 나누고 모델을 돌리면 됩니다. 사진이
              붙으면 그 앞에 일이 둘 더 생깁니다. 사진을 모델이 읽을 숫자 묶음으로 바꾸는 일과, 그 묶음을 문장 안 어디에 넣을지 정하는 일입니다.
            </p>
            <p>
              이 글의 답을 먼저 적겠습니다. 사진 한 장은 서버 안에서 vision encoder를 한 번 거쳐 embedding 수백에서 수천 개가 되고, 그 embedding은 text token과 똑같이
              문장의 자리를 차지해 KV를 씁니다. 같은 사진이 다시 오면 encoder 결과와 앞부분 KV를 다시 쓰려고 사진 내용의 hash를 cache 열쇠에 넣습니다. 그래서
              scheduler는 text token 예산과 별도로 encoder 계산 예산과 encoder cache 자리를 함께 셉니다.
            </p>
            <p>
              네 질문이라는 같은 사례를 끝까지 씁니다. 사진 하나가 몇 자리가 되는지 세고, 그 자리가 KV를 얼마나 쓰는지 계산한 뒤, 네 요청이 encoder와 KV를 얼마나 나눠
              쓸 수 있는지 vLLM v0.27.1 원문으로 따라갑니다. 모델 구조 자체는{" "}
              <Link to="/cs/ai/vision-language-model-architecture#projector">VLM 구조 글의 projector 절</Link>에 맡기고, 여기서는 서버가 이 구조를 실행할 때 생기는 계산과
              메모리만 다룹니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 서버 입구에서 사진은 문장 안의 빈자리가 됩니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 입력은 질문 글자와 사진 파일이고 출력은 답 글자입니다. 서버 안을 세 상자로 나눠 보겠습니다. 첫 상자는 CPU에서 사진 크기를 맞추고 작은 조각으로
              자릅니다. 둘째 상자는 GPU에서 그 조각을 vision encoder에 넣어 embedding을 만듭니다. 셋째 상자는 그 embedding이 끼어 있는 문장을 언어 모델로 처리합니다.
            </p>
            <p>
              둘째와 셋째 상자를 잇는 약속이 중요합니다. 첫 상자는 문장 안에 사진 몫의 빈자리를 미리 만들어 둡니다. 빈자리마다 같은 특수 token을 채워 넣고 셋째 상자가 실행될
              때 그 자리의 입력을 사진 embedding으로 바꿔 끼웁니다. 언어 모델 입장에서는 길이가 늘어난 한 문장일 뿐입니다.
            </p>
            <p>
              Qwen2.5-VL 기술 보고서는 이 과정을 두 문장으로 요약합니다. 사진을 28의 배수로 맞춘 뒤 14 간격 patch로 나누고 이웃한 patch 네 개를 묶어 MLP로
              text embedding 차원에 맞춥니다. 다음 절에서 이 규칙에 1,024×1,024 사진을 넣어 빈자리가 몇 개 생기는지 셉니다.
            </p>
          </div>
          <div id="paper-qwen25vl" className="mt-8 scroll-mt-20">
            <CitationBlock source="Qwen Team · Qwen2.5-VL Technical Report (2025), §2.1" citeKey={1} href="https://arxiv.org/abs/2502.13923">
              <q>we first group spatially adjacent sets of four patch features.</q> 같은 절은 입력 크기를 28의 배수로 맞추고 stride 14로 patch를 나눈다고 적습니다. 이 글의
              token 수는 이 규칙과 공개 설정 파일로 다시 계산한 값입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="image-tokens" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 1,024×1,024 사진 한 장은 1,369개의 자리가 됩니다</h2>
          <div className={prose}>
            <p>
              가로와 세로가 1,024 픽셀인 사진을 Qwen2.5-VL-7B-Instruct에 보낸다고 하겠습니다. 먼저 한 변을 28의 배수로 맞춥니다. 1,024÷28=36.57을 반올림하면 37이고,
              37×28=1,036 픽셀이 됩니다. 이 모델의 설정은 전체 픽셀을 3,136 이상 12,845,056 이하로 두라고 정하는데 1,036²=1,073,296이라 범위 안에 있습니다.
            </p>
            <p>
              1,036 픽셀을 14 픽셀 patch로 자르면 한 변에 74칸이 나오고 사진 전체는 74×74=5,476 patch입니다. 이웃한 2×2 patch를 하나로 합치므로 자리
              수는 5,476÷4=1,369입니다. 한 변으로 보면 74÷2=37칸이라 37×37=1,369와 같은 수가 나옵니다.
            </p>
            <p>
              사진을 더 크게 보내면 자리도 늘어납니다. 2,048×2,048이면 한 변이 2,044 픽셀로 맞춰지고 73×73=5,329 자리가 됩니다. 픽셀 상한을 넘는 큰 사진은 비율을
              유지한 채 줄어들기 때문에 자리 수에도 위쪽 한계가 있습니다. 이 글은 1,024 사진의 1,369를 계속 씁니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="사진에서 자리 수까지"
            question="1,024×1,024 사진은 문장 안에서 몇 자리를 차지하나요?"
            scope="Qwen2.5-VL-7B-Instruct의 공개 전처리 설정으로 사진 한 장의 placeholder 수만 셉니다. 영상의 시간 축 묶음은 넣지 않았습니다."
            steps={[
              { label: "한 변 맞춤", expression: "round(1,024 ÷ 28) × 28", result: "37 × 28 = 1,036 px", reason: "patch 14와 묶음 2를 곱한 28의 배수여야 2×2 묶음이 딱 떨어집니다." },
              { label: "픽셀 범위 확인", expression: "1,036 × 1,036", result: "1,073,296 ≤ 12,845,056", reason: "상한을 넘지 않으므로 다시 줄이지 않습니다." },
              { label: "patch 격자", expression: "(1,036 ÷ 14)²", result: "74² = 5,476 patch", reason: "vision encoder가 실제로 읽는 조각 수입니다." },
              { label: "2×2 묶음", expression: "5,476 ÷ 2²", result: "1,369 자리", reason: "이웃한 patch 네 개가 embedding 하나가 되므로 4로 나눕니다." },
            ]}
            conclusion="사진 한 장이 문장에 1,369개의 같은 image token을 남기고, 실행 때 그 자리마다 embedding 하나가 들어갑니다."
            caveats={["1,024 사진에 대한 계산입니다. 크기가 다르면 smart_resize 규칙에 따라 자리 수가 달라집니다.", "사진 시작과 끝을 표시하는 token 두 개는 따로 붙습니다."]}
          />
          <ImageTokenViz />
          <div className="mt-6 flex flex-wrap gap-2">
            {code("smart-resize", "28의 배수로 맞추는 원문")}
            {code("patch-count", "patch 수를 세는 원문")}
          </div>
        </section>

        <section id="kv-footprint" data-teach-level="1" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 그 자리마다 text token 하나와 같은 KV를 씁니다</h2>
          <div className={prose}>
            <p>
              빈자리 1,369개가 embedding으로 채워지면 언어 모델은 그 자리를 다른 token과 똑같이 처리합니다. 각 층은 자리마다 K와 V를 만들고, 뒤의 token이 그 기록을
              읽도록 KV cache에 남깁니다. 사진이라고 KV를 덜 쓰지 않습니다. 한 자리의 KV 크기는{" "}
              <Link to="/cs/ai/kv-cache-fundamentals">KV cache 기초 글</Link>의 계산을 그대로 따릅니다.
            </p>
          </div>
          <ExplainedFormula
            question="Qwen2.5-VL-7B에서 자리 하나는 KV를 몇 byte 쓰나요?"
            idea={<p>K와 V 두 벌을 층마다, KV head마다, head 차원 길이만큼 저장하고 원소 하나가 2 byte입니다.</p>}
            formula={String.raw`b_{\text{tok}} = 2 \times L \times H_{kv} \times d \times s`}
            annotatedFormula={String.raw`b_{\text{tok}} = \underbrace{2}_{\text{K와 V}} \times \underbrace{L}_{\text{층 수 }28} \times \underbrace{H_{kv}}_{\text{KV head }4} \times \underbrace{d}_{\text{head 차원 }128} \times \underbrace{s}_{\text{BF16 }2\text{ byte}}`}
            operations={[
              { expression: String.raw`2 \times L`, annotation: ["K와 V를", "28층에 하나씩 둡니다"] },
              { expression: String.raw`H_{kv} \times d`, annotation: ["GQA라 query head 28개가 아니라", "KV head 4개만 저장합니다"] },
              { expression: String.raw`\times s`, annotation: "원소 수에 BF16 2 byte를 곱합니다" },
            ]}
            terms={[
              { symbol: "L", name: "층 수", description: "config.json의 num_hidden_layers=28입니다." },
              { symbol: String.raw`H_{kv}`, name: "KV head 수", description: "num_key_value_heads=4입니다." },
              { symbol: "d", name: "head 차원", description: "hidden_size 3,584를 attention head 28로 나눈 128입니다." },
              { symbol: "s", name: "원소 byte", description: "BF16이라 2 byte입니다. KV를 8 bit로 저장하면 절반이 됩니다." },
            ]}
            assumptions={["KV는 BF16으로 저장한다고 둡니다.", "block 안 빈칸과 tensor 병렬 분할은 아직 넣지 않았습니다."]}
            interpretation="2×28×4×128×2=57,344 byte, 곧 56KiB입니다. 사진 1,369자리는 1,369×56KiB=76,664KiB, 약 74.9MiB이고 30 token 문장의 1.64MiB보다 45.6배 큽니다."
          />
          <div className={prose}>
            <p>
              실제 서버는 KV를 16 token block 단위로 나눠 줍니다. block 하나는 16×56KiB=896KiB입니다. 텍스트 15 token, 사진 시작 표시 1, 사진 1,369, 사진 끝 표시 1,
              질문 20을 합친 요청 하나는 1,406 token이고 88 block, 77MiB를 씁니다. 네 요청이 각자 들고 있으면 352 block, 308MiB입니다.
            </p>
            <p>
              네 요청은 질문이 갈리기 전 1,386 token까지 같습니다. 그중 꽉 찬 block 86개, 곧 1,376 token을 함께 쓰고 요청마다 꼬리 2 block만 가지면 86+4×2=94 block,
              82.25MiB입니다. 이 공유가 가능하려면 서버가 두 요청의 사진이 같은 사진이라는 것을 알아야 합니다. 그 조건은 10절에서 원문으로 확인합니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="네 요청의 KV block"
            question="같은 사진을 묻는 요청 네 개는 KV를 얼마나 쓰나요?"
            scope="Qwen2.5-VL-7B, BF16 KV, 16 token block에서 요청 네 개의 prompt KV만 셉니다. 답을 생성하며 늘어나는 KV는 넣지 않았습니다."
            steps={[
              { label: "block 하나", expression: "16 token × 56KiB", result: "896KiB", reason: "앞 식의 자리당 KV에 block 크기를 곱합니다." },
              { label: "요청 하나", expression: "⌈1,406 ÷ 16⌉ block", result: "88 block = 77MiB", reason: "마지막 block은 14칸만 차도 통째로 받습니다." },
              { label: "공유 없이 네 개", expression: "88 × 4", result: "352 block = 308MiB", reason: "네 요청이 같은 앞부분을 각자 따로 저장합니다." },
              { label: "앞부분 공유", expression: "86 + 4 × 2", result: "94 block = 82.25MiB", reason: "같은 1,376 token은 한 벌만 두고 질문이 다른 꼬리만 요청마다 둡니다." },
            ]}
            conclusion="같은 사진을 알아보면 KV가 308MiB에서 82.25MiB로 줄어듭니다. 알아보지 못하면 사진 자리만큼 매번 다시 저장합니다."
            caveats={["block 크기 16과 질문 길이 20은 설명용 가정입니다.", "앞부분 재사용은 같은 모델과 같은 cache 영역에서만 성립합니다."]}
          />
          <KvFootprintViz />
        </section>

        <section id="why-parts" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 같은 사진을 알아볼 이름과 따로 세는 예산이 필요합니다</h2>
          <div className={prose}>
            <p>
              네 요청을 그대로 처리하면 vision encoder가 사진을 네 번 읽습니다. 사진 한 장의 embedding 1,369개를 네 번 만들어 5,476개를 계산하는 셈입니다. 같은 사진이라는
              사실만 알면 한 번 만든 결과를 남겨 두고 나머지 세 요청이 가져다 쓸 수 있습니다. 결과를 남겨 둘 저장소가 하나 필요합니다.
            </p>
            <p>
              같은 사진인지 알아보는 일은 생각보다 까다롭습니다. 3절에서 본 것처럼 문장에 들어간 1,369자리는 어느 사진이든 같은 token ID입니다. token ID만 비교하는 prefix
              cache는 다른 사진을 보낸 요청에도 앞 요청의 사진 KV를 내줄 수 있습니다. 사진 내용에서 계산한 이름이 따로 있어야 합니다.
            </p>
            <p>
              encoder는 사진 한 장을 한꺼번에 처리합니다. 사진 안의 patch가 서로를 양방향으로 참고하기 때문에, 문장 쪽이 사진의 마지막 9자리만 필요해도 사진 전체를
              돌려야 합니다. 그래서 이번 step에 encoder로 얼마를 계산할지 text token 수와 따로 세야 합니다. 저장소와 이름과 예산이 이 글의 세 부품입니다.
            </p>
          </div>
        </section>

        <section id="names" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 저장소와 이름과 예산에 표준 용어를 붙입니다</h2>
          <div className={prose}>
            <p>
              사진 내용에서 계산한 짧은 지문을 mm hash라고 부릅니다. vLLM은 기본으로 blake3 알고리즘을 쓰며 사용자가 사진마다 고유 문자열(UUID)을 붙여 이 지문을
              대신할 수도 있습니다. 이후 이 글에서 사진의 이름은 mm hash입니다.
            </p>
            <p>
              encoder가 만든 embedding을 mm hash별로 남겨 두는 저장소가 encoder cache입니다. vLLM의 encoder cache는 GPU에 있고 크기를 byte가 아니라 embedding 개수로
              잽니다. 사진 한 장은 1,369칸을 씁니다.
            </p>
            <p>
              한 step에 vision encoder로 계산할 embedding 개수의 상한을 encoder 계산 예산(encoder compute budget)이라고 부릅니다.
              vLLM에서는 이 값과 encoder cache 크기가 모두 max_num_batched_tokens를 따르며 사진 한 장의 최대 embedding 수보다 작아지지
              않습니다.
            </p>
            <p>
              GPU 앞단에는 별도의 CPU 저장소도 있습니다. 크기 맞춤과 patch 자르기 결과를 남겨 두는 processor cache입니다. encoder cache와 이름이 비슷하지만 남기는 대상과
              위치가 다릅니다. 12절에서 둘을 나란히 비교합니다.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {code("placeholder-repeat", "같은 image token을 1,369번 넣는 원문")}
            {code("hasher-default", "mm hash 기본 알고리즘")}
          </div>
        </section>

        <section id="trace" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. R2의 사진이 encoder를 건너뛰는 경로를 따라갑니다</h2>
          <div className={prose}>
            <p>
              R1이 사진 P와 질문 A를 보냈고 이미 처리 중이라고 하겠습니다. R2가 같은 사진 P에 질문 B를 붙여 들어옵니다. 입구의 processor는 P의 픽셀로 mm hash를 계산하고
              문장에 1,369개의 빈자리를 만듭니다. 이 빈자리는 R1의 것과 위치도 같은 16부터 1,384까지입니다.
            </p>
            <p>
              scheduler는 먼저 prefix cache를 찾습니다. 사진 block마다 P의 mm hash가 열쇠에 들어 있어 R1의 block과 맞고 꽉 찬 block 86개인
              1,376 token이 hit입니다. R2는 위치 1,376부터 계산하면 되고 그 범위에는 아직 KV가 없는 사진 마지막 9자리가 들어 있습니다.
            </p>
            <p>
              이제 그 9자리에 넣을 embedding이 필요합니다. scheduler는 encoder cache에 P가 있는지 묻고, R1이 남긴 결과가 있으면 R2를 참조자로 등록한 뒤 encoder를 건너뜁니다.
              모델 실행 단계는 encoder cache에서 P의 embedding을 꺼내 9자리에 끼워 넣습니다. R2는 encoder를 한 번도 돌리지 않았습니다.
            </p>
            <p>
              P가 이미 지워졌다면 사정이 다릅니다. 9자리를 채우려고 사진 전체 1,369개를 다시 encode해야 하고 encoder 예산도 1,369만큼 씁니다. 다음 세 절에서 이 경로의
              실제 함수를 차례로 엽니다.
            </p>
          </div>
        </section>

        <section id="encoder-cache" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. encoder cache는 사진마다 지금 쓰는 요청을 셉니다</h2>
          <div className={prose}>
            <p>
              vLLM v0.27.1 commit 6e448d0의 encoder_cache_manager.py에서 EncoderCacheManager는 mm hash마다 그 결과를 쓰는 요청 ID 집합을 둡니다. 95–122행
              check_and_update_cache는 P가 있으면 R2를 집합에 추가하고 True를 돌려줍니다. 집합이 비어 있던 항목이라면 반환 후보 목록에서 먼저 빼냅니다.
            </p>
            <p>
              요청이 사진을 다 쓰면 217–242행 free_encoder_input이 집합에서 그 요청만 지웁니다. 마지막 참조가 사라져도 결과를 바로 버리지 않고 freeable 목록 끝에 넣습니다.
              그래서 R1과 R2가 모두 끝난 뒤 다섯째 요청이 P를 보내도 자리가 남아 있는 동안은 다시 쓸 수 있습니다.
            </p>
            <p>
              언제 다 썼다고 보는지도 원문에 있습니다. scheduler.py 2113–2144행은 사진 구간 끝인 1,385가 이미 계산된 위치를 넘으면 참조를 놓습니다. 사진 자리의 KV가 다
              써진 뒤에는 그 정보가 KV cache에 있으므로 이 요청에는 embedding이 더 필요 없기 때문입니다.
            </p>
            <p>
              124–183행 can_allocate는 새 사진이 들어갈 때 두 조건을 봅니다. 사진 하나의 embedding 수가 남은 계산 예산 안에 들어오는지, 그리고 빈 자리나 비울 수 있는 자리가
              충분한지입니다. 빈 자리가 모자라면 참조가 0인 항목을 오래된 순서로 지웁니다. 지금 쓰는 요청이 있는 항목은 지우지 않습니다.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {code("ec-hit", "P를 찾고 참조를 추가하는 원문")}
            {code("ec-release", "마지막 참조를 놓는 원문")}
            {code("ec-allocate", "예산과 자리를 확인하는 원문")}
          </div>
        </section>

        <section id="encoder-budget" data-teach-level="5" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. encoder 예산이 다 차면 그 사진 앞에서 멈춥니다</h2>
          <div className={prose}>
            <p>
              encoder_cache_manager.py 273–321행 compute_mm_encoder_budget은 계산 예산과 cache 크기를 정합니다.
              config/scheduler.py 238–239행이 두 값 모두에 max_num_batched_tokens를 넣고 함수는 그 값과 사진 하나의 최대 embedding 수
              중 큰 쪽을 고릅니다. 이 글은 max_num_batched_tokens를 8,192로 둡니다. (가정)
            </p>
            <p>
              사진마다 1,369를 쓰면 한 step에 8,192÷1,369=5.98, 곧 사진 다섯 장까지 encode합니다. 다섯 장이 6,845를 쓰고 남은 1,347로는 여섯째 사진을 시작하지 못합니다.
              자리 하나에 embedding 하나가 대응하므로 사진 자리 1,369개를 한 번에 계산하는 요청은 text 예산도 그만큼 씁니다.
            </p>
            <p>
              두 예산이 따로 걸리는 경우는 사진의 일부만 이번 step에 계산할 때입니다. 일곱 요청이 모두 앞 1,376 token을 prefix cache에서 찾아 30 token씩만 남았다고 하겠습니다.
              text로는 210 token이지만 그중 9자리가 사진이고, encoder cache에 사진이 없으면 요청마다 1,369를 씁니다.
            </p>
          </div>
          <AlgorithmBlock
            title="한 요청의 사진 입력을 고르는 순서 (vLLM _try_schedule_encoder_inputs 요약)"
            input={["이번 step에 계산할 위치 범위 [computed, computed + new)", "남은 encoder 계산 예산", "encoder cache 상태"]}
            steps={[
              { code: "for item in 사진들 ∩ 이번 계산 범위:", note: "위치 범위와 겹치는 사진만 봅니다." },
              { code: "  if item.hash in 이번 step 선택: continue", note: "한 요청 안에서 같은 사진을 두 번 고르지 않습니다." },
              { code: "  if cache.has(item.hash): 참조 추가; continue", note: "R2의 P처럼 이미 있는 결과는 계산하지 않습니다." },
              { code: "  if not can_allocate(예산, 자리):", note: "예산이나 자리가 모자라면 이 사진을 이번 step에 넣지 않습니다." },
              { code: "    new = item.start − computed if computed < item.start else 0; break", note: "사진 앞까지만 계산하거나, 이미 사진 안이면 0으로 줄입니다." },
              { code: "  예산 −= item.embeds; 선택에 추가", note: "일부만 필요해도 사진 전체 embedding 수를 뺍니다." },
            ]}
            output="이번 step에 encode할 사진 목록과 줄어든 new token 수"
          />
          <EncoderScheduleViz />
          <CalculationWalkthrough
            title="일곱 요청의 encoder 예산"
            question="30 token씩 남은 일곱 요청 중 몇 개가 이번 step에 진행하나요?"
            scope="encoder 예산 8,192와 cache 8,192를 가정하고, 사진 P는 R1과 R2가 공유하며 나머지 다섯 장은 서로 다릅니다. text token 예산은 넉넉하다고 둡니다."
            steps={[
              { label: "R1 · P", expression: "8,192 − 1,369", result: "6,823", reason: "cache에 P가 없어 사진 전체를 encode합니다." },
              { label: "R2 · P", expression: "6,823 − 0", result: "6,823", reason: "R1이 자리를 잡아 둔 P를 참조만 합니다." },
              { label: "R3~R6 · Q R S T", expression: "6,823 − 4 × 1,369", result: "1,347", reason: "서로 다른 사진 네 장을 각각 encode합니다." },
              { label: "R7 · U", expression: "1,369 > 1,347", result: "이번 step 0 token", reason: "계산 시작점 1,376이 사진 시작 16보다 뒤라 사진 앞까지 줄일 여지도 없습니다." },
            ]}
            conclusion="text로는 210 token만 썼지만 encoder 예산 때문에 R7은 한 step 기다립니다."
            caveats={["다음 step에는 예산이 다시 8,192가 됩니다.", "cache 자리가 모자라면 참조가 0인 사진부터 지웁니다."]}
          />
          <div className={prose}>
            <p>아래 그림은 같은 일곱 요청을 사진 블록으로 쌓습니다. 띠 하나의 폭이 8,192이고 블록 하나가 사진 한 장입니다.</p>
          </div>
          <EncoderCacheSlotViz />
          <div className={prose}>
            <p>
              scheduler.py 1508–1553행은 위치 범위와 겹치는 사진을 고르고 cache에 있으면 넘어갑니다. 1572–1591행은 can_allocate가 거절할 때 위치를 줄이며, 1617–1620행은
              사진 일부만 필요해도 num_encoder_embeds 전체를 예산에서 뺍니다. 원문 주석은 encoder가 보통 양방향 attention을 쓰므로 사진을 한꺼번에 처리한다고 적습니다.
            </p>
            <p>
              우선순위 정책에서 이미 고른 요청을 밀어내면 590–613행이 그 요청이 쓴 encoder 예산을 되돌립니다. 기본 FCFS에서는 아직 차례가 오지 않은 마지막 요청을 밀어내므로
              되돌릴 예산이 없습니다.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {code("ec-budget", "예산과 cache 크기를 정하는 원문")}
            {code("sched-config-set", "max_num_batched_tokens를 넣는 원문")}
            {code("sched-encoder-items", "겹치는 사진을 고르는 원문")}
            {code("sched-rollback", "사진 앞까지 줄이는 원문")}
            {code("sched-budget-debit", "사진 전체를 예산에서 빼는 원문")}
            {code("sched-preempt-restore", "밀려난 요청의 예산을 되돌리는 원문")}
          </div>
        </section>

        <section id="prefix-key" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. prefix cache 열쇠에는 사진 hash와 위치가 들어갑니다</h2>
          <div className={prose}>
            <p>
              vLLM의 prefix cache는 block마다 앞 block의 hash, 이 block의 token ID, 추가 키를 함께 hash합니다. 이 체인 구조는{" "}
              <Link to="/cs/ai/prefix-caching-radix-attention#block-hash">prefix cache 글의 block hash 절</Link>에서 설명했습니다. 사진 문제는 셋째 항목인 추가 키에서
              풉니다.
            </p>
            <p>
              kv_cache_utils.py 450–515행 _gen_mm_extra_hash_keys는 block이 사진 위치를 포함하면 (mm hash, 사진 시작 − block 시작)을 추가 키로 넣습니다. 위치 16–31
              block에는 (P, 0), 32–47 block에는 (P, −16)이 붙습니다. 사진 Q를 보낸 요청은 token ID가 같아도 (Q, 0)이 붙어 첫 사진 block부터 열쇠가 갈립니다.
            </p>
            <p>
              558–593행은 LoRA 이름, 사진 키, cache_salt, prompt embedding 키를 한 tuple로 합칩니다. cache_salt는 첫 block에만
              넣지만 뒤 block이 앞 block의 hash를 이어 받으므로 salt가 다르면 모든 block이 갈립니다. 사진 키도 같은 체인을 따라 이후 block 전체에 영향을
              줍니다.
            </p>
          </div>
          <PrefixKeyViz />
          <div className={prose}>
            <p>
              사용자가 사진에 UUID를 붙이면 vLLM은 내용을 다시 hash하지 않고 그 이름으로 cache를 찾습니다. 공식 문서는 cache에 걸릴 것으로 예상되면 사진 데이터
              없이 UUID만 보낼 수 있고 걸리지 않으면 요청이 실패한다고 적습니다. 이름을 사용자가 정하는 만큼 같은 UUID에 다른 사진을 붙이지 않는 책임도 사용자에게 갑니다.
            </p>
          </div>
          <div id="doc-vllm-uuid" className="mt-6 scroll-mt-20">
            <CitationBlock source="vLLM docs · Multimodal Inputs (v0.27.1 commit 6e448d0)" citeKey={2} href="https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/docs/features/multimodal_inputs.md">
              <q>Note that the request will fail if the skipped media doesn&apos;t have a corresponding UUID, or if the UUID fails to hit the cache.</q> 같은 문서는 processor
              cache와 prefix cache가 모두 꺼져 있으면 UUID를 무시한다고 적습니다.
            </CitationBlock>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {code("mm-extra-keys", "block에 (사진 hash, offset)을 붙이는 원문")}
            {code("extra-keys-combine", "추가 키를 합치는 원문")}
          </div>
        </section>

        <section id="partial-hit" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. hit이 사진 중간에서 끝나면 사진 전체를 다시 encode할 수 있습니다</h2>
          <div className={prose}>
            <p>
              R2의 hit 1,376은 block 경계에서 끊겼고 사진은 1,384까지 이어집니다. 남은 9자리 때문에 encoder 결과가 필요합니다. 두 cache의 수명이 다르다는
              점이 여기서 드러납니다. KV는 수십 GB의 pool에 남아 있는데 이 글의 가정에서 encoder cache는 사진 다섯 장 남짓인 8,192칸뿐입니다.
            </p>
            <p>
              KV block은 살아 있고 encoder cache의 P만 지워졌다면 R2는 9자리를 위해 1,369개를 다시 계산합니다. 9절의 일곱 요청이 바로 이 상황이었습니다.
              원문 1586–1590행 주석은 prefix caching 때문에 계산 위치가 사진 시작보다 뒤에 있을 수 있고 그때 encoder 입력이 준비되지 않으면 그 요청은 이번
              step에 한 token도 진행하지 못한다고 적습니다.
            </p>
            <p>
              block 경계가 사진 끝과 맞으면 이 비용이 사라집니다. 사진이 위치 16–1,391을 차지해 block 87개를 정확히 채웠다면 hit이 사진 끝까지 닿아 encoder를 부를 일이
              없습니다. 다만 사진 자리 수는 사진 크기가 정하므로 서버가 경계를 맞출 수 있는 경우는 드뭅니다. 이 차이를 알면 같은 사진의 반복 요청에서 encoder 시간이
              가끔 튀는 이유를 설명할 수 있습니다.
            </p>
          </div>
        </section>

        <section id="placement" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. CPU 전처리 cache와 encoder 배치는 다른 손잡이입니다</h2>
          <div className={prose}>
            <p>
              processor cache는 GPU에 가기 전 CPU에서 만든 전처리 결과를 남깁니다. config/multimodal.py 138–146행에서 기본 크기는 4 GiB이고 API 프로세스와 engine
              프로세스마다 복제됩니다. 공식 문서는 최대 메모리를 mm_processor_cache_gb × data_parallel_size 또는 × api_server_count로 적습니다.
            </p>
            <p>
              API 서버 두 개라면 기본값으로 최대 8 GiB의 CPU 메모리를 씁니다. encoder cache가 GPU의 embedding을 남긴다면 processor cache는 그 앞 단계의 픽셀 조각을
              남깁니다. 같은 사진이 반복되는 다중 대화에서는 둘 다 일을 줄이지만 줄이는 일이 다릅니다.
            </p>
            <p>
              encoder를 GPU 여러 장에 어떻게 나눌지도 따로 정합니다. mm_encoder_tp_mode 기본값 weights는 언어 모델처럼 encoder 가중치를 나눕니다. data로 바꾸면 각 GPU가
              encoder 전체를 들고 사진 묶음을 나눠 처리합니다. 문서는 TP 8에서 처리량과 TTFT가 약 10% 좋아졌다는 측정을 적지만, 모델별 구현이 필요하고 메모리가 조금 늘어납니다.
            </p>
            <p>
              encoder를 아예 다른 서버로 떼어 내는 구성도 있습니다. SGLang은 --encoder-only 서버와 --language-only 서버를 나누고 --encoder-transfer-backend로 embedding을
              넘깁니다. vLLM scheduler에도 원격 encoder cache를 확인하는 ec_connector 분기가 있습니다(1609행). 이 구성의 이득과 운영 비용은{" "}
              <Link to="/cs/ai/disaggregated-prefill-decode-serving">prefill과 decode를 나누는 글</Link>의 판단 기준을 그대로 적용해 따로 측정해야 합니다.
            </p>
          </div>
          <div id="doc-vllm-mm-cache" className="mt-6 scroll-mt-20">
            <CitationBlock source="vLLM docs · Optimization and Tuning · Multi-Modal Caching" citeKey={3} href="https://github.com/vllm-project/vllm/blob/6e448d0ea9bf3d88d898b65449ca6dc2aec170ac/docs/configuration/optimization.md">
              <q>Multi-modal caching avoids repeated transfer or processing of the same multi-modal data, which commonly occurs in multi-turn conversations.</q> 같은 문서의
              batch-level DP 절의 약 10%·40% 개선은 문서 작성자의 측정이며 모델과 하드웨어 조건에 묶입니다.
            </CitationBlock>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">{code("processor-cache-config", "processor cache와 encoder 분할 설정")}</div>
        </section>

        <section id="engines" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">13. SGLang과 TensorRT-LLM도 같은 세 질문에 답합니다</h2>
          <div className={prose}>
            <p>
              SGLang commit 4560da5의 multimodal_cache.py에서 MultiModalStaticCache는 embedding을 hash별로 남기고 byte 상한을 넘으면 가장 오래 안 쓴 항목부터 지웁니다
              (76–127행). vLLM처럼 지금 쓰는 요청 집합을 따로 두지 않고 순서만으로 지웁니다. 여러 사진의 hash를 묶은 결합 hash로 먼저 찾는 점도 다릅니다.
            </p>
            <p>
              TensorRT-LLM 문서는 multimodal 처리의 최적화로 in-flight batching, CPU 전처리와 GPU encode의 겹침, 그리고 원본 데이터 hash를 이용한 KV 재사용을 꼽습니다.
              KV cache 문서는 UUID를 주면 BLAKE3(UUID || Content)로 열쇠를 만든다고 적습니다. 같은 UUID에 다른 내용이 와도 열쇠가 갈리도록 내용까지 섞는 방식입니다.
            </p>
            <p>
              세 엔진 모두 같은 질문에 답합니다. 같은 사진을 무엇으로 알아보는가, encoder 결과를 어디에 얼마나 남기는가, 사진 자리가 섞인 prefix의 열쇠에 무엇을 넣는가입니다.
              엔진 사이의 더 넓은 차이는 <Link to="/cs/ai/tensorrt-llm-kv-cache-and-kernels">TensorRT-LLM KV cache 글</Link>과{" "}
              <Link to="/cs/ai/sglang-runtime-anatomy">SGLang 런타임 글</Link>에서 다룹니다.
            </p>
          </div>
          <div id="doc-trtllm-mm" className="mt-6 scroll-mt-20">
            <CitationBlock source="TensorRT-LLM docs · KV Cache System · Multimodal UUID Support (commit 681cff1)" citeKey={4} href="https://github.com/NVIDIA/TensorRT-LLM/blob/681cff123b96e0a8fd52d977366a62677de7ae08/docs/source/features/kvcache.md">
              <q>the cache key is computed from both the UUID and content together using BLAKE3(UUID || Content).</q> 같은 저장소의 multi-modality.md는 raw data hashing이
              image hash와 token chunk 정보로 KV 재사용을 돕는다고 적습니다.
            </CitationBlock>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">{code("sglang-static-cache", "SGLang embedding cache의 LRU 원문")}</div>
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">14. 자리 수와 cache 크기는 모델과 설정마다 다시 셉니다</h2>
          <div className={prose}>
            <p>
              1,369는 Qwen2.5-VL-7B의 전처리 규칙과 1,024 사진에서 나온 수입니다. 고정 해상도로 줄이는 모델은 사진 크기와 상관없이 같은 수를 쓰고 영상은 시간 축
              묶음까지 곱해집니다. 서버를 계획할 때는 사용하는 모델의 processor로 실제 자리 수를 세야 합니다. 사진 개수 상한은 limit_mm_per_prompt로 따로
              정합니다.
            </p>
            <p>
              이 글의 KV 크기는 BF16 저장과 16 token block을 가정했습니다. KV를 8 bit로 저장하면 절반이 되고 tensor 병렬로 나누면 GPU 한 장의 몫이
              줄어듭니다. encoder cache 8,192와 일곱 요청의 순서는 원문 동작을 보여 주려고 고른 값이며 측정한 처리량이 아닙니다.
            </p>
            <p>
              같은 사진을 알아보는 장치는 정확성의 문제이기도 합니다. hash를 열쇠에 넣지 않은 cache는 빠르지만 다른 사진의 답을 낼 수 있습니다. 성능을 비교할 때는 encoder
              cache 적중, prefix hit 길이, 다시 encode한 횟수를 따로 기록해야 어느 장치가 시간을 줄였는지 구별할 수 있습니다.
            </p>
          </div>
          <ContentBoundary article="multimodal-serving-pipeline" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">15. 같은 사진으로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>사진을 2,048×2,048로 바꾸면 placeholder는 몇 개가 되고 KV는 몇 MiB가 되나요? (답: 3절, 4절)</p>
            <p>사진 Q를 보낸 요청이 사진 P의 KV를 잘못 가져가지 않는 이유는 무엇이고, 사진이 없는 첫 block은 왜 공유해도 되나요? (답: 10절)</p>
            <p>prefix hit이 1,376에서 끝났는데 encoder cache에 사진이 없습니다. encoder 예산은 얼마나 쓰이고 요청은 이번 step에 진행할 수 있나요? (답: 9절, 11절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={multimodalTrees}
        projectMetas={{
          transformers: { id: "transformers", label: "transformers 고정 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          vllm: { id: "vllm", label: "vLLM v0.27.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          sglang: { id: "sglang", label: "SGLang 고정 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
