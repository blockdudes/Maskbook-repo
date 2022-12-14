import { useSubscription } from 'use-subscription'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import type { Web3Helper } from '../web3-helpers/index.js'
import { useWeb3State } from './useWeb3State.js'
import { UNDEFINED } from '../utils/subscription.js'
import { useDefaultNetworkType } from './useDefaultNetworkType.js'
import { useCurrentWeb3NetworkNetworkType } from './Context.js'

export function useNetworkType<S extends 'all' | void = void, T extends NetworkPluginID = NetworkPluginID>(
    pluginID?: T,
) {
    const { Provider } = useWeb3State<S>(pluginID)
    const currentNetworkType = useCurrentWeb3NetworkNetworkType(pluginID)
    const defaultNetworkType = useDefaultNetworkType(pluginID)
    const networkType = useSubscription(Provider?.networkType ?? UNDEFINED)

    return (currentNetworkType ?? networkType ?? defaultNetworkType) as Web3Helper.NetworkTypeScope<S, T>
}
