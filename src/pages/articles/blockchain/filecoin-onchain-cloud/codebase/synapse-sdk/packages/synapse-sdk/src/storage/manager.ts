// FilOzone/synapse-sdk synapse-sdk-v2.0.2
// packages/synapse-sdk/src/storage/manager.ts
// Exact source control-flow excerpt. Types, class fields and result aggregation are omitted.

/**
 * Upload data to Filecoin Onchain Cloud using a store->pull->commit flow across
 * multiple providers.
 *
 * By default, uploads to 2 providers (primary + secondary) for redundancy.
 * Data is uploaded once to the primary, then secondaries pull from the primary
 * via SP-to-SP transfer.
 *
 * This method only throws if zero copies succeed. Partial success (some but
 * not all copies) is indicated by `result.complete === false`.
 */
async upload(data: UploadPieceStreamingData, options?: StorageManagerUploadOptions): Promise<UploadResult> {
  const batching = getPieceBatchingService(this._synapse)
  if (batching != null) {
    return this._uploadBatched(data, options, batching, batching.hold())
  }

  const { contexts, explicitProviders } = await this._resolveUploadContexts(options)
  const [primary, ...secondaries] = contexts

  // Store on primary provider
  let storeResult: { pieceCid: PieceCID; size: number }
  try {
    storeResult = await primary.store(data, {
      pieceCid: options?.pieceCid,
      signal: options?.signal,
      onProgress: options?.callbacks?.onProgress,
    })
    safeInvoke(options?.callbacks?.onStored, primary.provider.id, storeResult.pieceCid)
  } catch (error) {
    throw new StoreError(
      `Failed to store on primary provider ${primary.provider.id} (${primary.provider.pdp.serviceURL})`,
      {
        cause: error instanceof Error ? error : undefined,
        providerId: primary.provider.id,
        endpoint: primary.provider.pdp.serviceURL,
      }
    )
  }

  const pieceInputs = [{ pieceCid: storeResult.pieceCid, pieceMetadata: options?.pieceMetadata }]

  // Pull to secondaries via SP-to-SP transfer
  let successfulSecondaries: StorageContext[] = []
  let pullFailures: FailedAttempt[] = []
  let extraDataMap = new Map<StorageContext, Hex>()

  if (secondaries.length > 0) {
    const pullResult = await this._pullToSecondariesWithRetry(primary, secondaries, [storeResult.pieceCid], {
      explicitProviders,
      signal: options?.signal,
      withCDN: options?.withCDN,
      metadata: options?.metadata,
      pieceMetadata: options?.pieceMetadata,
      callbacks: options?.callbacks,
      onProgress: options?.callbacks?.onPullProgress,
      onSuccess: options?.callbacks?.onCopyComplete,
      onFailure: options?.callbacks?.onCopyFailed,
      pieceInputs,
    })
    successfulSecondaries = pullResult.successful
    pullFailures = pullResult.failedAttempts
    extraDataMap = pullResult.extraDataMap
  }

  // Commit on all providers in parallel
  const commitPromises = [
    { ctx: primary, role: 'primary' as const },
    ...successfulSecondaries.map((ctx) => ({ ctx, role: 'secondary' as const })),
  ].map(async ({ ctx, role }) => {
    const result = await ctx.commit({
      pieces: pieceInputs,
      extraData: extraDataMap.get(ctx),
      onSubmitted: (txHash) =>
        safeInvoke(options?.callbacks?.onPiecesAdded, txHash, ctx.provider.id, [{ pieceCid: storeResult.pieceCid }]),
    })
    return { ctx, role, result }
  })

  const commitResults = await Promise.allSettled(commitPromises)

  // Processing of complete, copies and failedAttempts is omitted.
}
