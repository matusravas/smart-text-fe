import { Options } from "material-table";
import { useEffect, useMemo, useState } from "react";
import { Column, Data } from "../../model/search/types";
import { TablePagination, TablePaginationDefault, UseTableProps } from "../../model/table/types";
import SearchRepository from "../../repository/search/SearchRepository";


export function useTable({ searchData, onDictionary, onSource, onError, onSuccess }: UseTableProps) {
    const [rows, setRows] = useState<Data[]>(() => []);
    const [columns, setColumns] = useState<Column[]>(() => []);
    const [pagination, setPagination] = useState<TablePagination>(() => TablePaginationDefault);
    const [isLoading, setIsLoading] = useState<boolean>(() => false);
    const repository = SearchRepository.getInstance()
    // const isMounted = useRef(false);
    useEffect(() => {
        setIsLoading(true)
        repository
            .search(searchData)
            .then((res) => {
                console.log(res)
                if (!res.success) {
                    onError && onError(res.message)
                    return
                }
                // if (isMounted.current) return;
                setPagination(res.data.pagination);
                setRows([...res.data.results]);
                (res.data.results && res.data.results.length > 0)
                    && setColumns(prepareColumns(res.data.columns))
                setIsLoading(false)
                onDictionary(res.data.dictionary)
                onSource(res.data.source)
            })
            .catch(err => {
                console.error(err)
                // if (isMounted.current) return;
                onError && onError(err.message);
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [searchData.search, searchData.dateRange,
    searchData.pagination, searchData.keywords,
    searchData.source.index])

    function prepareColumns(columns: Column[]) {
        let centeredColumns = columns.map(col => {
            return {
                ...col, cellStyle: {
                    textAlign: 'center',
                    width: '20%',
                    padding: 12,
                    textOverflow: 'ellipsis',
                    'overflow': 'hidden',
                    'whiteSpace': 'nowrap',
                }
            }
        })
        if (!searchData.search.phrase) return centeredColumns
        const columnIndex = centeredColumns.findIndex(column => column.field === searchData.source.searchField)
        return centeredColumns.map((col, idx) => {
            if (!(idx === columnIndex || idx === columnIndex + 1)) return col
            const color = idx === columnIndex ? '#9a0007' : '#00600f'
            const newCol = {
                ...col,
                // headerStyle: {color: color, fontWeight: 'bold'},
                headerStyle: { fontWeight: 'bold' },
                cellStyle: { color: color, fontWeight: 'bold' }
            }
            return newCol
        })
    }

    function handleExport() {
        if (!searchData) return
        repository
            .searchExport(searchData)
            .then((res) => {
                if (!res.success) {
                    onError && onError(res.message);
                    return
                }
                onSuccess && onSuccess('Data successfully exported')
            })
            .catch((err: Error) => {
                onError && onError(err.message);
            });
    }

    const localization = useMemo(() => {
        return {
            toolbar: {
                exportCSVName: 'Export Excel'
            }
        }
    }, [])

    const options = useMemo(() => {
        let options: Options<any> = {};
        options = {
            grouping: false,
            maxBodyHeight: "50vh",
            headerStyle: {
                position: "sticky",
                top: 0,
                padding: 24
            },
            toolbar: false,
            draggable: false,
            search: false,
            showTitle: false,
            sorting: false,
            actionsColumnIndex: -1,
            filtering: false,
            loadingType: "linear",
            columnsButton: false,
            emptyRowsWhenPaging: false,
            paging: true,
            pageSizeOptions: [10, 20, 50, 100],
            pageSize: pagination.pageSize
        };
        return options
    }, [pagination.pageSize]);

    return {
        rows, isLoading, columns, pagination,
        options, localization,
        handleExport
    };
}