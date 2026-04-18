import SimpleStepViz from '@/components/viz/SimpleStepViz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  { label: 'XML 출력 파싱 4가지 전략 + Robust 파서', body: '① Regex: re.search(f"<{tag}>(.*?)</{tag}>", text) — 간단, 빠름\n② xml.etree: ET.fromstring(f"<root>{response}</root>") — 표준 파서\n③ BeautifulSoup: BeautifulSoup(response, "xml") — 관대한 파싱\n④ lxml: etree.xpath("//answer/text()") — 고속\n\nRobust parser: lxml → BeautifulSoup → regex (fallback chain)\n\n에러 처리: malformed XML, unescaped chars, truncated response\n해결: try-except + 더 엄격한 prompt retry + 관대한 파서 fallback\n\n프롬프트 팁: LLM에게 정확한 태그 지정 + 예시 + required fields\nStreaming: SAX parser, incremental parsing 가능' },
];

const visuals = [
  { title: '파싱 전략 4가지 + Fallback', color: '#6366f1', rows: [
    { label: '① Regex', value: '간단, 빠름 — 단순 추출' },
    { label: '② xml.etree', value: '표준 XML 파서 — 구조적' },
    { label: '③ BeautifulSoup', value: '관대한 파싱 — 깨진 XML 허용' },
    { label: '④ lxml', value: '고속 — XPath 지원' },
    { label: 'Robust', value: 'lxml → BS4 → regex (fallback chain)' },
    { label: 'Streaming', value: 'SAX parser, incremental 파싱 가능' },
  ]},
];

export default function ParsingDetailViz() {
  return <SimpleStepViz steps={steps} visuals={visuals} />;
}
