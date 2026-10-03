import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ErasedColumnsViz from "./the-gap-was-made/viz/ErasedColumnsViz";
import ThreeFiltersViz from "./the-gap-was-made/viz/ThreeFiltersViz";

/**
 * 조항 번호가 65에서 100으로 건너뜁니다
 *
 * 역사 8편. 앞 글의 치우침은 재료와 세월이 만든 것이었고, 이 글의 공백은
 * 사람이 만든 것이다. 1차 자료는 함무라비 법전이고 C. H. W. Johns 영역
 * (1903년 T. & T. Clark 판)의 Project Gutenberg 전사본(eBook 17150)으로
 * 읽었다. 돌의 상태와 지워진 단에 대한 서술은 그 판의 머리말과 편집자 주의
 * 것이다.
 */
export default function TheGapWasMadeArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          65조 다음이 100조입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 숫자를 읽느라 들여다본 법전을 이번에는 처음부터 넘겨
            봅니다. 이상한 자리가 하나 나옵니다. 조항이 65까지 가다가 바로
            100으로 건너뜁니다. 그 사이 34개의 번호에는 본문이 없습니다. <strong>비어 있는 것이 아니라 아예 없습니다.</strong>
          </p>

          <p className="leading-7">
            편집자가 그 자리에 주를 달아 두었습니다. 돌기둥의 다섯 단이 여기서
            지워졌고 열일곱째 단의 첫 글자들만 보인다고 밝힙니다. 앞 글의
            폐허는 재료와 세월이 만든 공백이었는데 이 공백은 누군가가 끌을
            들고 만들었습니다.
          </p>

          <p className="leading-7">
            <strong>
              지운 자리에서 무엇을 읽을 수 있고, 그 자리를 메우려는 시도는 어디까지
              원래의 것과 같은 자격을 갖습니까.
            </strong>{" "}
            <Link to="/history/inference-from-sources/ruins-mislead">앞 글</Link>이
            걸러지는 자료를 다뤘다면, 이 글은 지워진 자료를 다룹니다.
          </p>
        </div>

        <ErasedColumnsViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            넷을 차례로 밟습니다. 어떻게 사라졌는지, 번호의 간격이 무엇을 담고
            있는지, 사라진 내용을 두고 무엇을 알 수 있는지, 다른 경로로 돌아온
            조각을 어떻게 다루는지입니다.
          </p>

          <p className="leading-7">
            <em>여기까지만 읽어도 하나는 남습니다. 공백에도 만들어진 내력이
            있습니다. 그 내력이 공백에서 읽어 낼 수 있는 범위를 정합니다.</em>
          </p>
        </div>
      </section>

      <section id="how-it-vanished" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 깨진 것이 아니라 긁어내고 다시 다듬은 것입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            돌기둥은 높이가 8피트에 가깝습니다. 조각난 채 발견되었지만 어렵지
            않게 다시 맞춰졌으니 이 사료의 손상은 대부분 복구되었습니다.
            복구되지 않은 자리가 문제의 그 다섯 단입니다.
          </p>

          <p className="leading-7">
            머리말에 그 자리의 상태가 나옵니다. 앞면에 다섯 단이 더 있었는데
            그것들이 지워지고 <strong>돌이 다시 매끄럽게 다듬어졌다</strong>고
            적혀 있습니다. 깨지거나 닳아서 글자가 흐려진 것과는 다릅니다. 글을
            없애고 그 면을 쓸 수 있게 만든 작업이고 목적은 면을 얻는 데
            있었다는 뜻입니다.
          </p>

          <p className="leading-7">
            편집자는 그 목적을 짐작해 둡니다. 어떤 정복자가 자기 이름과 칭호를
            거기 새기려 한 작업으로 보인다고 말합니다. 그런데 그 다음이
            중요합니다. <strong>실제로는 아무것도 새겨지지
            않았습니다.</strong> 그래서 이 지운 자리에는 돌기둥을 가져간 자의
            이름을 알려 줄 새 글이 없다고 적습니다.
          </p>

          <p className="leading-7">
            여기서 <strong>돌에 새겨진 단서의 한계</strong>가 드러납니다. 현재
            소장기관인 <a
            href="https://www.louvre.fr/en/the-code-of-hammurabi">루브르
            박물관</a>은 이 돌이 엘람 왕 슈트룩 나흐훈테의 전리품으로 수사에
            옮겨졌다고 설명합니다. 돌의 지운 자리에 이름이 없다는 사실과 다른
            자료로 이동 경위를 설명하는 일은 구분해야 합니다.
          </p>

          <p className="leading-7">
            지우는 일이 중간에 멈추면서 기록이 두 번 비었습니다. 지워진 조항이
            없어졌고, 지운 자가 남기려던 표시도 없어졌습니다. 지운 자리 자체에
            남은 것은 <strong>누군가 지웠다는 흔적</strong>이고 그
            사실만으로도 공백의 종류는 정해집니다. 우연한 소실이 아니라 의도된
            삭제입니다.
          </p>
        </div>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>공백의 종류가 정해졌습니다. 다음은 그 공백이 지금의 책에서
            어떤 꼴로 나타나는가입니다.</em>
          </p>
        </div>
      </section>

      <section id="the-numbering" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 조항 번호 안에 추정값이 들어 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            65조 뒤의 주는 사라진 내용을 적은 뒤 한 줄을 덧붙입니다. 셰일이
            사라진 부분을 35개 조항으로 추정했고 그를 따라 100조부터 다시
            시작한다고 밝힙니다. 65에서 100까지의 번호 차이는 35이지만 그
            사이에 빠진 번호 66~99는 34개입니다. <strong>번호의 차이와 빠진
            번호의 개수는 같은 수가 아닙니다.</strong>
          </p>

          <p className="leading-7">
            문제는 <strong>그 35를 아무도 세지 않았다는 점</strong>입니다.
            지워진 단에서 조항을 셀 수는 없습니다. 이 판의 주는 셰일이 어떤
            절차로 35를 얻었는지도 설명하지 않습니다. 35가 꼭 사라진 조항
            수라고 단정할 수는 없습니다. 100이라는 번호도 돌에 새겨진 글자가
            아니고 복원 과정에서 붙었습니다.
          </p>

          <p className="leading-7">
            그래서 "함무라비 법전 제100조"라고 적으면 그 번호 안에 다른 사람의
            추정이 함께 실려 옵니다. 다른 학자가 사라진 분량을 30개로 보았다면
            같은 조항이 95조가 되었을 것입니다. 사료를 가리키는 이름표가 <strong>사료를 복원한 판단에서 온 경우</strong>입니다. 인용할 때
            어느 판을 따랐는지 함께 적어야 하는 이유가 여기 있습니다.
          </p>

          <p className="leading-7">
            앞 분류에서 본 꼬리표가 여기서도 같은 일을 합니다. 편집자가
            추정이라고 적어 두었으므로 독자는 그 번호를 추정으로 다룰 수
            있습니다. 주를 빼고 조항만 실은 책이었다면 65 다음이 100인 것을
            보고도 무슨 일이 있었는지 알 수 없었을 것입니다.
          </p>
        </div>

        <CitationBlock
          source="함무라비 법전 65조 뒤 편집자 주 · C. H. W. Johns 영역(1903년 판)"
          citeKey={1}
          href="https://www.gutenberg.org/ebooks/17150"
        >
          원문은 이렇습니다 — “NOTE.—Here five columns of the monument have been
          erased, only the commencing characters of column xvii. being visible.
          The subjects of this last part included the further enactments
          concerning the rights and duties of gardeners, the whole of the
          regulations concerning houses let to tenants, and the relationships of
          the merchant to his agents… Scheil estimates the lost portion at 35
          sections, and following him we recommence with section 100.” 머리말은
          돌기둥에 대해 “There were five more columns on this side, but they have
          been erased and the stone repolished, doubtless by the Elamite
          conqueror, who meant to inscribe his name and titles there”라고 적고,
          실제로는 새기지 않아 누가 돌을 가져갔는지에 대한 단서가 남지 않았다고
          덧붙입니다. Project Gutenberg 전사본(eBook 17150)으로 읽었고, facsimile이
          아니므로 쪽수 대신 조항 번호와 해당 주의 위치만 적습니다.
        </CitationBlock>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>번호의 성격이 밝혀졌습니다. 이제 그 안에 들어 있었을 내용을
            두고 무엇을 말할 수 있는지로 넘어갑니다.</em>
          </p>
        </div>
      </section>

      <section id="what-was-lost" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 사라진 것의 주제는 알고 내용은 모릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            같은 주가 사라진 부분의 주제를 적어 둡니다. 정원사의 권리와 의무에
            관한 나머지 규정, 세든 집에 관한 규정 전체, 그리고 상인과 그
            대리인의 관계입니다. 마지막 주제는 돌의 다른 면에서 이어지므로 그
            앞부분이 여기 있었다고 봅니다.
          </p>
        </div>

        <ThreeFiltersViz />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            주제를 아는 일과 내용을 아는 일은 다릅니다. 65조까지 정원사를
            다루다가 100조부터 상인의 대리인을 다루고 있으면 그 사이에 정원사
            규정의 마무리와 상인 대리인 규정의 시작이 있었다고 볼 수 있습니다.
            끊긴 자리의 앞과 뒤가 <strong>공백의 모양을 그려 주는
            것</strong>입니다.
          </p>

          <p className="leading-7">
            그러나 그 안의 조항이 무엇을 정했는지는 모양에서 나오지 않습니다.
            세든 집에 관한 규정이 있었다는 말과, 그 규정이 집주인에게
            유리했는지 세든 쪽에 유리했는지를 가리는 말은 전혀 다른 수준의
            주장입니다. 규정이 있었다는 말까지는 남은 자료가 받치지만 유리함을
            가리는 말은 받쳐지지 않습니다.
          </p>

          <p className="leading-7">
            여기서 앞 글의 마지막 규칙이 그대로 걸립니다. 자료가 한 점을
            받치지 못하면 한 점을 적지 않습니다. 이 공백을 두고 적을 수 있는
            것은 주제의 목록과 분량의 추정까지입니다. 그 너머는 이 사료로 할
            수 있는 말이 아닙니다.
          </p>
        </div>

        <TermBreakdown
          title="공백에 대해 말할 수 있는 것"
          description="같은 공백에서 나오는 주장들의 수준이 다릅니다."
          items={[
            {
              term: "받쳐지는 주장",
              description:
                "다섯 단이 지워졌다는 것, 그 자리에 정원사·세든 집·상인 대리인에 관한 조항이 있었다는 것입니다.",
              example:
                "끊긴 자리의 앞과 뒤가 남아 있고 편집자가 그 근거를 적어 두었습니다.",
              boundary:
                "분량이 35개 조항이라는 것은 추정이므로 이 묶음 안에서도 가장 약한 쪽입니다.",
            },
            {
              term: "받쳐지지 않는 주장",
              description:
                "그 조항들이 무엇을 정했는지, 누구에게 유리했는지입니다.",
              example:
                "세든 집에 관한 규정이 있었다는 것과 그것이 집주인 쪽이었다는 것은 수준이 다릅니다.",
              boundary:
                "다른 사료에서 끌어온 것이라면 적을 수 있지만, 그때는 이 법전이 아니라 그 사료를 근거로 적어야 합니다.",
            },
          ]}
        />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>
              공백의 한계가 정해졌습니다. 그런데 그 공백의 일부가 돌아온 경로가
              있습니다.
            </em>
          </p>
        </div>
      </section>

      <section id="copies" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 돌아온 세 조항에는 다른 표시가 붙어 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            본문 끝에 조항 셋이 따로 실려 있습니다. 편집자는 그 셋이 한
            사본에서 알려졌다고 적습니다. 기원전 7세기에 어느 아시리아 왕을
            위해 만들어진 사본이라고 합니다. 이 법전에 속한 것이 분명하고
            완전함을 위해 여기 싣는다고 밝힙니다. 그 셋이 지워진 다섯 단이
            차지하던 자리에 들어가는 것도 분명하다고 덧붙입니다.
          </p>

          <p className="leading-7">
            돌기둥이 지워진 때가 그 사본이 만들어진 때보다 나중인지 먼저인지는
            알 수 없습니다. 결과만 보면 <strong>원본에서 사라진 내용이 복제를
            통해 일부 돌아온 것</strong>입니다. 기록이 여러 벌 있을 때 하나가
            지워져도 전부가 사라지지는 않는다고 말해 주는 자리입니다.
          </p>

          <p className="leading-7">
            그러나 편집자는 돌아온 셋을 다른 조항과 섞지 않았습니다. 번호를
            붙여 순서 안에 넣지 않고 본문 끝에 따로 두었고 어디서 왔는지와 왜
            여기 싣는지를 함께 적었습니다. 이 처리가 뜻하는 바가 이 글의
            마지막 내용입니다. <strong>같은 내용이라도 원본에서 읽은 것과 한참
            뒤의 사본에서 읽은 것은 같은 자격이 아닙니다.</strong>
          </p>
        </div>

        <ProgressiveDetail
          title="자격이 다르다는 것이 왜 중요한가"
          preview="사본은 베끼는 과정에서 달라질 수 있고, 그 달라짐이 어느 쪽인지를 확인할 원본이 바로 그 자리에서 사라졌기 때문입니다."
        >
          <p className="leading-7">
            다른 조항들은 돌에 새겨진 글자를 읽은 것이므로 전해지는 과정이 한
            단계입니다. 돌아온 세 조항은 누군가 베껴 적은 것을 읽었으니 한
            단계가 더 있습니다. 베끼는 동안 글자가 바뀌었는지는 원본과 대어
            보면 알 수 있습니다. 하필 그 부분의 원본이 지워진 자리입니다.
          </p>
          <p className="leading-7">
            그래서 이 세 조항은 다른 조항들과 내용은 나란히 읽되 근거의 무게는
            다르게 잡아야 합니다. 앞 분류에서 각 서술에 누구의 보고인지를
            붙이던 일과 같은 꼴입니다. 다만 여기서 꼬리표는 내용에 붙지 않고
            전해진 경로에 붙습니다.
          </p>
          <p className="leading-7">
            덧붙여, 이 판본은 또 한 번 걸러져 있습니다. 머리말은 왕의 칭호와
            축복과 저주에 해당하는 700행쯤을 번역하지 않았다고 적습니다. 많은
            주석 없이는 뜻이 통하지 않고 법전을 이해시키려는 이 책의 목적과도
            거리가 멀다는 이유를 밝힙니다. 이유가 적혀 있으므로 독자는 자기가
            읽는 글이 무엇에서 걸러졌는지 알 수 있습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            <em>이 글이 물은 두 가지는 여기서 답이 났습니다. 공백에도 내력이
            있고 메워진 자리에도 경로가 있습니다. 둘 다 적혀 있을 때에만 읽는
            쪽이 무게를 다르게 잡을 수 있습니다.</em>
          </p>
        </div>
      </section>

      <section id="handoff" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          다음은 우리가 붙인 이름입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            앞의 두 글은 사료가 손에 들어오기까지 무엇이 걸러졌는지를
            봤습니다. 그런데 걸러짐이 자료 쪽에서만 들어오지는 않습니다. 읽는
            쪽이 들고 오는 것도 있습니다.
          </p>

          <p className="leading-7">
            이 돌기둥을 우리는 법전이라고 부릅니다. 그런데 돌에 새겨진 글이 스스로를
            무엇이라고 부르는지는 따로 적혀 있습니다. 둘이 다르다면 우리가 붙인
            이름은 무엇을 더하고 무엇을 가립니까. 마지막 글의 질문입니다.
          </p>

          <h3 className="mt-10 mb-4 text-lg font-bold">
            읽고 나서 맞춰 볼 질문
          </h3>

          <p className="leading-7">
            1. 이 공백이 우연한 소실이 아니라는 것을 무엇으로 알 수 있습니까.{" "}
            <strong>(답: 부품 1절)</strong>
          </p>

          <p className="leading-7">
            2. "제100조"라는 번호를 인용할 때 함께 인용되는 것은 무엇입니까.{" "}
            <strong>(답: 부품 2절)</strong>
          </p>

          <p className="leading-7">
            3. 돌아온 세 조항을 다른 조항과 섞지 않은 까닭은 무엇입니까.{" "}
            <strong>(답: 부품 4절)</strong>
          </p>
        </div>

        <ContentBoundary article="the-gap-was-made" />
      </section>
    </div>
  );
}
