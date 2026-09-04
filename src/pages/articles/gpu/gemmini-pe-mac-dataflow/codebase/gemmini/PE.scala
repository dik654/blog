// gemmini/PE.scala — MacUnit·PE (UC Berkeley Gemmini, commit 참조: ucb-bar/gemmini @ main,
// 2026-09 clone 기준). systolic array 한 칸의 전체 정의입니다.
// 본문 대응: MacUnit이 mac-unit 절의 "곱셈+누산 한 사이클" 원자 연산, PE의 when(df==OS)/
// when(df==WS) 분기가 dataflow 절의 Output-/Weight-Stationary, c1·c2 레지스터와
// flip·shift_offset이 double-buffer 절의 이중 버퍼링에 대응합니다.
// See README.md for license details.
package gemmini

import chisel3._
import chisel3.util._

class PEControl[T <: Data : Arithmetic](accType: T) extends Bundle {
  val dataflow = UInt(1.W)  // 0=OS, 1=WS — article의 dataflow 스위치 그 자체
  val propagate = UInt(1.W) // article의 compute/propagate 플래그 — 어느 레지스터를 흘려보낼지
  val shift = UInt(log2Up(accType.getWidth).W)
}

// article의 "MAC 하나 = 원자 연산" — mac() 한 줄이 곱셈과 누산을 같은 사이클에 묶는다.
// PE가 WS/OS 두 dataflow를 모두 지원해도 회로 합성 도구가 MAC을 중복 생성하지 않도록
// 이 module 하나로 강제 재사용한다(원문 주석 참고).
class MacUnit[T <: Data](inputType: T, weightType: T, cType: T, dType: T) (implicit ev: Arithmetic[T]) extends Module {
  import ev._
  val io = IO(new Bundle {
    val in_a  = Input(inputType)   // activation
    val in_b  = Input(weightType)  // weight (WS) 또는 활성 자체(OS 분기에서 재사용)
    val in_c  = Input(cType)       // 누적 중인 partial sum
    val out_d = Output(dType)      // article의 "누산 결과"
  })

  io.out_d := io.in_c.mac(io.in_a, io.in_b) // article의 MAC: out = in_c + in_a * in_b
}

/**
  * A PE implementing a MAC operation. Configured as fully combinational when integrated into a Mesh.
  */
class PE[T <: Data](inputType: T, weightType: T, outputType: T, accType: T, df: Dataflow.Value, max_simultaneous_matmuls: Int)
                   (implicit ev: Arithmetic[T]) extends Module {
  import ev._

  val io = IO(new Bundle {
    val in_a = Input(inputType)   // 왼쪽 PE에서 넘어오는 activation
    val in_b = Input(outputType)  // 위쪽 PE에서 넘어오는 weight 또는 partial sum
    val in_d = Input(outputType)  // 새 값을 밀어 넣을 때 쓰는 입력(propagate 시 c1/c2에 적재)
    val out_a = Output(inputType) // 오른쪽 PE로 activation을 그대로 흘려보냄(systolic 전파)
    val out_b = Output(outputType)
    val out_c = Output(outputType)

    val in_control = Input(new PEControl(accType))
    val out_control = Output(new PEControl(accType))

    val in_id = Input(UInt(log2Up(max_simultaneous_matmuls).W))
    val out_id = Output(UInt(log2Up(max_simultaneous_matmuls).W))

    val in_last = Input(Bool())
    val out_last = Output(Bool())

    val in_valid = Input(Bool())
    val out_valid = Output(Bool())

    val bad_dataflow = Output(Bool())
  })

  val cType = if (df == Dataflow.WS) inputType else accType

  // article의 "MAC은 하나만" — WS·OS 두 분기가 같은 mac_unit을 공유해 합성 시
  // 곱셈기가 중복 생성되지 않게 한다.
  val mac_unit = Module(new MacUnit(inputType, weightType,
    if (df == Dataflow.WS) outputType else accType, outputType))

  val a  = io.in_a
  val b  = io.in_b
  val d  = io.in_d
  val c1 = Reg(cType) // article의 이중 버퍼 레지스터 1번
  val c2 = Reg(cType) // article의 이중 버퍼 레지스터 2번
  val dataflow = io.in_control.dataflow
  val prop  = io.in_control.propagate
  val shift = io.in_control.shift
  val id = io.in_id
  val last = io.in_last
  val valid = io.in_valid

  io.out_a := a
  io.out_control.dataflow := dataflow
  io.out_control.propagate := prop
  io.out_control.shift := shift
  io.out_id := id
  io.out_last := last
  io.out_valid := valid

  mac_unit.io.in_a := a

  // article의 flip — 직전 사이클의 propagate 값과 지금 값이 다르면 "역할이 막 뒤집힌
  // 첫 사이클"이라는 뜻이고, 그 사이클에만 shift(반올림 자리수)를 적용해 출력한다.
  val last_s = RegEnable(prop, valid)
  val flip = last_s =/= prop
  val shift_offset = Mux(flip, shift, 0.U)

  val OUTPUT_STATIONARY = Dataflow.OS.id.U(1.W)
  val WEIGHT_STATIONARY = Dataflow.WS.id.U(1.W)

  val COMPUTE = 0.U(1.W)
  val PROPAGATE = 1.U(1.W)

  io.bad_dataflow := false.B
  // article의 Output-Stationary 분기 — partial sum(c1/c2)이 이 PE에 고정되고
  // weight(b)와 activation(a)이 매 사이클 흘러 지나가며 c1/c2 위에 누적된다.
  when ((df == Dataflow.OS).B || ((df == Dataflow.BOTH).B && dataflow === OUTPUT_STATIONARY)) {
    when(prop === PROPAGATE) {
      // article의 "흘려보내는 레지스터" — c1을 out_c로 내보내는 동안
      io.out_c := (c1 >> shift_offset).clippedToWidthOf(outputType)
      io.out_b := b
      mac_unit.io.in_b := b.asTypeOf(weightType)
      mac_unit.io.in_c := c2 // article의 "누적 중인 레지스터" — c2 위에서 계속 mac
      c2 := mac_unit.io.out_d
      c1 := d.withWidthOf(cType) // 다음 행렬곱의 초기값을 c1에 미리 적재
    }.otherwise {
      io.out_c := (c2 >> shift_offset).clippedToWidthOf(outputType)
      io.out_b := b
      mac_unit.io.in_b := b.asTypeOf(weightType)
      mac_unit.io.in_c := c1
      c1 := mac_unit.io.out_d
      c2 := d.withWidthOf(cType)
    }
  // article의 Weight-Stationary 분기 — weight(c1 또는 c2에 미리 적재된 값)가 이 PE에
  // 고정되고 activation(b)이 흘러 지나가며 즉시 mac 결과를 다음 PE로 내보낸다.
  }.elsewhen ((df == Dataflow.WS).B || ((df == Dataflow.BOTH).B && dataflow === WEIGHT_STATIONARY)) {
    when(prop === PROPAGATE) {
      io.out_c := c1
      mac_unit.io.in_b := c2.asTypeOf(weightType) // article의 "고정된 weight"
      mac_unit.io.in_c := b                       // article의 "흘러 지나가는 activation"
      io.out_b := mac_unit.io.out_d                // 결과를 즉시 다음 PE로 전달(누적 대기 없음)
      c1 := d // 새 weight를 미리 적재
    }.otherwise {
      io.out_c := c2
      mac_unit.io.in_b := c1.asTypeOf(weightType)
      mac_unit.io.in_c := b
      io.out_b := mac_unit.io.out_d
      c2 := d
    }
  }.otherwise {
    io.bad_dataflow := true.B
    io.out_c := DontCare
    io.out_b := DontCare
    mac_unit.io.in_b := b.asTypeOf(weightType)
    mac_unit.io.in_c := c2
  }

  when (!valid) { // article의 "valid가 꺼지면 아무 것도 갱신하지 않는다" — 파이프라인 거품 보존
    c1 := c1
    c2 := c2
    mac_unit.io.in_b := DontCare
    mac_unit.io.in_c := DontCare
  }
}
