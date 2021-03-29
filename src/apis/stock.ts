import axios from 'axios'
import qs from 'qs'
import { StockInfo } from '../data/stock'
const searchApi = 'https://searchapi.eastmoney.com/api/Info/Search?'
const detailsApi = 'https://push2.eastmoney.com/api/qt/ulist.np/get?'
const detailApi = 'https://push2.eastmoney.com/api/qt/stock/trends2/get?'
const storeApi = {
    search(query: string) {
        const params = {
            appid: 'el1902262',
            type: 14,
            token: 'CCSDCZSDCXYMYZYYSYYXSMDDSMDHHDJT',
            and14: `MultiMatch/Name,Code,PinYin/${query}/true`,
            returnfields14: 'Name,Code,PinYin,MarketType,JYS,MktNum,JYS4App,MktNum4App,ID,Classify,IsExactMatch,SecurityType,SecurityTypeName',
            pageIndex14: 1,
            pageSize14: 10,
            isAssociation14: false + '' + String(new Date().getTime())
        }
        return axios.post('http://localhost:4848/api', {
            url: searchApi + qs.stringify(params)
        }).then(res => {
            if (res?.status === 200 && res?.data?.code === 200) {
                return Promise.resolve(res.data.info || null)
            }
            return Promise.reject()

        })
    },
    getDetails(list: StockInfo[]) {
        const params = {
            fltt: '2',
            fields: 'f2,f3,f4,f12,f14',
            secids: list.map(o => o.marketNumber + '.' + o.code).join(','),
        }
        return axios.post('http://localhost:4848/api', {
            url: detailsApi + qs.stringify(params)
        }).then(res => {
            if (res?.status === 200 && res?.data?.code === 200) {
                const data = res?.data?.info

                if (data?.data?.diff) return Promise.resolve(data.data.diff || null)
            }
            return Promise.reject()
        })
    },
    getDetail(secid: string) {
        const params = {
            secid,
            fields1: 'f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13',
            fields2: 'f51,f53,f56,f58',
            iscr: '0',
            iscca: '0',
            ndays: '1',
            forcect: '1',
        }
        return axios.post('http://localhost:4848/api', {
            url: detailApi + qs.stringify(params)
        }).then(res => {
            if (res?.status === 200 && res?.data?.code === 200) {
                const data = res?.data?.info
                if (data?.data) return Promise.resolve(data.data)
            }
            return Promise.reject()
        })
    }
}

export default storeApi