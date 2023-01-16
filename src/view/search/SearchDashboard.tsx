import { useSearchViewModel } from "../../viewmodel/SearchViewModel";
import { Table } from "../table/Table";
import SearchBar from "./components/SearchBar";

import { SearchDashboardWrapper } from "./styles/searchbar.styles";

const SearchDashboard = () => {
    const { requestData, handleRequestDataChange } = useSearchViewModel()
    const {search, date, lastTimestamp} = requestData
    return (
        <SearchDashboardWrapper>
            <SearchBar 
                search={search} date={date} 
                lastTimestamp={lastTimestamp} 
                onRequestDataChange={handleRequestDataChange} />
            <Table 
                requestData={requestData}
                onRequestDataChange={handleRequestDataChange} />
        </SearchDashboardWrapper>
    )
}

export default SearchDashboard