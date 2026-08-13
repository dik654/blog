import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MIDDLEWARE_STACK } from "./MiddlewareData";

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
          expensive method abuse를 모두 다뤄야 한다. Public HTTP/WS와
          authenticated Engine endpoint는 허용 caller가 다르다.
        </p>
        <h3>문제</h3>
        <p>
          CORS는 browser origin policy이지 일반 client authentication이 아니다.
          Rate limit 하나만으로 request body, response size, concurrent
          execution과 range query를 모두 보호할 수도 없다. JWT도 bearer secret을
          읽거나 traffic을 탈취한 공격자에 대한 encryption을 제공하지 않는다.
        </p>
        <h3>아이디어와 구현</h3>
        <p>
          Listener bind address, enabled modules, host/origin checks,
          body/response limits, concurrency/timeout, JWT와 observability를
          겹친다. 비용이 큰 method는 global transport limit 외에도
          method-specific range와 result constraints를 가져야 한다.
        </p>
        <p>
          Engine auth는 consensus/execution clients가 공유한 256-bit secret으로
          HS256 token을 검증한다. Token freshness와 Authorization header를
          확인하되 endpoint는 private network boundary에 두고 secret file
          permissions와 rotation 운영을 별도로 관리한다.
        </p>
      </div>
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
            namespaces를 켜야 한다. 기본 port 예시는 배포 편의를 위한 값이지
            firewall·authentication policy가 아니다.
          </p>
        </div>
      </div>
    </section>
  );
}
