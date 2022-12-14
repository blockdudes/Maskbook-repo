/**
 * Manage local static resource
 */
export const IconURLs: Readonly<Record<string, string>> = {
    sadGhost: new URL('./images/sad-ghost.png', import.meta.url).toString(),
    tweetAttraceBg: new URL('./images/tweet-attrace-bg.png', import.meta.url).toString(),
}
