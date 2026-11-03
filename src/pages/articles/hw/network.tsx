import Overview from "./network/Overview";
import Ethernet from "./network/Ethernet";
import HardwareFieldLab from "./HardwareFieldLab";
import HardwareTeachOpening, { HardwareTeachMechanism } from "./HardwareTeachOpening";
import { networkFieldLab } from "./hardwareFieldLabs";
import { hardwareTeachCases } from "./hardwareTeachCases";

export default function NetworkArticle() {
  return (
    <>
      <p className="mb-10 border-l-2 border-primary pl-4 text-lg font-semibold leading-8 text-foreground">
        한 문장 답: 서버 네트워크는 가장 큰 포트 숫자가 아니라, 실제 traffic이
        정상과 장애 상태의 경로를 지난 뒤 payload를 약속한 p99 안에 끝내는지로
        고릅니다.
      </p>
      <HardwareTeachOpening data={hardwareTeachCases.network} />
      <HardwareTeachMechanism data={hardwareTeachCases.network}>
        <Overview />
        <Ethernet />
      </HardwareTeachMechanism>
      <HardwareFieldLab data={networkFieldLab} />
    </>
  );
}
