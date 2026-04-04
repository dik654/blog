import type { CodeRef } from '@/components/code/types';

export const yamuxCodeRefs: Record<string, CodeRef> = {
  'yamux-muxer': {
    path: 'muxers/yamux/src/lib.rs — Yamux StreamMuxer 구현',
    lang: 'rust',
    highlight: [1, 68],
    desc: 'Yamux 멀티플렉서는 하나의 TCP 위에 여러 스트림을 다중화합니다. 인바운드 스트림을 버퍼에 쌓아 백프레셔를 처리합니다.',
    code: `pub struct Muxer<C> {
    connection: Either<yamux012::Connection<C>, yamux013::Connection<C>>,
    /// Temporarily buffers inbound streams in case our node is
    /// performing backpressure on the remote.
    inbound_stream_buffer: VecDeque<Stream>,
    /// Waker to be called when new inbound streams are available.
    inbound_stream_waker: Option<Waker>,
}

/// How many streams to buffer before we start resetting them.
const MAX_BUFFERED_INBOUND_STREAMS: usize = 256;

impl<C> StreamMuxer for Muxer<C>
where
    C: AsyncRead + AsyncWrite + Unpin + 'static,
{
    type Substream = Stream;
    type Error = Error;

    fn poll_inbound(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
    ) -> Poll<Result<Self::Substream, Self::Error>> {
        if let Some(stream) = self.inbound_stream_buffer.pop_front() {
            return Poll::Ready(Ok(stream));
        }
        if let Poll::Ready(res) = self.poll_inner(cx) {
            return Poll::Ready(res);
        }
        self.inbound_stream_waker = Some(cx.waker().clone());
        Poll::Pending
    }

    fn poll_outbound(
        mut self: Pin<&mut Self>,
        cx: &mut Context<'_>,
    ) -> Poll<Result<Self::Substream, Self::Error>> {
        let stream = match self.connection.as_mut() {
            Either::Left(c) => ready!(c.poll_new_outbound(cx))
                .map_err(|e| Error(Either::Left(e)))
                .map(|s| Stream(Either::Left(s))),
            Either::Right(c) => ready!(c.poll_new_outbound(cx))
                .map_err(|e| Error(Either::Right(e)))
                .map(|s| Stream(Either::Right(s))),
        }?;
        Poll::Ready(Ok(stream))
    }

    fn poll(
        self: Pin<&mut Self>,
        cx: &mut Context<'_>,
    ) -> Poll<Result<StreamMuxerEvent, Self::Error>> {
        let this = self.get_mut();
        let inbound_stream = ready!(this.poll_inner(cx))?;

        if this.inbound_stream_buffer.len() >= MAX_BUFFERED_INBOUND_STREAMS {
            tracing::warn!(stream=%inbound_stream.0, "dropping stream because buffer is full");
            drop(inbound_stream);
        } else {
            this.inbound_stream_buffer.push_back(inbound_stream);
            if let Some(waker) = this.inbound_stream_waker.take() {
                waker.wake()
            }
        }
        // Schedule an immediate wake-up, allowing other code to run.
        cx.waker().wake_by_ref();
        Poll::Pending
    }
}`,
    annotations: [
      { lines: [5, 5], color: 'sky', note: '최대 256개 인바운드 스트림 버퍼' },
      { lines: [21, 32], color: 'emerald', note: '버퍼 먼저, 없으면 내부 폴링' },
      { lines: [34, 47], color: 'amber', note: 'poll_outbound — 새 아웃바운드 스트림 생성' },
      { lines: [49, 68], color: 'violet', note: '인바운드 스트림 버퍼링 + waker 관리' },
    ],
  },
};
