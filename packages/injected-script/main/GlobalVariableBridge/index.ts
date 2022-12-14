import { $, $Content } from '../intrinsic.js'
import { cloneIntoContent, handlePromise, sendEvent } from '../utils.js'
import type { InternalEvents } from '../../shared/index.js'

const hasListened: Record<string, boolean> = { __proto__: null! }
const unwrappedWindow = $.XPCNativeWrapper?.unwrap(window) ?? window

function read(path: string): unknown {
    const fragments = $.StringSplit(path, '.' as any)
    let result: any = unwrappedWindow
    while (fragments.length !== 0) {
        try {
            const key: string = $.ArrayShift(fragments)
            result = key ? result[key] : result
        } catch {
            return
        }
    }
    return result
}

export function access(path: string, id: number, property: string) {
    handlePromise(id, () => {
        const item = read(path + '.' + property)

        // the public key cannot transfer correctly between pages, since stringify it manually
        if (path === 'solflare' && property === 'publicKey') {
            try {
                return (item as any).toBase58()
            } catch {}
        }

        return item
    })
}

export function callRequest(path: string, id: number, request: unknown) {
    handlePromise(id, () => (read(path) as any)?.request(request))
}

export function execute(path: string, id: number, ...args: unknown[]) {
    handlePromise(id, () => (read(path) as any)?.(...cloneIntoContent(args)))
}

export function bindEvent(path: string, bridgeEvent: keyof InternalEvents, event: string) {
    if (hasListened[`${path}_${event}`]) return
    hasListened[`${path}_${event}`] = true
    try {
        ;(read(path) as any)?.on(
            event,
            cloneIntoContent((...args: any[]) => {
                // TODO: type unsound
                sendEvent(bridgeEvent, path, event, args)
            }),
        )
    } catch {}
}

function untilInner(name: string) {
    const win = unwrappedWindow
    if ($.Reflect.has(win, name)) return $.PromiseResolve(true)

    let restCheckTimes = 150 // 30s

    return new Promise<true>((resolve) => {
        function check() {
            restCheckTimes -= 1
            if (restCheckTimes < 0) return
            if ($.Reflect.has(win, name)) return resolve(true)
            $Content.setTimeout(check, 200)
        }
        check()
    })
}

export function until(path: string, id: number) {
    handlePromise(id, () => untilInner(path))
}
