import styled from "styled-components";

export const TableWrapper = styled.div`
  max-height: 100%;
  max-width: 90%;
  /* & .MuiTableRow-head th:hover { */
    /* filter: sepia(20%); */
    /* position: sticky; */
  /* } */
  & .Component-horizontalScrollContainer-15 {
    border-radius: 10px;
  }
  & .MuiTableCell-head {
    background-color: #303030;
    color: #fafafa;

    // font-size: 14px;
    text-align: center;
    /* white-space: nowrap; */
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  & .MuiTableRow-head {
      background-color: #303030;
      position: sticky;
      top: 0;
      border-color: #303030;
      color: #303030;
  }
  & .MuiTableBody-root tr:nth-of-type(even) {
    background: #f2f2f2;
  }
  & .MuiTableBody-root tr:nth-of-type(odd) {
    background: #fafafa;
  }
  & .MuiTableBody-root {
    font-size: 14px;
  }
  & div::-webkit-scrollbar {
    background-color: #fafbfd;
    min-width: 10px;
    border-radius: 10px;
  }
  & div::-webkit-scrollbar-track {
    background-color: #fafbfd;
    border-radius: 10px;
  }
  & div::-webkit-scrollbar-thumb {
    background-color: #babac0;
    min-width: 20px;
    border-radius: 16px;
    border: 4px solid #fafbfd;
  }
  & div::-webkit-scrollbar-thumb:hover {
    background-color: #6f6f73;
    border: 4px solid #fafbfd;
  }
  & div::-webkit-scrollbar-button {
    display: none;

  }
`;
