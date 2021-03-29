declare module  'aplayer' {
    
    interface PlayOption {

    }
    export interface AudioInfo {
        id?: string
        name?: string
        artist?: string
        url?: string
        cover?: string
        lrc?: string
        theme?: string
        author?: string
    }
    interface AudioList {
        clear: () => void
        add: (audios: AudioInfo | Array<AudioInfo>) => void
        show: () => void
        toggle: () => void
        hide: () => void
        remove: (index: number) => void
        switch: (index: number) => void
    }
    export default class APlayer {
        constructor(option: PlayOption)
        list: AudioList
        play: () => void
    }
}