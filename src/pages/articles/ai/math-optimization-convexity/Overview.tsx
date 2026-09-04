import OptimizationContractViz from "./viz/OptimizationContractViz";

export default function Overview(){return <section id="overview" className="mb-16 scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">Optimization은 가장 낮은 곳을 찾는 일이고, gradient descent는 그중 한 방법이다</h2><div className="prose prose-neutral dark:prose-invert max-w-none"><p className="text-lg leading-8">
            미분은 현재 위치에서 어느 방향으로 값이 커지는지 알려주지만 어디까지 움직여야 하는지, 결국 어디에 도착하는지까지는 말해주지 않습니다. Optimization은
            objective·허용 영역·algorithm·stopping criterion을 함께 정하는 문제입니다.
          </p><p>
            이 글은 convexity, gradient descent, learning rate, smoothness, convergence guarantee의 연결을 작은
            quadratic 예제로 설명합니다. 딥러닝 loss는 일반적으로 nonconvex이므로 convex theorem을 그대로 성능 보증으로 가져오지 않는 경계도 함께 다룹니다.
          </p></div><OptimizationContractViz/></section>}
