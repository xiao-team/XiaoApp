import Dexie from 'dexie'

const db = new Dexie('suporka')

db.version(1.1).stores({
    audioList: '++id, author, lrc, pic, title, url, name',
    stockList: '++id, name, code, marketNumber, rate, price'
})

db.open()

export default db