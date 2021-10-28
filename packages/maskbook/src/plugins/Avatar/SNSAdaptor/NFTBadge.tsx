import { useStylesExtends } from '@masknet/shared'
import { makeStyles } from '@masknet/theme'
import { resolveOpenSeaLink } from '@masknet/web3-shared-evm'
import Link from '@mui/material/Link'
import BigNumber from 'bignumber.js'
import { searchTwitterAvatarSelector } from '../../../social-network-adaptor/twitter.com/utils/selector'
import { useNFT } from '../hooks'
import { useNFTVerified } from '../hooks/useNFTVerified'
import { useUserOwnerAddress } from '../hooks/useUserOwnerAddress'
import type { AvatarMetaDB } from '../types'
import { NFTAvatarRingIcon } from './NFTAvatarRing'

const useStyles = makeStyles<number>()((theme, size) => ({
    root: {
        position: 'absolute',
        left: -17,
        top: -114,
        width: size - 4,
        height: size - 4,
        [`@media (max-width: ${theme.breakpoints.values.sm}px)`]: {
            left: -22,
            top: -67,
        },
        borderRadius: '100%',
        boxShadow: '4px 4px 4px rgba(105, 228, 255, 0.25)',
    },
    image: {
        position: 'absolute',
        bottom: 0,
    },
}))

interface NFTBadgeProps extends withClasses<'root' | 'text' | 'icon'> {
    avatar: AvatarMetaDB
    size?: number
    width?: number
}

function formatPrice(amount: string) {
    const _amount = new BigNumber(amount ?? '0')
    if (_amount.isZero()) return '0'
    if (_amount.isLessThan(1)) return _amount.toFixed(2)
    if (_amount.isLessThan(1e3)) return _amount.toFixed(1)
    if (_amount.isLessThan(1e6)) return `${_amount.div(1e6).toFixed(1)}K`
    return `${_amount.div(1e6).toFixed(1)}M`
}

function formatText(symbol: string, length: number) {
    return symbol.length > length ? `${symbol.slice(0, length)}...` : symbol
}

export function NFTBadge(props: NFTBadgeProps) {
    const { avatar, size = 140, width = 15 } = props
    const classes = useStylesExtends(useStyles(size + width * 2), props)

    const { value = { amount: '0', symbol: 'ETH', name: '', owner: '' }, loading } = useNFT(
        avatar.userId,
        avatar.address,
        avatar.tokenId,
    )

    const address = useUserOwnerAddress(avatar.userId)
    const { amount, symbol, name, owner } = value
    const { loading: loadingNFTVerified, value: NFTVerified } = useNFTVerified(avatar.address)
    //  if (!isSameAddress(address, owner)) return null

    const avatarDom = searchTwitterAvatarSelector().evaluate()
    if (avatarDom) avatarDom.style.marginBottom = '10px'

    return (
        <div className={classes.root}>
            <Link href={resolveOpenSeaLink(avatar.address, avatar.tokenId)} target="_blank" rel="noopener noreferrer">
                <NFTAvatarRingIcon
                    size={size - 2}
                    width={15}
                    text={loading || loadingNFTVerified ? 'loading...' : `${name} ${amount} ${symbol}`}
                />
            </Link>
        </div>
    )
}