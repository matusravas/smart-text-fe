import { useSearchViewModel } from "../../viewmodel/SearchViewModel";
import { Table } from "../table/Table";
import Searchbar from "./components/Searchbar";

import { SearchDashboardWrapper } from "./styles/searchbar.styles";

function SearchDashboard() {
    const { 
        searchData, 
        sources,
        lastTimestamp,
        dictionaryData, 
        onSourceObtained,
        onDictionaryObtained, 
        submitSearchData, 
        } = useSearchViewModel()
    console.log(lastTimestamp)
    return (
        <SearchDashboardWrapper>
            <Searchbar 
                searchData={searchData}
                sources={sources}
                dictionaryData={dictionaryData}
                submitSearchData={submitSearchData}
                 />
            {sources.length > 0 ?
                <Table 
                    searchData={searchData}
                    lastTimestamp={lastTimestamp}
                    onDictionary={onDictionaryObtained}
                    onSource={onSourceObtained}
                    submitSearchData={submitSearchData}
                    />
                 : null
            }
        </SearchDashboardWrapper>
    )
}

export default SearchDashboard