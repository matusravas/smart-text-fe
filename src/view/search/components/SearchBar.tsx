import { FormEvent, useState } from "react"
import { Dictionary } from "../../../model/dictionary/types"
import { Date, Operator, Search, SearchData, SearchPaginationDefault } from "../../../model/search/types"
import { SearchBarForm, SearchBarWrapper, SearchButton, SearchInput, SearchToolBar, SearchToolBarWrapper } from '../styles/searchbar.styles'
import { SearchBarSynonyms, SynonymParagraph } from "../styles/searchbar.synonyms.styles"
import { Calendar } from "./Calendar"
import { SelectButton } from "./SelectButton"

interface SearchBarProps {
    search: Search,
    date: Date,
    dictionary: Dictionary | null
    lastTimestamp: number | null,
    onRequestDataChange: (requestData: Partial<SearchData>) => void,
}

const SearchBar = ({ search, onRequestDataChange, date, dictionary, lastTimestamp }: SearchBarProps) => {
    const [query, setQuery] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [operator, setOperator] = useState(search.operator)
    const [dateRange, setDateRange] = useState(date)
    const selectOptions = [
        // { label: 'Text', value: 'TEXT' }
        { label: 'OR', value: 'OR' }
        ,{ label: 'AND', value: 'AND' }
    ]

    // useEffect(() => {
    //     setDateRange(date)
    // }, [lastTimestamp])

    const hasSearchMultiplePhrases = (searchQuery: string) => {
        const queryPhrases = searchQuery.split(' ').filter(q => q.length > 2)
        return queryPhrases.length > 1
    }

    const handleSearchQueryChange = (searchQuery: string) => {
        setDisabled(!hasSearchMultiplePhrases(searchQuery))
        setQuery(searchQuery)
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        onRequestDataChange({
            search: { ...search, phrase: query.trim(), operator: operator }
            , date: { ...dateRange }
            , pagination: SearchPaginationDefault
        })
    }


    const handleSearchOperatorChange = (value: Operator) => {
        // if (search.phrase && operator !== value) {
        //     setOperator(value)
        //     onRequestDataChange({ search: { ...search, operator: value }, pagination: SearchPaginationDefault })
        // }
        // else setOperator(value)
        setOperator(value)
    }

    const handleDateChange = (date: Date) => {
        console.log(date)
        setDateRange({ ...dateRange, ...date })
    }

    return (
        <SearchBarWrapper id="searchBar">
            <img style={{height: '60px', 'marginBottom': '32px', 'marginTop': '16px'}} src='/img/bekaert-logo.svg' alt='PDS'/>
            <SearchBarForm id="searchForm" autoComplete="off" onSubmit={handleSubmit}>
                <SearchInput value={query} onChange={(e) => handleSearchQueryChange(e.target.value)} />
                <SearchToolBarWrapper id="searchToolBarWrapper">
                    <SearchToolBar id="searchToolBar">
                        <Calendar
                            dateRange={dateRange}
                            lastTimestamp={lastTimestamp}
                            onChange={handleDateChange}
                        />
                        <SelectButton
                            disabled={disabled}
                            label="Operator" options={selectOptions}
                            value={operator} onSelected={handleSearchOperatorChange} />
                    </SearchToolBar>

                    <SearchButton />
                </SearchToolBarWrapper>
            </SearchBarForm>

            <SearchBarSynonyms id="synonyms">
                {dictionary && <><p>Searched also for:</p><>{dictionary.synonyms.map((synonym, idx) => (
                    <>
                        <SynonymParagraph>{synonym}</SynonymParagraph>
                        {idx !== dictionary.synonyms.length - 1 && <p>•</p>}
                    </>
                ))}</></>}
            </SearchBarSynonyms>

        </SearchBarWrapper>

    )
}

export default SearchBar