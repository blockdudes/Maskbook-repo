import { useAsyncRetry } from 'react-use'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import type { Web3Helper } from '../web3-helpers/index.js'
import { useWeb3Hub } from './useWeb3Hub.js'
import { useChainId } from './useChainId.js'

export function useNonFungibleTokensFromTokenList<
    S extends 'all' | void = void,
    T extends NetworkPluginID = NetworkPluginID,
>(pluginID?: T, options?: Web3Helper.Web3HubOptionsScope<S, T>) {
    const chainId = useChainId(pluginID, options?.chainId)
    const hub = useWeb3Hub(pluginID, options)

    return useAsyncRetry<Array<Web3Helper.NonFungibleTokenScope<S, T>> | undefined>(async () => {
        return hub?.getNonFungibleTokensFromTokenList?.(chainId)
    }, [chainId, hub])
}
