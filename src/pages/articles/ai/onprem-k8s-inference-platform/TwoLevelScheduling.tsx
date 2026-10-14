import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";

/** llm-d-router 907c5fe8의 prefixhash/hashing.go 103–129행을 고치지 않고 옮긴 원문 */
const HASHING_SOURCE = String.raw`// computeBlockHashes hashes a prompt in blocks of blockSizeTokens tokens, the
// last possibly partial, up to maxPrefixBlocks blocks. Block i's hash is xxhash
// over its content hash and block i-1's hash, both little-endian; block 0
// chains from a seed hashed over the target model and cache salt.
func computeBlockHashes(request *scheduling.InferenceRequest, tokens []uint32, blockSizeTokens, maxPrefixBlocks int) []BlockHash {
	if len(tokens) == 0 || blockSizeTokens <= 0 || maxPrefixBlocks <= 0 {
		return nil
	}
	count := min((len(tokens)-1)/blockSizeTokens+1, maxPrefixBlocks)
	blockHashes := make([]BlockHash, 0, count)

	// Different models should have different hashes even with the same body.
	var seed xxhash.Digest
	seed.Reset()
	_, _ = seed.WriteString(request.TargetModel)
	_, _ = seed.WriteString(request.Body.TokenizedRequest.CacheSalt)
	prevBlockHash := BlockHash(seed.Sum64())

	var buf [16]byte
	for i := range count {
		block := HashBlock{Tokens: tokens[i*blockSizeTokens : min((i+1)*blockSizeTokens, len(tokens))]}
		PutBlockHash(buf[:8], BlockHash(block.Hash()))
		PutBlockHash(buf[8:], prevBlockHash)
		prevBlockHash = BlockHash(xxhash.Sum64(buf[:]))
		blockHashes = append(blockHashes, prevBlockHash)
	}
`;

export default function TwoLevelScheduling() {
  return (
    <section id="two-level-scheduling" data-calculation-explained className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">선택기는 요청마다 한 번 고르고, 엔진은 출력 token마다 다시 고릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 절의 선택기와 모델 서버 안의 scheduler는 둘 다 고르는 일을 하지만 고르는 대상과 횟수가 다릅니다. 선택기는 요청이 들어올
          때 한 번, 어느 서버로 보낼지 고릅니다. 서버 안 scheduler는 실행 한 번마다 이번에 어떤 요청을 몇 token씩 함께 계산할지
          다시 고릅니다.
        </p>
        <p>
          입력 300 token에 출력 200 token인 요청 하나로 세어 봅니다. 선택기의 결정은 1번입니다. 서버 안에서는 입력을 읽는 실행과
          출력 token 200개를 하나씩 이어 쓰는 실행이 있으므로 이 요청이 들어간 batch 결정이 200번 넘게 일어납니다. 출력 token 하나에
          30ms가 걸린다고 가정하면 그 결정이 30ms마다 돌아옵니다.
        </p>
        <p>
          빠른 쪽 결정을 선택기로 옮길 수 없는 이유는 그 결정에 필요한 장부가 서버 안에 있기 때문입니다. 어느 요청이 어떤 KV block을
          쥐고 있고 다음 token에 block이 하나 더 필요한지는{" "}
          <Link to="/cs/ai/vllm-paged-attention#logical-physical-address">block table</Link>과 free 목록이 알고, 그 둘은 엔진
          process 안에 있습니다.
          </p>
          <p>
            30ms마다 network를 건너 이 장부를 묻고 답을 기다리면 그 왕복이 출력 속도를 직접 늦춥니다. 이미
          시작한 요청을 다른 서버로 옮기려면 KV 자체를 옮겨야 하며, 그 비용은{" "}
          <Link to="/cs/ai/disaggregated-prefill-decode-serving#transfer-bytes">분리 서빙의 전송량</Link>이 다룹니다.
        </p>
        <p>
          그래서 느리지만 전체를 보는 결정은 선택기가 요청마다 한 번 하고, 빠르고 지역적인 결정은 엔진이 실행마다 합니다. 엔진 안의
          결정 과정은{" "}
          <Link to="/cs/ai/continuous-batching-step-anatomy#step-unit">연속 배칭의 한 실행</Link>이 다룹니다. 이 절은 선택기가
          요청마다 한 번 고를 때 무엇을 보는지 봅니다.
        </p>
      </div>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          선택기가 보는 값 하나가 어느 서버에 이 요청의 앞부분 KV가 이미 남아 있을지입니다. llm-d의 approximate prefix producer는
          요청의 token ID를 고정 크기 block으로 자르고 block마다 hash를 만듭니다.
          </p>
          <p>
            그리고 최근에 어느 pod로 어떤 block hash를 가진
          요청을 보냈는지 pod별 LRU index에 적어 둡니다. 다음 요청이 오면 같은 hash를 index에서 찾아 pod마다 이미 계산돼 있을 것으로
          예상되는 token 수를 냅니다.
        </p>
        <p>
          Block 크기의 기본값이자 최솟값은 64 token입니다. 300 token 입력은 (300 − 1) ÷ 64 + 1 = 5개 block, 곧 64·64·64·64·44
          token으로 나뉩니다.
          </p>
          <p>
            앞의 256 token이 모든 요청에 같은 system prompt라고 합시다. 방금 같은 prompt의 요청을 받은 pod A의
          index에는 앞 네 block의 hash가 있어 4 × 64 = 256 token이 이미 계산돼 있을 것으로 예상됩니다. 그런 요청을 받은 적 없는 pod
          B는 0입니다. 이 예상과 대기열 길이를 함께 저울질해 pod를 고릅니다.
        </p>
        <p>
          원문 코드는 block hash를 서로 사슬처럼 엮습니다. Block i의 hash는 그 block 내용의 hash와 바로 앞 block의 hash를 함께
          넣어 다시 만든 값입니다. 첫 block은 모델 이름과 cache salt로 만든 seed에 이어집니다. 그래서 내용이 같은 block이라도 앞부분이
          다르면 hash가 달라지고, 처음부터 이어서 같은 앞부분만 일치로 잡힙니다. 모델이 다르면 seed부터 달라 같은 문장도 섞이지
          않습니다.
        </p>
      </div>

      <CodePanel
        title="llm-d-router · prefixhash/hashing.go L103–129 (907c5fe8)"
        code={HASHING_SOURCE}
        lang="go"
        startLine={103}
        defaultOpen
        annotations={[
          { lines: [111, 111], color: "sky", note: "300 token, 64 token block이면 (300−1)/64+1 = 5개입니다." },
          { lines: [114, 119], color: "amber", note: "모델 이름과 cache salt로 첫 seed를 만듭니다. 다른 모델의 같은 문장은 일치하지 않습니다." },
          { lines: [122, 127], color: "emerald", note: "block 내용 hash와 앞 block hash를 함께 넣어 다음 hash를 만듭니다. 앞 block 하나만 달라도 뒤가 모두 달라집니다." },
        ]}
      />

      <CalculationWalkthrough
        title="한 token 차이가 예상 적중을 지우는 경로"
        question="선택기와 엔진의 tokenizer가 앞부분의 10번째 token에서 갈리면 pod A의 예상 적중은 몇 token일까요?"
        scope="위의 300 token 요청과 64 token block만 봅니다. 엔진 안 prefix cache의 실제 적중은 엔진 자신의 tokenization으로 따로 정해집니다."
        steps={[
          { label: "갈리는 block", expression: "10번째 token은 0~63 사이", result: "block 0", reason: "첫 block의 내용 hash가 달라집니다." },
          { label: "사슬 전파", expression: "h1 = H(내용1, h0), h2 = H(내용2, h1), …", result: "block 0~4 hash가 모두 다름", reason: "뒤 block 내용이 같아도 앞 hash를 넣어 만들기 때문입니다." },
          { label: "예상 적중", expression: "일치 block 0개 × 64", result: "0 token", reason: "pod A가 실제로 256 token을 갖고 있어도 선택기는 모릅니다." },
        ]}
        conclusion="선택기가 엔진과 다른 token ID로 hash를 만들면 캐시가 있는 pod를 찾지 못합니다."
        caveats={["10번째 token에서 갈린다는 조건은 설명용 가정입니다.", "llm-d는 tokenizer 없이 길이를 어림하는 estimate backend를 기본으로 만들므로, 기본 설정의 예상은 처음부터 근사값입니다."]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          이 사슬 구조 때문에 tokenizer가 맞지 않으면 손해가 큽니다. 같은 문장을 선택기는 이전 tokenizer로, 엔진은 새 tokenizer로
          나누면 앞부분 어딘가에서 token ID가 갈립니다. 갈린 block부터 뒤의 hash가 모두 달라져 선택기는 캐시가 있는 pod를 찾지
          못하고, 요청은 대기열만 보고 흩어집니다.
        </p>
        <p>
          llm-d 문서는 token producer를 따로 두지 않으면 tokenizer 없이 길이를 어림하는 estimate backend를 자동으로 만든다고
          적습니다. 엔진과 같은 token ID로 hash하려면 vLLM의 render backend처럼 엔진의 tokenization을 쓰는 producer를 지정해야
          합니다. 선택기에 tokenizer를 따로 올린다면 그 버전을 모델 서버의 버전과 함께 배포하고 함께 바꿉니다.
        </p>
        <p>
          같은 어긋남이 token 계산 전체에 퍼집니다. 문 앞의 token 한도를 gateway의 tokenizer로 세고 과금은 엔진이 보고한 usage로
          세면 두 숫자가 계속 다릅니다. 그래서 한도 counter는{" "}
          <Link to="/cs/ai/rate-limiting-and-reliability-patterns#token-reservation">예약 뒤 정산</Link>으로 다루고, 과금은 엔진의
          usage를 기준으로 둡니다.
        </p>
        <p>
          호스팅 API도 같은 두 층을 공개합니다. OpenAI의 prompt caching 문서는 요청을 보낼 machine을 현재 부하와 처음 token들의
          hash, 사용자가 주는 prompt_cache_key로 고른다고 적습니다.
          </p>
          <p>
            캐시는 각 machine에 남아 있고, 같은 앞부분 요청이 분당 15건을
          넘으면 다른 machine으로 넘칠 수 있다고 적습니다. 캐시가 있는 곳으로 몰아 보내는 이득과 한 machine에 몰리는 부하가 맞서는
          지점을 숫자로 둔 셈입니다.
        </p>
        <p>
          정리하면 선택기에는 요청마다 한 번 내리는 결정만 둡니다. 어느 pod에 캐시가 있을지, 어느 pod가 덜 밀렸는지, 요청 길이가 어느
          묶음에 맞는지가 그 결정입니다. 다음 token을 누구에게 줄지는 엔진에 남깁니다. 두 층이 같은 token ID를 보도록 tokenizer를
          모델과 함께 고정합니다.
        </p>
      </div>

      <div id="paper-llm-d-prefix-hash" className="not-prose my-8 scroll-mt-24">
        <CitationBlock
          source="llm-d-router 907c5fe8 · approximateprefix/README.md · prefixhash/hashing.go (2026-10-13)"
          citeKey={2}
          href="https://github.com/llm-d/llm-d-router/blob/907c5fe84769a8f8e80ece112fd419dc6313453e/pkg/epp/framework/plugins/requestcontrol/dataproducer/prefixhash/hashing.go"
        >
          <q>Block i&apos;s hash is xxhash over its content hash and block i-1&apos;s hash</q> README는 token ID를 고정 크기
          block으로 hash하고, 기본·최소 block 크기가 64 token이며, scheduling 뒤 고른 endpoint를 index에 기록하고, token producer가
          없으면 tokenizer 없는 estimate backend를 자동으로 만든다고 설명합니다.
        </CitationBlock>
      </div>
      <div id="paper-openai-prompt-caching" className="not-prose my-8 scroll-mt-24">
        <CitationBlock
          source="OpenAI API docs · Prompt caching (2026-10-14 확인)"
          citeKey={3}
          href="https://developers.openai.com/api/docs/guides/prompt-caching"
        >
          <q>Cached states live on individual machines, where traffic above 15 requests per minute can lead to overflow routing.</q>{" "}
          같은 문서는 routing이 현재 machine 부하, 처음 token들의 hash, prompt_cache_key에 따른다고 설명합니다.
        </CitationBlock>
      </div>
    </section>
  );
}
