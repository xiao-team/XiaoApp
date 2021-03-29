import db from './database'
import { AudioInfo } from 'aplayer'
const audioList = (db as any).audioList

const audio: Collect<AudioInfo> = {
    add(doc) {
        return audioList.add(doc)
    },
    find(doc) {
        return audioList.get(doc)
    },
    update(id, docs) {
        return audioList.update(id, docs)
    },
    all() {
        return audioList.toArray()
    },
    remove(id) {
        return audioList.delete(id)
    },
    clear() {
        return audioList.clear()
    }
}
export interface Collect<docType> {
    add: (doc: docType) => Promise<void>;
    find: (doc: docType) => Promise<docType>;
    update: (id: string, docs: docType[]) => Promise<void>;
    all: () => Promise<docType[]>;
    clear: () => Promise<void>;
    remove: (id: string) => Promise<void>;
}
export default audio