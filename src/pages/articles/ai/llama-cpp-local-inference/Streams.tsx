import { CodeViewButton } from "@/components/code";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import KvStreamSplitViz from "./viz/KvStreamSplitViz";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

interface Props {
  code: (key: string) => void;
}

export default function Streams({ code }: Props) {
  return (
    <section id="streams" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">10. 배열을 slot마다 나눌지 하나로 둘지가 상한과 낭비를 정합니다</h2>
      <div className={prose}>
        <p>
          이제 실제 크기로 돌아옵니다. 서버를 -c 16384, -np 4로 띄우면 cell이 16,384개이고 slot이 4개입니다. 이 cell들을 slot마다 4,096개씩 따로 둘 수도 있고,
          배열 하나에 두고 함께 쓸 수도 있습니다. 서버 문서는 slot 수를 auto로 두면 하나로 합친 unified 배열을 기본으로 켠다고 적습니다.
        </p>
        <p>
          먼저 cell 하나의 무게를 셉니다. Llama 3.1 8B는 KV head 8개에 head 폭 128이라 한 층의 K 폭이 1,024입니다. 설정값은 Meta 공식 저장소가 접근 승인을
          요구해 같은 파일을 옮긴 공개 사본에서 읽었습니다. 아래 장부는 f16 KV를 가정하고 층 32개를 모두 더합니다.
        </p>
      </div>
      <CalculationWalkthrough
        title="KV cell 하나와 배열 전체의 byte"
        question="n_ctx 16,384인 f16 KV 배열은 몇 byte일까요?"
        scope="Llama 3.1 8B 설정, -ctk·-ctv 기본값 f16, stream 하나 기준입니다. 계산 버퍼와 mask 메모리는 넣지 않았습니다."
        steps={[
          { label: "한 층의 K 폭", expression: "8 KV head × 128", result: "1,024 원소", reason: "GQA라 query head 32개가 KV head 8개를 나눠 읽습니다. 저장은 8개분만 합니다." },
          { label: "한 층의 K와 V", expression: "2 × 1,024 × 2 byte", result: "4,096 byte", reason: "K와 V 두 장을 f16 2 byte로 저장합니다." },
          { label: "32층", expression: "4,096 × 32", result: "131,072 byte = 128 KiB", reason: "모든 층이 같은 cell 번호에 자기 K·V를 둡니다. cell 하나가 32층을 모두 차지합니다." },
          { label: "배열 전체", expression: "128 KiB × 16,384", result: "2 GiB", reason: "unified이든 slot별이든 cell 총수는 같으므로 전체 byte도 같습니다." },
        ]}
        conclusion="cell 하나는 128 KiB이고, 16,384 cell은 2GiB입니다. 나누는 방식은 총량이 아니라 누가 얼마까지 쓸 수 있는지를 바꿉니다."
        caveats={["-ctk q8_0처럼 KV를 양자화하면 원소당 byte가 줄어듭니다.", "층별 device 배치에 따라 이 2GiB가 GPU와 RAM에 나뉩니다."]}
      />
      <div className={prose}>
        <p>
          slot별로 나누면 llama-context.cpp가 한 sequence의 상한을 16,384 ÷ 4 = 4,096으로 정합니다. 6,000 token 문서를 넣은 대화는 나머지 세 slot이 500
          token씩만 써도 들어가지 못합니다. 배열 전체로는 cell 14,884개가 비어 있는데도 칸막이가 그 자리를 다른 slot의 몫으로 묶어 둡니다.
        </p>
        <p>
          unified 배열에서는 같은 요청이 6,000 + 500 + 500 + 500 = 7,500 cell로 모두 들어갑니다. 대신 한 대화가 15,000 cell을 쥐면 남는 cell이 1,384개라
          500짜리 셋째 대화가 자리를 못 찾습니다. 앞 절에서 본 대로 쥔 cell을 빼앗는 경로가 없으니 그 대화는 실패합니다.
        </p>
      </div>
      <KvStreamSplitViz />
      <div className={prose}>
        <p>
          unified에는 계산 쪽 낭비도 있습니다. 7,500 cell이 앞에서부터 꽉 찼다면 decode step 하나는 n_kv = 7,680칸을 받습니다. 네 query 각각이 7,680칸에 점수를
          매기면 30,720개 중 실제로 남는 점수는 7,500개, 약 24%입니다. 짧은 대화 하나는 7,680칸 중 자기 500칸만 남기니 93% 이상을 버립니다.
        </p>
        <p>
          K와 V를 읽는 byte는 그만큼 늘지 않습니다. 네 query를 한 tile에서 계산하면 같은 7,680 cell을 한 번 읽어 넷이 함께 씁니다. (가정) 그래서 unified의
          낭비는 주로 점수 계산과 mask 행 크기로 나타나고, slot 수가 늘수록 커집니다. slot별 stream은 반대로 각 stream이 자기 범위만 읽고 끝 tile 생략도 켜집니다.
        </p>
        <p>
          서버 옵션 세 개가 이 선택입니다. -np로 slot 수를, -kvu와 -no-kvu로 배열을 합칠지를 정합니다. --kv-unified-per-slot N은 합친 배열에서도 slot 하나의
          문맥을 N으로 묶습니다. N = 8,192로 두면 6,000 문서는 받고 15,000 독차지는 막는 중간 지점이 됩니다.
        </p>
      </div>
      <CodeViewButton label="unified가 아니면 n_ctx를 slot 수로 나누는 줄" onClick={() => code("n-ctx-seq")} />
    </section>
  );
}
