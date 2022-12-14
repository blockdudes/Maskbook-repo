import { Box } from '@mui/material'
import { makeStyles, ActionButton } from '@masknet/theme'
import { useI18N } from '../../../../utils/index.js'
import { CollectibleState } from '../../hooks/useCollectibleState.js'
import { useControlledDialog } from '../../../../utils/hooks/useControlledDialog.js'
import { MakeOfferDialog } from './MakeOfferDialog.js'
import { PostListingDialog } from './PostListingDialog.js'
import { CheckoutDialog } from './CheckoutDialog.js'
import { ChainBoundary } from '../../../../web3/UI/ChainBoundary.js'
import { useAccount } from '@masknet/plugin-infra/web3'
import { isSameAddress, NetworkPluginID } from '@masknet/web3-shared-base'
import { useAssetOrder } from '../../hooks/useAssetOrder.js'
import { ChainId } from '@masknet/web3-shared-evm'

const useStyles = makeStyles()((theme) => {
    return {
        root: {
            width: 'calc(100% - 24px)',
            gap: 8,
        },
    }
})

export interface ActionBarProps {}

export function ActionBar(props: ActionBarProps) {
    const { t } = useI18N()
    const { classes } = useStyles()
    const { asset } = CollectibleState.useContainer()
    const account = useAccount(NetworkPluginID.PLUGIN_EVM)
    const { value: assetOrder } = useAssetOrder(asset.value?.address, asset.value?.tokenId)

    const {
        open: openCheckoutDialog,
        onOpen: onOpenCheckoutDialog,
        onClose: onCloseCheckoutDialog,
    } = useControlledDialog()
    const { open: openOfferDialog, onOpen: onOpenOfferDialog, onClose: onCloseOfferDialog } = useControlledDialog()
    const {
        open: openListingDialog,
        onOpen: onOpenListingDialog,
        onClose: onCloseListingDialog,
    } = useControlledDialog()

    if (!asset.value) return null
    const isOwner = isSameAddress(asset.value.owner?.address, account)
    return (
        <Box className={classes.root} sx={{ padding: 1.5 }} display="flex" justifyContent="center">
            <ChainBoundary
                expectedPluginID={NetworkPluginID.PLUGIN_EVM}
                expectedChainId={ChainId.Mainnet}
                ActionButtonPromiseProps={{ variant: 'roundedDark' }}>
                {!isOwner && asset.value.auction ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenCheckoutDialog}>
                        {t('plugin_collectible_buy_now')}
                    </ActionButton>
                ) : null}
                {!isOwner && asset.value.auction ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenOfferDialog}>
                        {t('plugin_collectible_place_bid')}
                    </ActionButton>
                ) : null}

                {!isOwner && !asset.value.auction ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenOfferDialog}>
                        {t('plugin_collectible_make_offer')}
                    </ActionButton>
                ) : null}
                {isOwner ? (
                    <ActionButton fullWidth variant="roundedDark" onClick={onOpenListingDialog}>
                        {t('plugin_collectible_sell')}
                    </ActionButton>
                ) : null}
                <CheckoutDialog
                    asset={asset.value}
                    order={assetOrder}
                    open={openCheckoutDialog}
                    onClose={onCloseCheckoutDialog}
                />
                <PostListingDialog asset={asset.value} open={openListingDialog} onClose={onCloseListingDialog} />
                <MakeOfferDialog
                    asset={asset.value}
                    order={assetOrder}
                    open={openOfferDialog}
                    onClose={onCloseOfferDialog}
                />
            </ChainBoundary>
        </Box>
    )
}
