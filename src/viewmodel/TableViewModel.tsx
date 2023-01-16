import { Options } from "material-table";
import {
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
import { Column, Data } from "../model/search/types";
import { TablePagination, TablePaginationDefault, UseTableProps } from "../model/table/types";
import SearchRepository from "../repository/search/SearchRepository";


export function useTable({
    requestData,
    onError,
    onSuccess,
}: UseTableProps) {
    const [rows, setRows] = useState<Data[]>(() => []);
    const [columns, setColumns] = useState<Column[]>(() => []);
    const [pagination, setPagination] = useState<TablePagination>(() => (TablePaginationDefault));
    const [isLoading, setIsLoading] = useState<boolean>(() => false);
    const repository = SearchRepository.getInstance()
    const isMounted = useRef(false);

    useEffect(() => {
        if (!requestData.lastTimestamp) return
        // if(!factory.controller.signal.aborted) setIsLoading(true)
        repository
            .search(requestData)
            .then((res) => {
                console.log(res)
                if (isMounted.current) return;
                setColumns(prepareColumns(res.columns));
                setPagination(res.pagination);
                setRows([...res.results]);
                setIsLoading(false)
            })
            .catch((err: Error) => {
                if (isMounted.current) return;
                setIsLoading(false);
                onError && onError(err.message);
            });
    }, [requestData]);

    const prepareColumns = (columns: Column[]) => {
        let centeredColumns = columns.map(col=>{
            return {...col, cellStyle: {
                textAlign: 'center',
              }}
        })
        if (!requestData.search.phrase) return centeredColumns
        const columnIndex = centeredColumns.findIndex(column=>column.field === requestData.search.field)
        return centeredColumns.map((col, idx)=> {
            if (!(idx === columnIndex || idx === columnIndex + 1)) return col
            const color = idx === columnIndex? '#9a0007': '#00600f'
            const newCol = {...col, 
                headerStyle: {color: color, fontWeight: 'bold'},
                cellStyle: {color: color, fontWeight: 'bold'}}
            return newCol
        })
    }

    const handleExport = () => {
        if (!requestData) return
        repository
            .searchExport(requestData.search, requestData.date)
            .then((res)=>{
                //
            })
            .catch((err: Error) => {
                if (isMounted.current) return;
                onError && onError(err.message);
            });
    }

    const localization = useMemo(()=> {
        return {
            toolbar: {
                exportCSVName: 'Export Excel'
            }
        }
    }, [])
    
    const tableOptions = useMemo(() => {
        let options: Options<any> = {};
        options = {
            grouping: false,
            maxBodyHeight: "65vh",
            headerStyle: {
                position: "sticky",
                top: 0,
            },
            // toolbar: false,
            draggable: false,
            search: false,
            showTitle: false,
            sorting: false,
            exportButton: {
                csv: true,
            },
            exportCsv: handleExport,
            filtering: false,
            loadingType: "linear",
            columnsButton: false,
            emptyRowsWhenPaging: false,
            paging: true,
            pageSizeOptions: [10, 20, 50, 100],
            pageSize: pagination.pageSize
        };
        return options
    }, [requestData.search, requestData.date, pagination.pageSize]);

    return { rows, isLoading, columns, pagination, options: tableOptions, localization, componentDidUnmount: isMounted };
}
