import moment from 'moment'
import { useEffect, useState } from 'react'
import { Dictionary } from '../model/dictionary/types'
import { SourceOption, SearchData, SearchDataDefault, Source } from '../model/search/types'
import SearchRepository from '../repository/search/SearchRepository'


export const useSearchViewModel = () => {
    const [dictionaryData, setDictionaryData] = useState<Dictionary | null>(null)
    const [sources, setSources] = useState<SourceOption[]>([])
    const [lastTimestamp, setLastTimestamp] = useState('N/A')
    const [searchData, setSearchData] = useState<SearchData>(SearchDataDefault)
    const repository = SearchRepository.getInstance()

    useEffect(() => {
        repository
            .indicesWithTimestamps()
            .then((it) => {
                const source: Source = it.indicesTimestamps.length > 0 ? it.indicesTimestamps[0] : { index: '' }
                // const timestamp = it.indicesTimestamps.length > 0 ? it.indicesTimestamps[0].timestamp : it.maxTimestamp
                // const dateTo = moment.unix(timestamp).valueOf()
                setSearchData({
                    ...searchData
                    , source: source
                    // , dateRange: { from: null, to: dateTo }
                })
                setSources(it.indicesTimestamps)
            })
            .catch((err: Error) => {
                console.error(err)
            });
    }, [])


    function submitSearchData(newSearchData: Partial<SearchData>) {
        console.log(searchData)
        console.log(newSearchData)
        // if (newSearchData.source !== undefined && newSearchData.source?.index !== searchData.source.index){
        //     setSearchData({...SearchDataDefault, source: {index: newSearchData.source?.index}})
        // } else {
        setSearchData(prev => ({ ...prev, ...newSearchData }))
        searchData.search.phrase !== newSearchData.search?.phrase && setDictionaryData(null)
        // || newSearchData.source?.index !== searchData.source.index 
        // && setDictionaryData(null)
    }

    function onDictionaryObtained(dictionary: Dictionary | null) {
        setDictionaryData(dictionary)
    }

    function onSourceObtained(source: Source) {
        setSearchData(prev => ({ ...prev, 
            source: { index: prev.source.index, searchField: source.searchField, dateField: source.dateField } }))
        setLastTimestamp(source.timestamp ? moment(source.timestamp * 1000).format('MMMM Do YYYY, HH:mm'): 'N/A')
    }

    return {
        searchData,
        sources,
        lastTimestamp,
        dictionaryData,
        onDictionaryObtained,
        onSourceObtained,
        submitSearchData,
    }
}