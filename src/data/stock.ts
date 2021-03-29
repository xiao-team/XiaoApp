import db from './database'
export interface StockInfo {
    name?: string
    code?: string
    marketNumber?: string
    rate?: string
    price?: string
}
const stockList = (db as any).stockList

const stock: Collect<StockInfo> = {
    add(doc) {
        return stockList.add(doc)
    },
    find(doc) {
        return stockList.get(doc)
    },
    update(id, docs) {
        return stockList.update(id, docs)
    },
    all() {
        return stockList.toArray()
    },
    remove(id) {
        return stockList.delete(id)
    },
    clear() {
        return stockList.clear()
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
export default stock