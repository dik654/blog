import CrewAIViz from "./viz/CrewAIViz";
export default function CrewAI(){return <section id="crewai" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">CrewAI에서는 Crew가 의미 판단을 맡고 Flow가 state·event·transition과 실패 경로를 강제하도록 나눕니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p>
            Crew의 role은 읽을 수 있는 input, 호출 가능한 tool, 수정 가능한 artifact와 반환 schema를 뜻합니다. 성격 묘사로 채우면 그 역할을 하지
            못합니다. Task의 expected output도 자연어 희망사항에 그치지 않고 structured schema와 validator로 이어져야 다음 task가 안전하게 소비할
            수 있습니다.
          </p><p>
            Flow는 event와 state를 중심으로 일반 코드·Crew·외부 service를 연결합니다. Retry·timeout·사람 승인·compensation 같은 비즈니스
            제어는 Flow에 두고 source 비교나 report synthesis처럼 의미 판단이 필요한 node만 Crew로 호출하면 자율성과 결정적 제어를 분리할 수 있습니다.
          </p></div><div className="not-prose my-8"><CrewAIViz /></div><div id="standard-crewai" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"><p className="text-xs font-bold text-primary">공식 문서 · CrewAI Crews & Flows</p><p className="mt-2 text-sm leading-6 text-muted-foreground">
            현재 CrewAI 문서는 agent·task·process를 묶는 Crew와 event·state·routing 중심 Flow를 별도 계층으로 제공합니다. Version별
            decorator·state·persistence API가 달라질 수 있으므로 설치 version을 pin합니다. 이 글은 제품 간 성능 우위를 주장하지 않습니다.
          </p><div className="mt-3 flex flex-wrap gap-4 text-sm font-medium"><a className="text-primary hover:underline" href="https://docs.crewai.com/en/concepts/crews" target="_blank" rel="noreferrer">Crews 문서</a><a className="text-primary hover:underline" href="https://docs.crewai.com/en/concepts/flows" target="_blank" rel="noreferrer">Flows 문서</a></div></div></section>}
