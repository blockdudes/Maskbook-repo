import { RSS3 } from '@masknet/web3-providers'
import { useAsync } from 'react-use'

export function useFootprints(address: string) {
    return useAsync(async () => {
        const { data } = await RSS3.getFootprints(address)
        return data
    }, [address])
}
