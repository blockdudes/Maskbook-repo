import { useEffect, useState } from 'react'
import {
    PluginIDContextProvider,
    PluginWeb3ContextProvider,
    useChainIdValid,
    Web3Helper,
} from '@masknet/plugin-infra/web3'
import { InjectedDialog } from '@masknet/shared'
import { MaskTabList, useTabs } from '@masknet/theme'
import type { NetworkPluginID } from '@masknet/web3-shared-base'
import { CrossIsolationMessages } from '@masknet/shared-base'
import { TabContext } from '@mui/lab'
import { DialogContent, Tab } from '@mui/material'
import { NFTCardContent } from './NFTCardContent.js'
import { useStyles } from '../../useStyles.js'
import { useI18N } from '../../../../utils/index.js'
import { Context } from '../hooks/useContext.js'

export enum NFTCardDialogTabs {
    About = 'About',
    Offers = 'Offers',
    Activity = 'Activity',
}

export function NFTCardDialog() {
    const { classes } = useStyles()
    const { t } = useI18N()
    const [chainId, setChainId] = useState<Web3Helper.ChainIdAll>()
    const [pluginID, setPluginID] = useState<NetworkPluginID>()
    const [tokenAddress, setTokenAddress] = useState<string>()
    const [tokenId, setTokenId] = useState<string>()
    const chainIdValid = useChainIdValid(pluginID, chainId)
    const [open, setOpen] = useState(false)

    const [currentTab, onChange] = useTabs<NFTCardDialogTabs>(
        NFTCardDialogTabs.About,
        NFTCardDialogTabs.Offers,
        NFTCardDialogTabs.Activity,
    )

    useEffect(() => {
        if (!chainIdValid) setOpen(false)
        return CrossIsolationMessages.events.requestNFTCardDialog.on((ev) => {
            if (!ev.open) return
            setPluginID(ev.pluginID)
            setChainId(ev.chainId)
            setTokenAddress(ev.tokenAddress)
            setTokenId(ev.tokenId)
            setOpen(ev.open)
        })
    }, [chainIdValid])

    if (!chainId || !pluginID) return null
    if (!tokenId || !tokenAddress) return null

    return (
        <PluginIDContextProvider value={pluginID}>
            <PluginWeb3ContextProvider
                pluginID={pluginID}
                value={{
                    chainId,
                }}>
                <Context.Provider initialState={{ tokenId, tokenAddress }}>
                    <TabContext value={currentTab}>
                        <InjectedDialog
                            open={open}
                            title={t('plugin_collectible_nft_detail')}
                            onClose={() => setOpen(false)}
                            classes={{ paper: classes.dialogRoot }}
                            titleTabs={
                                <MaskTabList variant="base" onChange={onChange} aria-label="NFTCard">
                                    <Tab label="About" value={NFTCardDialogTabs.About} />
                                    <Tab label="Offers" value={NFTCardDialogTabs.Offers} />
                                    <Tab label="Activity" value={NFTCardDialogTabs.Activity} />
                                </MaskTabList>
                            }>
                            <DialogContent className={classes.dialogContent}>
                                <NFTCardContent currentTab={currentTab} />
                            </DialogContent>
                        </InjectedDialog>
                    </TabContext>
                </Context.Provider>
            </PluginWeb3ContextProvider>
        </PluginIDContextProvider>
    )
}
