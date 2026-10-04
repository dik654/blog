import ByzantineModelViz from "./viz/ByzantineModelViz";
export default function ByzantineModel(){return <section id="byzantine-model" data-teach-level="4" className="space-y-5 [&_p]:leading-8"><h2 className="text-2xl font-bold">7. 주문 7의 표를 발신자와 대상에 맞춰 셉니다</h2>
<p>D가 A에게 <code>vote(7, X)</code>, C에게 <code>vote(7, Y)</code>를 보냅니다. 둘 다 D가 실제로 서명했을 수 있습니다. 서명 검증은 누가 어떤 바이트에 서명했는지 확인할 뿐 그 사람이 거짓말하지 않는다는 증명은 아닙니다.</p>
<ByzantineModelViz />
<p>A는 받은 표가 현재 참여자 명단에 있는 사람의 것인지, 주문 7과 현재 단계·진행 차수에 해당하는지 확인합니다. 후보 내용 자체도 서비스 규칙에 맞아야 합니다. 같은 D의 표를 여러 경로로 받았으면 한 번만 셉니다. 이 과정을 거쳐 X의 서명자 집합이 A·B·D가 되었다고 놓습니다.</p>
<p>Y가 B·C·D를 모으려면 B가 필요합니다. B가 같은 문맥에서 모순된 표를 내지 않는다면 D 혼자 두 후보를 통과시킬 수 없습니다. 다만 서로 다른 단계의 서명을 한 종류로 섞거나 대표 교체 뒤 잠금을 무조건 지우면 이 전제가 사라집니다. 표의 숫자와 표를 발행하는 규칙을 함께 보아야 합니다.</p>
<p>가정한 통신 모델에서는 어느 시점 뒤 메시지 지연이 유한한 상한 안으로 들어오지만 그 시점을 참여자가 미리 알지 못합니다. 이를 부분 동기성이라고 합니다. 그 이전에도 서로 모순된 결정을 막아야 하며 진행은 늦어질 수 있습니다. 네 사람의 예에서 필요한 표 수를 일반식으로 만들어 보겠습니다.</p>
</section>}
