export const META_KEY_1 = 'com.maskbook.fileservice:1'
export const META_KEY_2 = 'com.maskbook.fileservice:2'

export const MAX_FILE_SIZE = 0xa00000 // = 10 MiB

export const landing = 'https://files.r2d2.to/partner/arweave/landing-page.html'
export const signing = 'https://service.r2d2.to/arweave-remote-signing'
export const mesonPrefix = 'https://pz-yyxfhb.meson.network'

export const enum FileRouter {
    Prepare = '/prepare',
    Uploading = '/uploading',
    Uploaded = '/uploaded',
}
