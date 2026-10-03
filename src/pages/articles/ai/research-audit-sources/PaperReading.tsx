import { CitationBlock } from "@/components/ui/citation";

type Props={id:string;title:string;href:string;problem:string;idea:string;assumption:string;experiment:string;boundary:string};
export default function PaperReading(p:Props){
  return <aside id={p.id} className="my-8 scroll-mt-24 border-l-2 border-sky-400 pl-5">
    <h3 className="mb-4 text-lg font-semibold">원 논문 읽기 · {p.title}</h3>
    <dl className="space-y-3 text-sm leading-7">
      {[["해결할 문제",p.problem],["새 아이디어",p.idea],["성립 전제",p.assumption],["실험 범위",p.experiment],["일반화 경계",p.boundary]].map(([k,v])=><div key={k}><dt className="font-semibold">{k}</dt><dd>{v}</dd></div>)}
    </dl>
    <CitationBlock source={p.title} citeKey={1} href={p.href}>원문과 공개 구현을 2026-10-04에 대조했습니다. 성능 수치는 별도 표시가 없으면 저자 자기보고입니다.</CitationBlock>
  </aside>;
}
