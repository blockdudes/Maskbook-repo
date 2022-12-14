import type { ProposalIdentifier } from '../types.js'

export function getProposalIdentifier(url: string): ProposalIdentifier {
    const parsedURL = new URL(url)
    const [, space, , id] = parsedURL.hash.split('/')
    return {
        id,
        space,
    }
}
