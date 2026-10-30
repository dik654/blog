import type { CodeRef } from "@/components/code/types";

const source = "CometBFT v0.40.0 · commit 0880b4d378f347ab16e54ec677ff50d803f37d62";
const excerpt = `${source}에서 긴 로그·오류 문구와 주변 분기를 생략한 제어 흐름 발췌입니다.`;

export const officialCometBFTP2PCodeRefs: Record<string, CodeRef> = {
  "channel-owner": {
    path: "p2p/switch.go · AddReactor @ 0880b4d3",
    lang: "go",
    highlight: [1, 18],
    desc: `${excerpt} ChannelDescriptor의 ID와 message type을 Reactor 한 곳에 연결합니다.`,
    code: `func (sw *Switch) AddReactor(name string, reactor Reactor) Reactor {
    for _, chDesc := range reactor.GetChannels() {
        chID := chDesc.ID
        // No two reactors can share the same channel.
        if sw.reactorsByCh[chID] != nil {
            panic(fmt.Sprintf(
                "Channel %X has multiple reactors %v & %v",
                chID, sw.reactorsByCh[chID], reactor,
            ))
        }
        sw.chDescs = append(sw.chDescs, chDesc)
        sw.reactorsByCh[chID] = reactor
        sw.msgTypeByChID[chID] = chDesc.MessageType
    }
    sw.reactors[name] = reactor
    reactor.SetSwitch(sw)
    return reactor
}`,
    annotations: [
      { lines: [2, 10], color: "rose", note: "같은 channel ID를 두 Reactor가 소유하면 bytes의 해석자가 모호해지므로 시작 단계에서 중단합니다." },
      { lines: [11, 13], color: "sky", note: "Descriptor, Reactor owner와 protobuf message type을 같은 ID에 연결합니다." },
      { lines: [15, 17], color: "emerald", note: "이름으로도 Reactor를 보관하고 Switch reference를 주입합니다." },
    ],
  },
  "transport-handshake": {
    path: "p2p/transport.go · upgrade/handshake @ 0880b4d3",
    lang: "go",
    highlight: [1, 69],
    desc: `${excerpt} TCP 연결을 authenticated SecretConnection으로 올리고 NodeInfo와 peer ID를 대조합니다.`,
    code: `func (mt *MultiplexTransport) upgrade(
    c net.Conn,
    dialedAddr *NetAddress,
) (secretConn *conn.SecretConnection, nodeInfo NodeInfo, err error) {
    secretConn, err = upgradeSecretConn(
        c, mt.handshakeTimeout, mt.nodeKey.PrivKey,
    )
    if err != nil {
        return nil, nil, err
    }

    connID := PubKeyToID(secretConn.RemotePubKey())
    if dialedAddr != nil && connID != dialedAddr.ID {
        return nil, nil, ErrRejected{isAuthFailure: true}
    }

    nodeInfo, err = handshake(secretConn, mt.handshakeTimeout, mt.nodeInfo)
    if err != nil {
        return nil, nil, err
    }
    if err := nodeInfo.Validate(); err != nil {
        return nil, nil, ErrRejected{isNodeInfoInvalid: true}
    }
    if connID != nodeInfo.ID() {
        return nil, nil, ErrRejected{isAuthFailure: true}
    }
    if mt.nodeInfo.ID() == nodeInfo.ID() {
        return nil, nil, ErrRejected{isSelf: true}
    }
    if err := mt.nodeInfo.CompatibleWith(nodeInfo); err != nil {
        return nil, nil, ErrRejected{isIncompatible: true}
    }
    return secretConn, nodeInfo, nil
}

func handshake(
    c net.Conn,
    timeout time.Duration,
    nodeInfo NodeInfo,
) (NodeInfo, error) {
    if err := c.SetDeadline(time.Now().Add(timeout)); err != nil {
        return nil, err
    }

    errc := make(chan error, 2)
    var pbpeerNodeInfo tmp2p.DefaultNodeInfo
    ourNodeInfo := nodeInfo.(DefaultNodeInfo)

    go func() {
        _, err := protoio.NewDelimitedWriter(c).WriteMsg(ourNodeInfo.ToProto())
        errc <- err
    }()
    go func() {
        reader := protoio.NewDelimitedReader(c, MaxNodeInfoSize())
        _, err := reader.ReadMsg(&pbpeerNodeInfo)
        errc <- err
    }()
    for i := 0; i < cap(errc); i++ {
        if err := <-errc; err != nil {
            return nil, err
        }
    }

    peerNodeInfo, err := DefaultNodeInfoFromToProto(&pbpeerNodeInfo)
    if err != nil {
        return nil, err
    }
    return peerNodeInfo, c.SetDeadline(time.Time{})
}`,
    annotations: [
      { lines: [5, 15], color: "sky", note: "SecretConnection이 remote public key를 인증하고 outbound dial 대상 ID와 대조합니다." },
      { lines: [17, 32], color: "rose", note: "NodeInfo의 형식·인증 ID·self connection·network compatibility가 틀리면 peer를 만들지 않습니다." },
      { lines: [41, 47], color: "amber", note: "Handshake timeout을 걸고 양쪽 NodeInfo 교환에 사용할 상태를 준비합니다." },
      { lines: [49, 68], color: "emerald", note: "Write와 read를 동시에 수행하고 remote NodeInfo를 decode한 뒤 deadline을 해제합니다. Transaction 검증은 아직 하지 않습니다." },
    ],
  },
  "send-queue": {
    path: "p2p/peer.go · peer.send / p2p/conn/connection.go · Send @ 0880b4d3",
    lang: "go",
    highlight: [1, 51],
    desc: `${excerpt} Envelope를 marshal한 뒤 channel의 bounded queue에 넣으며 true의 범위를 local admission으로 제한합니다.`,
    code: `func (p *peer) Send(e Envelope) bool {
    return p.send(e.ChannelID, e.Message, p.mconn.Send)
}

func (p *peer) send(
    chID byte,
    msg proto.Message,
    sendFunc func(byte, []byte) bool,
) bool {
    if !p.IsRunning() {
        return false
    } else if !p.hasChannel(chID) {
        return false
    }
    if w, ok := msg.(Wrapper); ok {
        msg = w.Wrap()
    }
    msgBytes, err := proto.Marshal(msg)
    if err != nil {
        return false
    }
    return sendFunc(chID, msgBytes)
}

func (c *MConnection) Send(chID byte, msgBytes []byte) bool {
    if !c.IsRunning() {
        return false
    }
    channel, ok := c.channelsIdx[chID]
    if !ok {
        return false
    }
    success := channel.sendBytes(msgBytes)
    if success {
        select {
        case c.send <- struct{}{}:
        default:
        }
    }
    return success
}

func (ch *Channel) sendBytes(bytes []byte) bool {
    select {
    case ch.sendQueue <- bytes:
        atomic.AddInt32(&ch.sendQueueSize, 1)
        return true
    case <-time.After(defaultSendTimeout):
        return false
    }
}`,
    annotations: [
      { lines: [10, 21], color: "sky", note: "Peer가 실행 중이고 상대가 channel을 지원할 때만 wrapper와 protobuf marshal을 거칩니다." },
      { lines: [24, 39], color: "emerald", note: "MConnection은 ID별 queue를 찾아 enqueue 뒤 sendRoutine을 깨웁니다." },
      { lines: [42, 49], color: "amber", note: "Queue admission은 timeout이 있으며 true여도 socket write나 remote 처리 성공은 아닙니다." },
    ],
  },
  "schedule-packet": {
    path: "p2p/conn/connection.go · selectChannelToGossipOn/Channel.updateNextPacket @ 0880b4d3",
    lang: "go",
    highlight: [1, 51],
    desc: `${excerpt} Pending channel을 normalized sent bytes로 고르고 큰 message를 PacketMsg로 나눕니다.`,
    code: `func selectChannelToGossipOn(channels []*Channel) *Channel {
    var leastRatio float32 = math.MaxFloat32
    var leastChannel *Channel
    for _, channel := range channels {
        if !channel.isSendPending() {
            continue
        }
        ratio := float32(channel.recentlySent) /
            float32(channel.desc.Priority)
        if ratio < leastRatio {
            leastRatio = ratio
            leastChannel = channel
        }
    }
    return leastChannel
}

func (ch *Channel) updateNextPacket() {
    maxSize := ch.maxPacketMsgPayloadSize
    if len(ch.sending) <= maxSize {
        ch.nextPacketMsg.Data = ch.sending
        ch.nextPacketMsg.EOF = true
        ch.sending = nil
        atomic.AddInt32(&ch.sendQueueSize, -1)
    } else {
        ch.nextPacketMsg.Data = ch.sending[:maxSize]
        ch.nextPacketMsg.EOF = false
        ch.sending = ch.sending[maxSize:]
    }
    ch.nextP2pWrapperPacketMsg.PacketMsg = ch.nextPacketMsg
    ch.nextPacket.Sum = ch.nextP2pWrapperPacketMsg
}

func (ch *Channel) writePacketMsgTo(
    w protoio.Writer,
) (n int, err error) {
    ch.updateNextPacket()
    n, err = w.WriteMsg(ch.nextPacket)
    if err != nil {
        return 0, err
    }
    atomic.AddInt64(&ch.recentlySent, int64(n))
    return n, nil
}

func (ch *Channel) updateStats() {
    atomic.StoreInt64(
        &ch.recentlySent,
        int64(float64(atomic.LoadInt64(&ch.recentlySent))*0.8),
    )
}`,
    annotations: [
      { lines: [4, 14], color: "sky", note: "Pending queue만 대상으로 recentlySent/priority가 가장 작은 channel을 선택합니다." },
      { lines: [18, 30], color: "amber", note: "Payload ceiling 안이면 EOF=true로 끝내고, 크면 EOF=false 조각과 남은 bytes로 나눕니다." },
      { lines: [33, 43], color: "emerald", note: "실제 framing bytes를 recentlySent에 더해 다음 선택 비용을 높입니다." },
      { lines: [45, 51], color: "violet", note: "주기적으로 0.8을 곱해 오래된 전송량의 영향은 줄입니다." },
    ],
  },
  "receive-dispatch": {
    path: "p2p/conn/connection.go · recvRoutine / p2p/peer.go · createMConnection @ 0880b4d3",
    lang: "go",
    highlight: [1, 68],
    desc: `${excerpt} PacketMsg를 channel별로 재조립하고 filter·decode·unwrap 뒤 같은 recvRoutine에서 Reactor.Receive를 호출합니다.`,
    code: `// recvRoutine PacketMsg branch
case *tmp2p.Packet_PacketMsg:
    channelID := byte(pkt.PacketMsg.ChannelID)
    channel, ok := c.channelsIdx[channelID]
    if pkt.PacketMsg.ChannelID < 0 ||
        pkt.PacketMsg.ChannelID > math.MaxUint8 ||
        !ok || channel == nil {
        c.stopForError(fmt.Errorf("unknown channel"))
        break FOR_LOOP
    }

    msgBytes, err := channel.recvPacketMsg(*pkt.PacketMsg)
    if err != nil {
        c.stopForError(err)
        break FOR_LOOP
    }
    if msgBytes != nil {
        // Reactor.Receive runs in the same goroutine as recvRoutine.
        c.onReceive(channelID, msgBytes)
    }

// createMConnection callback
onReceive := func(chID byte, msgBytes []byte) {
    reactor := reactorsByCh[chID]
    if reactor == nil {
        panic(fmt.Sprintf("Unknown channel %X", chID))
    }

    if f, ok := reactor.(MsgBytesFilter); ok {
        if err := f.FilterMsgBytes(chID, p, msgBytes); err != nil {
            panic(fmt.Errorf("rejected msg: %w", err))
        }
    }

    mt := msgTypeByChID[chID]
    msg := proto.Clone(mt)
    if err := proto.Unmarshal(msgBytes, msg); err != nil {
        panic(fmt.Errorf("unmarshaling message: %w", err))
    }
    if w, ok := msg.(Unwrapper); ok {
        msg, err = w.Unwrap()
        if err != nil {
            panic(fmt.Errorf("unwrapping message: %w", err))
        }
    }
    reactor.Receive(Envelope{
        ChannelID: chID,
        Src:       p,
        Message:   msg,
    })
}

func (ch *Channel) recvPacketMsg(
    packet tmp2p.PacketMsg,
) ([]byte, error) {
    recvCap := ch.desc.RecvMessageCapacity
    recvReceived := len(ch.recving) + len(packet.Data)
    if recvCap < recvReceived {
        return nil, fmt.Errorf("message exceeds capacity")
    }
    ch.recving = append(ch.recving, packet.Data...)
    if packet.EOF {
        msgBytes := ch.recving
        ch.recving = ch.recving[:0]
        return msgBytes, nil
    }
    return nil, nil
}`,
    annotations: [
      { lines: [2, 19], color: "sky", note: "Unknown channel과 oversize message는 connection 오류가 되고 EOF가 와야 완성 bytes를 넘깁니다." },
      { lines: [22, 32], color: "rose", note: "Reactor의 raw-byte filter가 unmarshal 전에 payload 크기와 구조를 거절할 수 있습니다." },
      { lines: [34, 49], color: "emerald", note: "등록된 message prototype으로 decode·unwrap한 뒤 source peer를 보존한 Envelope를 전달합니다." },
      { lines: [52, 68], color: "amber", note: "Channel별 receive capacity를 넘지 않는 조각만 누적하고 EOF에서 buffer를 비웁니다." },
    ],
  },
  "mempool-receive": {
    path: "mempool/reactor.go · GetChannels/Receive @ 0880b4d3",
    lang: "go",
    highlight: [1, 54],
    desc: `${excerpt} Mempool channel 0x30을 선언하고 수신된 transaction마다 sender context를 붙여 CheckTx를 호출합니다.`,
    code: `func (memR *Reactor) GetChannels() []*p2p.ChannelDescriptor {
    largestTx := make([]byte, memR.config.MaxTxBytes)
    batchMsg := protomem.Message{
        Sum: &protomem.Message_Txs{
            Txs: &protomem.Txs{Txs: [][]byte{largestTx}},
        },
    }
    return []*p2p.ChannelDescriptor{
        {
            ID:                  MempoolChannel,
            Priority:            5,
            RecvMessageCapacity: batchMsg.Size(),
            MessageType:         &protomem.Message{},
        },
    }
}

func (memR *Reactor) Receive(e p2p.Envelope) {
    switch msg := e.Message.(type) {
    case *protomem.Txs:
        if memR.WaitSync() {
            return
        }
        protoTxs := msg.GetTxs()
        if len(protoTxs) == 0 {
            return
        }
        txInfo := TxInfo{SenderID: memR.ids.GetForPeer(e.Src)}
        if e.Src != nil {
            txInfo.SenderP2PID = e.Src.ID()
        }

        for _, tx := range protoTxs {
            ntx := types.Tx(tx)
            err := memR.mempool.CheckTx(ntx, nil, txInfo)
            if err != nil {
                switch {
                case errors.Is(err, ErrTxInCache):
                    memR.Logger.Debug("Tx already exists in cache")
                case errors.As(err, &ErrMempoolIsFull{}):
                    memR.Logger.Debug(err.Error())
                default:
                    memR.Logger.Info("Could not check tx", "err", err)
                }
            }
        }
    default:
        memR.Switch.StopPeerForError(
            e.Src,
            fmt.Errorf("mempool cannot handle message type: %T", e.Message),
        )
        return
    }
}`,
    annotations: [
      { lines: [1, 16], color: "sky", note: "Mempool Reactor가 ID, priority, 최대 receive size와 protobuf wrapper type을 선언합니다." },
      { lines: [19, 32], color: "amber", note: "Sync 중에는 무시하고 빈 batch를 거절한 뒤 source peer를 TxInfo에 기록합니다." },
      { lines: [34, 47], color: "emerald", note: "각 transaction은 여기서 CheckTx admission을 거치며 cache/full/기타 오류를 구분합니다." },
      { lines: [47, 53], color: "rose", note: "등록된 channel에 전혀 다른 message type이 오면 protocol error로 peer를 중지합니다." },
    ],
  },
  "peer-lifecycle": {
    path: "p2p/switch.go · addPeer @ 0880b4d3",
    lang: "go",
    highlight: [1, 29],
    desc: `${excerpt} Peer를 filter한 뒤 Reactor state를 초기화하고 MConnection을 시작한 다음 PeerSet과 Reactor에 차례로 공개합니다.`,
    code: `func (sw *Switch) addPeer(p Peer) error {
    if err := sw.filterPeer(p); err != nil {
        return err
    }
    p.SetLogger(sw.Logger.With("peer", p.SocketAddr()))
    if !sw.IsRunning() {
        return nil
    }

    for _, reactor := range sw.reactors {
        p = reactor.InitPeer(p)
    }

    // Start send/recv routines before adding the peer to PeerSet.
    if err := p.Start(); err != nil {
        return err
    }

    // Add before Reactor.AddPeer so Receive errors can find and remove it.
    if err := sw.peers.Add(p); err != nil {
        return err
    }
    sw.metrics.Peers.Add(float64(1))

    for _, reactor := range sw.reactors {
        reactor.AddPeer(p)
    }
    return nil
}`,
    annotations: [
      { lines: [2, 8], color: "rose", note: "중복·정책 filter를 먼저 적용하고 Switch가 중지 중이면 새 peer를 시작하지 않습니다." },
      { lines: [10, 16], color: "sky", note: "Reactor별 peer state를 준비한 뒤 MConnection의 send/recv routine을 먼저 시작합니다." },
      { lines: [18, 23], color: "emerald", note: "Receive 오류가 나도 lookup·remove할 수 있도록 PeerSet에 먼저 공개합니다." },
      { lines: [25, 27], color: "amber", note: "마지막으로 각 Reactor가 peer별 gossip goroutine 같은 protocol lifecycle을 시작합니다." },
    ],
  },
};
