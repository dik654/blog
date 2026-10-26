import CrewAIViz from "./viz/CrewAIViz";
export default function CrewAI(){return <section id="crewai" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Crew와 Flow의 책임 나누기</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Crew의 역할에는 읽을 수 있는 입력, 호출할 수 있는 도구, 수정할 수 있는 결과물과 반환 형식이 포함됩니다. 단순한 성격 묘사만으로는
            실행 경계를 정할 수 없습니다.
          </p><p>
            작업의 기대 결과도 자연어 요청으로 끝내지 않습니다. 다음 작업이 안전하게 읽을 수 있도록 구조화된 형식과 검증기를 함께 둡니다.
          </p><p>
            Flow는 이벤트와 상태를 기준으로 일반 코드, Crew, 외부 서비스를 연결합니다. 재시도, 시간 초과, 사람 승인, 보상 처리는 Flow가 맡습니다.
          </p><p>
            자료 비교나 보고서 종합처럼 의미를 판단해야 하는 노드만 Crew로 호출합니다. 그러면 모델이 판단할 영역과 코드가 강제할 실행 순서를
            구분할 수 있습니다.
          </p></div><div className="not-prose my-8"><CrewAIViz /></div><div id="standard-crewai" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">공식 문서 · CrewAI 1.15.30 기준</p><p className="mt-2 text-sm leading-6 text-muted-foreground">
            2026년 10월 26일 버전이 고정된 공식 문서를 확인했습니다. Crew는 agent·task·process를 묶습니다. Flow는 event·state·분기와 Crew 호출을 연결합니다. Decorator·state·persistence API는 버전별로 달라질 수 있으므로 실제 실험에서는 1.15.30을 고정합니다. 이 글은 제품 간 성능 우위를 주장하지 않습니다.
          </p><div className="mt-3 flex flex-wrap gap-4 text-sm font-medium"><a className="text-primary hover:underline" href="https://docs.crewai.com/en/concepts/crews" target="_blank" rel="noreferrer">Crews 문서</a><a className="text-primary hover:underline" href="https://docs.crewai.com/en/concepts/flows" target="_blank" rel="noreferrer">Flows 문서</a></div></div></section>}
