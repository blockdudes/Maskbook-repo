import { createPluginMessage, PluginMessageEmitter, createPluginRPC } from '@masknet/plugin-infra'
import { PLUGIN_ID } from './constants.js'

interface ProfileMessages {
    rpc: unknown
}

export const PluginProfileMessages: PluginMessageEmitter<ProfileMessages> = createPluginMessage(PLUGIN_ID)
export const PluginProfileRPC = createPluginRPC(PLUGIN_ID, () => import('./services.js'), PluginProfileMessages.rpc)
