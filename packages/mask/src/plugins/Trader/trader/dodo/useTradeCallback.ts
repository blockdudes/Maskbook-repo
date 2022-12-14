import { useAccount, useWeb3Connection } from '@masknet/plugin-infra/web3'
import stringify from 'json-stable-stringify'
import { pick } from 'lodash-unified'
import { useMemo } from 'react'
import { useAsyncFn } from 'react-use'
import type { TransactionConfig } from 'web3-core'
import type { SwapRouteSuccessResponse, TradeComputed } from '../../types/index.js'
import { TargetChainIdContext } from '@masknet/plugin-infra/web3-evm'
import { NetworkPluginID, ZERO } from '@masknet/web3-shared-base'
import type { GasOptionConfig } from '@masknet/web3-shared-evm'

export function useTradeCallback(
    tradeComputed: TradeComputed<SwapRouteSuccessResponse> | null,
    gasConfig?: GasOptionConfig,
) {
    const { targetChainId: chainId } = TargetChainIdContext.useContainer()
    const account = useAccount(NetworkPluginID.PLUGIN_EVM)
    const connection = useWeb3Connection(NetworkPluginID.PLUGIN_EVM, { chainId })

    // compose transaction config
    const config = useMemo(() => {
        if (!account || !tradeComputed?.trade_) return null
        return {
            from: account,
            ...pick(tradeComputed.trade_, ['to', 'data', 'value']),
        } as TransactionConfig
    }, [account, tradeComputed])

    return useAsyncFn(async () => {
        // validate config
        if (!account || !config || !connection) {
            return
        }

        // compose transaction config
        const config_ = {
            ...config,
            gas: (await connection.estimateTransaction?.(config)) ?? ZERO.toString(),
            ...gasConfig,
        }

        // send transaction and wait for hash

        const hash = await connection.sendTransaction(config_)
        const receipt = await connection.getTransactionReceipt(hash)

        return receipt?.transactionHash
    }, [connection, account, chainId, stringify(config), gasConfig])
}
