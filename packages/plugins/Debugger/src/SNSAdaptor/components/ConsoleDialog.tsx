import { InjectedDialog } from '@masknet/shared'
import { DialogContent } from '@mui/material'
import { ChainId } from '@masknet/web3-shared-evm'
import { NetworkPluginID } from '@masknet/web3-shared-base'
import { PluginIDContextProvider, PluginWeb3ContextProvider } from '@masknet/plugin-infra/web3'
import { ConsoleContent } from './ConsoleContent.js'
import { useRemoteControlledDialog } from '../../../../../shared-base-ui/src/hooks/index.js'
import { PluginDebuggerMessages } from '../../messages.js'

export interface ConsoleDialogProps {}

export function ConsoleDialog(props: ConsoleDialogProps) {
    const { open, closeDialog } = useRemoteControlledDialog(PluginDebuggerMessages.consoleDialogUpdated)
    return (
        <InjectedDialog title="Debugger" fullWidth open={open} onClose={closeDialog}>
            <DialogContent>
                <PluginIDContextProvider value={NetworkPluginID.PLUGIN_EVM}>
                    <PluginWeb3ContextProvider
                        pluginID={NetworkPluginID.PLUGIN_EVM}
                        value={{
                            chainId: ChainId.Mainnet,
                        }}>
                        <ConsoleContent onClose={closeDialog} />
                    </PluginWeb3ContextProvider>
                </PluginIDContextProvider>
            </DialogContent>
        </InjectedDialog>
    )
}
