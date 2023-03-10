export type SearchRequest = {
    search: Search
    date: Date
    pagination: Pagination
}

export type Search = {
    phrase: string,
    field: string,
    operator : 'AND' | 'OR'
}

export type Date = {
    field?: string,
    from: number
    to: number
}

export const SearchPaginationDefault = {
    currentPage: 0,
    pageSize: 10,
}

export type Pagination = {
    currentPage: number,
    pageSize: number,
}

export type PaginationRaw = {
    current_page: number,
    step: number,
    total_hits: number,
    total_pages: number
}

export type Column = {
    field: string,
    title: string,
    type: 'string' | 'numeric' | 'date' | 'boolean'
}

export type Data = Record<string, string|number>