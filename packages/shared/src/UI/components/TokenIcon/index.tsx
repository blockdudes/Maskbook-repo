import { useAsyncRetry } from 'react-use'
import { first } from 'lodash-unified'
import type { AvatarProps } from '@mui/material'
import { useChainId, useWeb3Hub, Web3Helper } from '@masknet/plugin-infra/web3'
import { NetworkPluginID, TokenType } from '@masknet/web3-shared-base'
import { EMPTY_LIST } from '@masknet/shared-base'
import { useImageBase64 } from '../../../hooks/useImageBase64.js'
import { Icon } from '../Icon/index.js'

export interface TokenIconProps extends withClasses<'icon'> {
    chainId?: Web3Helper.ChainIdAll
    pluginID?: NetworkPluginID
    address: string
    name?: string
    logoURL?: string
    isERC721?: boolean
    tokenType?: TokenType
    disableDefaultIcon?: boolean
    AvatarProps?: Partial<AvatarProps>
}

export function TokenIcon(props: TokenIconProps) {
    const { address, logoURL, name, AvatarProps, classes, tokenType = TokenType.Fungible, disableDefaultIcon } = props

    const chainId = useChainId(props.pluginID, props.chainId)
    const hub = useWeb3Hub(props.pluginID)
    const isNFT = tokenType === TokenType.NonFungible
    const { value } = useAsyncRetry(async () => {
        const logoURLs = isNFT
            ? await hub?.getNonFungibleTokenIconURLs?.(chainId, address)
            : await hub?.getFungibleTokenIconURLs?.(chainId, address).catch(() => [])
        const key = address ? [chainId, address].join('/') : logoURL
        return {
            key,
            urls: [logoURL, ...(logoURLs ?? [])].filter(Boolean) as string[],
        }
    }, [chainId, address, isNFT, logoURL, hub])
    const { urls = EMPTY_LIST, key } = value ?? {}
    const originalUrl = first(urls)
    const accessibleUrl = useImageBase64(key, originalUrl)

    if (!accessibleUrl && originalUrl && disableDefaultIcon) return null

    return (
        <Icon
            key={key}
            logoURL={isNFT ? logoURL : accessibleUrl || originalUrl}
            AvatarProps={AvatarProps}
            classes={classes}
            name={name}
        />
    )
}
