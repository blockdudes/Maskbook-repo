import { useAsyncFn } from 'react-use'
import { Messages, Services } from '../../../API.js'
import { delay } from '@dimensiondev/kit'
import type { AsyncFnReturn } from 'react-use/lib/useAsyncFn'

export function useCreatePersona(): AsyncFnReturn<(nickName: string) => Promise<void>> {
    return useAsyncFn(async (nickName: string) => {
        // TODO: should second parameter be the password?
        await Services.Identity.createPersonaByMnemonic(nickName, '')
        await delay(300)
        Messages.events.ownPersonaChanged.sendToAll(undefined)
    })
}
