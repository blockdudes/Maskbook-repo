import { BindingProof, EMPTY_LIST } from '@masknet/shared-base'
import { sortBy } from 'lodash-unified'
import { isSameAddress } from '@masknet/web3-shared-base'
import { useMemo } from 'react'

export function useTipsWalletsList(proofList: BindingProof[] | undefined, identity?: string, kv?: BindingProof[]) {
    return useMemo(() => {
        if (!proofList?.length) return EMPTY_LIST
        const proofs = sortBy(proofList, (x) => -Number.parseInt(x.last_checked_at, 10)).map(
            (wallet, index, list): BindingProof => ({
                ...wallet,
                rawIdx: list.length - index - 1,
            }),
        )
        if (kv && kv.length > 0 && proofs.length > 0) {
            const result = proofs.map((x) => {
                x.isDefault = 0
                x.isPublic = 1
                const matched = kv?.find((proof) => isSameAddress(x.identity, proof.identity))
                if (matched) {
                    x.isDefault = matched.isDefault
                    x.isPublic = matched.isPublic
                }
                return x
            })
            const idx = result.findIndex((i) => i.isDefault)
            if (idx !== -1) {
                result.unshift(result.splice(idx, 1)[0])
            } else {
                result[0].isDefault = 1
            }
            return result
        }
        proofs.forEach((x, idx) => {
            x.isPublic = 1
            x.isDefault = 0
            if (idx === 0) {
                x.isDefault = 1
            }
        })
        return proofs
    }, [proofList, kv])
}
