import { useAsyncRetry } from 'react-use'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import type { Web3Helper } from '../web3-helpers/index.js'
import { useChainId } from './useChainId.js'
import { useWeb3Connection } from './useWeb3Connection.js'

export function useBlockTimestamp<S extends 'all' | void = void, T extends NetworkPluginID = NetworkPluginID>(
    pluginID?: T,
    options?: Web3Helper.Web3ConnectionOptionsScope<S, T>,
) {
    const chainId = useChainId(pluginID, options?.chainId)
    const connection = useWeb3Connection(pluginID, options)

    return useAsyncRetry(async () => {
        if (!connection) return 0
        return connection.getBlockTimestamp()
    }, [chainId, connection])
}
