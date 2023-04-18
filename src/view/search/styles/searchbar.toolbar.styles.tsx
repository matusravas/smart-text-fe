import styled, {css} from "styled-components"

export const SearchToolbar = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background-color: #fdfdfd;
  border-radius: 10px;
  padding: 10px 8px;
`

export const MenuButtonWrapper = styled.button`
  padding: 10px;
  outline: none;
  border: 0px ;
  border-radius: 10px;
  background-color: white;
  :hover {
    ${props => !props.disabled && css`
      cursor: pointer;
      filter: brightness(90%);
    `
    }
  }
`

export const MenuItemCheckboxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

export const MenuLabelWrapper = styled.div`
`

export const MenuLabel = styled.p`
  margin: 0px;
`

export const MenuSubLabel = styled.p`
  margin: 0px;
  font-size: 0.7rem;
  color: #909090;
`