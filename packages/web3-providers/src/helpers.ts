/// <reference types="@masknet/global-types/firefox" />
/// <reference types="@masknet/global-types/flag" />

import {
    APE,
    BUSD,
    ChainId,
    createNativeToken,
    DAI,
    HUSD,
    NETWORK_DESCRIPTORS,
    SchemaType,
    USDC,
    USDT,
    WBTC,
    WNATIVE,
} from '@masknet/web3-shared-evm'
import { FungibleAsset, isSameAddress } from '@masknet/web3-shared-base'

export async function fetchJSON<T = unknown>(
    requestInfo: string,
    requestInit?: RequestInit,
    options?: {
        fetch: typeof globalThis.fetch
    },
): Promise<T> {
    const fetch = options?.fetch ?? globalThis.fetch
    const res = await fetch(requestInfo, requestInit)
    return res.json()
}

export function getAllEVMNativeAssets(): Array<FungibleAsset<ChainId, SchemaType>> {
    return NETWORK_DESCRIPTORS.filter((x) => x.isMainnet).map((x) => ({
        ...createNativeToken(x.chainId),
        balance: '0',
    }))
}

export function getJSON<T>(json?: string): T | undefined {
    if (!json) return
    try {
        return JSON.parse(json) as T
    } catch {
        return
    }
}

export function getPaymentToken(chainId: ChainId, token?: { name?: string; symbol?: string; address?: string }) {
    if (!token) return

    return [
        createNativeToken(chainId),
        ...[APE, USDC, USDT, HUSD, BUSD, DAI, WBTC, WNATIVE].map((x) => x[chainId]),
    ].find(
        (x) =>
            x.name.toLowerCase() === token.name?.toLowerCase() ||
            x.symbol.toLowerCase() === token.symbol?.toLowerCase() ||
            isSameAddress(x.address, token.address),
    )
}
