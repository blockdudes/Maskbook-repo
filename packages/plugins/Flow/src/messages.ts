import { createPluginMessage, createPluginRPC } from '@masknet/plugin-infra'
import { PLUGIN_ID } from './constants.js'

if (import.meta.webpackHot) import.meta.webpackHot.accept()
const FlowMessage = createPluginMessage(PLUGIN_ID)

export const FlowRPC = createPluginRPC(PLUGIN_ID, () => import('./services.js'), FlowMessage.rpc)
