import type { CodeRef } from '@/components/code/types';

export const indexerRefs: Record<string, CodeRef> = {
  'dx-module-lifecycle': {
    path: 'protocol/app/app.go',
    lang: 'go',
    highlight: [1, 18],
    desc: 'dYdX App — 17개 모듈의 BeginBlocker/EndBlocker 순서.',
    code: `// app/app.go — 블록 생명주기

// BeginBlocker: blocktime → authz → epochs → prices → assets
// EndBlocker: clob → perpetuals → blocktime
// Genesis: epochs → auth → bank → ... → clob (마지막)

func (app *App) BeginBlocker(ctx sdk.Context) {
    app.blocktime.BeginBlocker(ctx)
    app.epochs.BeginBlocker(ctx)
    app.prices.BeginBlocker(ctx)
}

func (app *App) EndBlocker(ctx sdk.Context) {
    app.clob.EndBlocker(ctx)
    app.perpetuals.EndBlocker(ctx)
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'Begin/End/Genesis 순서' },
      { lines: [7, 11], color: 'emerald', note: 'BeginBlocker' },
      { lines: [13, 16], color: 'amber', note: 'EndBlocker' },
    ],
  },

  'dx-indexer-ender': {
    path: 'indexer/services/ender/ender.ts',
    lang: 'typescript',
    highlight: [1, 16],
    desc: 'Ender — 온체인 이벤트를 Kafka에서 수신, DB 저장.',
    code: `// indexer/services/ender/ender.ts

class Ender {
  private kafka: KafkaConsumer;
  private db: PostgresClient;

  async processBlock(block: BlockEvent): Promise<void> {
    const events = block.events;
    for (const event of events) {
      await this.handlers[event.type].handle(event);
    }
    await this.db.commit();
  }
}`,
    annotations: [
      { lines: [3, 5], color: 'sky', note: 'Kafka + PostgreSQL' },
      { lines: [7, 13], color: 'emerald', note: '이벤트 처리 + DB 저장' },
    ],
  },

  'dx-api': {
    path: 'indexer/services/comlink/api.ts',
    lang: 'typescript',
    highlight: [1, 14],
    desc: 'Comlink REST API — 오더북, 포지션, 체결 기록 조회.',
    code: `// indexer/services/comlink/api.ts

app.get('/v4/orderbooks/perpetualMarket/:ticker',
  async (req, res) => {
    const orderbook = await db.getOrderbook(req.params.ticker);
    res.json({ bids: orderbook.bids, asks: orderbook.asks });
  });

app.get('/v4/addresses/:addr/subaccountNumber/:num',
  async (req, res) => {
    const sub = await db.getSubaccount(req.params.addr, req.params.num);
    res.json({ equity: sub.equity, positions: sub.positions });
  });`,
    annotations: [
      { lines: [3, 7], color: 'sky', note: '오더북 조회' },
      { lines: [9, 13], color: 'emerald', note: '서브계정 조회' },
    ],
  },
};
