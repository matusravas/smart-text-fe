import { FormEvent, useCallback, useEffect, useState } from "react"
import { DateRange, Operator, SearchData } from "../../model/search/types"
import { TablePaginationDefault } from "../../model/table/types"
import { DashboardFail } from "../../model/types"
import SearchRepository from "../../repository/search/SearchRepository"
import { MenuButtonOption } from "../../view/search/components/MenuButton"
import { SearchbarFormProps } from "../../view/search/components/SearchbarForm"

export type FormChangeData = {
    dateRange?: DateRange
    index?: string
    operator?: Operator
    phrase?: string
}

function useFormData(searchData: SearchData) {
    const [data, setData] = useState(searchData)

    function setFormData(...it: Partial<SearchData>[]) {
        setData({ ...data, ...Object.assign({}, ...it) })
    }

    return { formData: data, setFormData }
}

function useSearchbarForm(props: SearchbarFormProps) {
    const { formData, setFormData } = useFormData(props.searchData)
    const [operatorVisible, setOperatorVisible] = useState(false)
    const repository = SearchRepository.getInstance()

    const selectOperatorOptions = [
        { label: 'OR', value: 'OR' }
        , { label: 'AND', value: 'AND' }
    ]

    const selectSourceOptions = props.sources.map(it => {
        return { 'label': it.indexAlias, 'value': it.index }
    })

    useEffect(() => {
        formData.source.index && props.onSubmit(formData)
    }, [formData.source.index])

    useEffect(() => {
        setFormData({
            ...props.searchData, keywords: props.keywords
            , searchOperator: props.keywords !== formData.keywords ? 'OR' : formData.searchOperator
        })
        setOperatorVisible(
            searchPhraseLongEnough(props.searchData.searchPhrase)
                || (props.dictionary && props.keywords) ? true : false)
        props.dictionary && props.onSynonyms(true)
    }, [props.searchData, props.dictionary, props.keywords])



    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault()
        console.log(formData)
        props.onSubmit(formData)
    }
    function searchPhraseLongEnough(phrase: string) {
        return phrase.split(' ').filter(q => q.length > 2).length > 1
    }

    const handleFormDataChange = useCallback((it: FormChangeData) => {
        it.dateRange && setFormData({ dateRange: it.dateRange })
        if (it.index) {
            const found = props.sources.filter(s => s.index === it.index)
            const selectedSource = found.length === 1 ? found[0] : null
            selectedSource && setFormData({ source: selectedSource, pagination: TablePaginationDefault })
        }
        it.operator && setFormData({ searchOperator: it.operator })

        if (it.phrase !== undefined) {
            let keywords = props.keywords
            if (it.phrase !== props.searchData.searchPhrase) {
                props.onSynonyms(false)
                keywords = true
            }
            else props.onSynonyms(true)

            setOperatorVisible(
                (
                    (it.phrase === props.searchData.searchPhrase && props.dictionary && props.keywords)
                    || searchPhraseLongEnough(it.phrase)
                )
                    ? true
                    : false
            )
            setFormData({ keywords, searchPhrase: it.phrase })
        }
    }, [formData, props.searchData.searchPhrase, props.searchData.searchOperator, props.keywords, props.sources])

    function fetchSources() {
        return new Promise<MenuButtonOption[]>((resolve, reject) => {
            repository
                .sourcesWithTimestamps()
                .then((it) => {
                    if (!it.success) {
                        props.onSources([])
                        // props.handleError && props.handleError(it.message)
                        reject({ type: 'error', message: it.message })
                        return
                    }
                    props.onSources(it.data)
                    resolve(it.data.map(it => {
                        return { 'label': it.indexAlias, 'value': it.index }
                    }))
                })
                .catch((err: DashboardFail) => {
                    // props.handleError && props.handleError(err.message)
                    props.onSources([])
                    reject({ type: 'error', message: err.message })
                });
        })
    }

    return {
        searchData: formData,
        operatorVisible,
        selectSourceOptions,
        selectOperatorOptions,
        handleFormDataChange,
        fetchSources,
        handleSubmit,
        onError: props.handleError
    }
}

export default useSearchbarForm