import { useMemo } from 'react'
import { ZERO_ADDRESS } from '@masknet/web3-shared-evm'
import { usePoolTogetherTicketContracts } from '../contracts/usePoolTogetherTicket.js'
import type { PoolTogetherTicket } from '@masknet/web3-contracts/types/PoolTogetherTicket'
import { useAsyncRetry } from 'react-use'
import type { AccountPool, Pool } from '../types.js'
import { useAccount, useChainId } from '@masknet/plugin-infra/web3'
import { NetworkPluginID } from '@masknet/web3-shared-base'
import { useMultipleContractSingleData } from '@masknet/plugin-infra/web3-evm'

/**
 * A callback for getting account balances of ticket pools
 * @param pools
 */
export function useAccountBalance(pools: Pool[]) {
    const account = useAccount(NetworkPluginID.PLUGIN_EVM)
    const chainId = useChainId(NetworkPluginID.PLUGIN_EVM)
    const ticketContracts = usePoolTogetherTicketContracts(
        chainId,
        pools.map((pool) => pool.tokens.ticket.address),
    ).filter(Boolean) as PoolTogetherTicket[]

    const [results, calls, _, callback] = useMultipleContractSingleData(
        ticketContracts,
        Array.from<'balanceOf'>({ length: ticketContracts.length }).fill('balanceOf'),
        [account || ZERO_ADDRESS],
    )
    const asyncResults = useAsyncRetry(() => callback(calls), [calls])

    const values = useMemo(() => {
        return results.length !== 0
            ? pools.map(
                  (pool, i) =>
                      ({
                          pool,
                          account: {
                              ticketBalance: results[i].value,
                              userAddress: account,
                          },
                      } as AccountPool),
              )
            : undefined
    }, [account, ticketContracts, asyncResults, results])

    return {
        ...asyncResults,
        value: values,
    }
}
