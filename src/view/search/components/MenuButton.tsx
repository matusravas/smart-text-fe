import { CircularProgress, Menu, MenuItem } from '@material-ui/core';
import { CSSProperties, useState } from "react";
import { MenuButtonWrapper } from '../styles/searchbar.toolbar.styles';

export interface MenuOption {
    label: string,
    value: string,
}

type MenuButtonProps = {
    options?: MenuOption[]
    onSelected: (value: MenuOption) => void
    value: string
    optionsFetcher?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<MenuOption[]>
    onError?: (errMsg: string) => void
    title?: string
    label?: string
    disabled?: boolean
    visible?: boolean
    titleItem?: boolean
    buttonStyles?: CSSProperties
    menuStyles?: CSSProperties
}


export const MenuButton = ({ onSelected, optionsFetcher, onError, ...props }: MenuButtonProps) => {
    const title = props.title ? props.title.toString().toLowerCase() : 'item'
    const label = props.label !== undefined ? props.label : props.value
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState(props.options || []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const e = {...event}
        if (optionsFetcher) {
            setLoading(true)
            optionsFetcher(e)
                .then(res => {
                    setOptions(res)
                })
                .catch(err => {
                    setOptions([])
                    onError && onError('Failed obtaining menu items')
                })
                .finally(() => {
                    setLoading(false)
                    setAnchorEl(e.currentTarget);
                })
        }
        else setAnchorEl(event.currentTarget)
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (option: MenuOption) => {
        setAnchorEl(null);
        props.value !== option.value && onSelected(option)
    };

    return (
        <>
            <MenuButtonWrapper
                disabled={loading || props.disabled}
                style={{ ...props.buttonStyles, ...(props.visible === false && { display: 'none' }) }}
                aria-controls={`${title}-menu`}
                aria-haspopup="true"
                onClick={handleClick}
            >
                {loading 
                    ? <CircularProgress size={22} style={{ color: '#1AB5F1' }} /> 
                    : <span style={{ fontWeight: 'bolder' }}>{label}</span>
                }
            </MenuButtonWrapper>
            <Menu
                id={`${title}-menu`}
                anchorEl={anchorEl}
                style={{ ...props.menuStyles }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {props.titleItem && <MenuItem disabled value={''}>
                    {`Select ${title}`}
                </MenuItem>}
                {options.map(option => (
                    <MenuItem key={option.value} value={option.value} onClick={() => handleMenuItemClick(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
}