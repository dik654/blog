import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MIDDLEWARE_STACK } from "./MiddlewareData";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Middleware() {
  const [active, setActive] = useState(MIDDLEWARE_STACK[0].id);
  return (
    <section id="middleware" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Middleware: 노출 정책을 method 밖에서 강제하기
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3>배경</h3>
        <p>
          RPC server는 parsing 이전의 connection abuse와 parsing 이후의
          expensive method abuse를 모두 다뤄야 합니다. Public HTTP/WS와
          authenticated Engine endpoint는 허용 caller가 다릅니다.
        </p>
        <h3>문제</h3>
        <p>
          CORS는 browser origin policy이지 일반 client authentication이 아닙니다.
          Rate limit 하나만으로 request body, response size, concurrent
          execution과 range query를 모두 보호할 수도 없습니다. JWT도 bearer secret을
          읽거나 traffic을 탈취한 공격자에 대한 encryption을 제공하지 않습니다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          Listener bind address, enabled modules, host/origin checks,
          body/response limits, concurrency/timeout, JWT와 observability를
          겹칩니다. 비용이 큰 method는 global transport limit 외에도
          method-specific range와 result constraints를 가져야 합니다.
        </p>
        <p>
          Engine auth는 consensus/execution clients가 공유한 256-bit secret으로
          HS256 token을 검증합니다. Token freshness와 Authorization header를
          확인하되 endpoint는 private network boundary에 두고 secret file
          permissions와 rotation 운영을 별도로 관리합니다.
        </p>
      </div>
      <ExplainedFormula
        question="Burst 20개를 허용하면서 평균 초당 5개로 제한하려면 요청을 언제 받아야 할까?"
        idea="Token bucket은 시간에 따라 token을 보충하고 요청 cost만큼 차감합니다. Global bucket만 두지 않고 caller·method cost에 맞는 budget을 겹쳐 expensive query가 값싼 조회를 굶기지 않게 합니다."
        formula={String.raw`\begin{aligned}T'&=\min(C,T+r\Delta t)\\ \mathrm{allow}(q)&\iff T'\ge w_q\\ T_{\mathrm{next}}&=T'-w_q\end{aligned}`}
        terms={[
          { symbol: "T,T'", name: "Token balance", description: "보충 전후 남은 request-cost token입니다." },
          { symbol: "C", name: "Bucket capacity", description: "순간 burst 상한입니다. 예시는 20 token입니다." },
          { symbol: "r", name: "Refill rate", description: "초당 보충량입니다. 예시는 5 token/s입니다." },
          { symbol: "\\Delta t", name: "Elapsed time", description: "마지막 보충 이후 흐른 시간이며 단위는 second입니다." },
          { symbol: "w_q", name: "Request weight", description: "Method·range·body size에 따른 local policy cost입니다." },
        ]}
        assumptions={["Token accounting은 monotonic clock을 사용합니다.", "Capacity·refill·weight는 deployment policy이며 Ethereum protocol 상수가 아닙니다.", "허용 뒤에도 body·response·concurrency·timeout·auth 제한을 별도로 적용합니다."]}
        interpretation="Bucket이 비어도 2초 뒤 10 token이 보충되지만 capacity 20을 넘지 않습니다. 이 식은 평균 유입을 제한할 뿐, 단일 요청의 메모리 사용량이나 Engine endpoint 인증을 대신하지 않습니다."
      />
      <h3 className="mb-3 text-lg font-semibold">Policy layers</h3>
      <div className="not-prose mb-6 space-y-2">
        {MIDDLEWARE_STACK.map((item) => {
          const open = active === item.id;
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              animate={{ opacity: open ? 1 : 0.6 }}
              className="block w-full cursor-pointer rounded-xl border p-4 text-left"
            >
              <p
                className="text-sm font-semibold"
                style={{ color: item.color }}
              >
                {item.name}
                <span className="ml-2 text-xs font-normal text-foreground/45">
                  {item.target}
                </span>
              </p>
              <AnimatePresence>
                {open && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-sm leading-6 text-foreground/70"
                  >
                    {item.desc}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="rounded-r-lg border-l-4 border-amber-400 bg-amber-50 p-4 dark:bg-amber-950/30">
          <p className="font-semibold">운영 원칙</p>
          <p className="mt-2">
            일반 RPC도 Reth에서 기본 공개되는 것이 아니며 명시적으로 listener와
            namespaces를 켜야 합니다. 기본 port 예시는 배포 편의를 위한 값이지
            firewall·authentication policy가 아닙니다.
          </p>
        </div>
      </div>
    </section>
  );
}
