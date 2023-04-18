import { Checkbox, CircularProgress, Menu, MenuItem } from '@material-ui/core';
import { CSSProperties, useState } from "react";
import { MenuButtonWrapper, MenuItemCheckboxWrapper, MenuLabel, MenuLabelWrapper, MenuSubLabel } from '../styles/searchbar.toolbar.styles';

export type MenuOption = {
    label: string,
    value: string,
    subLabel?: string
}

export type MenuCheckboxOption = {
    checked: boolean
} & MenuOption


type MenuButtonCheckboxDynamic = {
    options?: MenuCheckboxOption[]
    checkedOptions: MenuCheckboxOption[]
    optionsFetcher?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<MenuCheckboxOption[]>
    onOptionsFetched?: (options: MenuCheckboxOption[]) => void
}

type MenuButtonCheckboxStatic = {
    options: MenuCheckboxOption[]
}

type MenuButtonDynamic = {
    options?: MenuOption[]
    optionsFetcher?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<MenuOption[]>
    onOptionsFetched?: (options: MenuOption[]) => void
}

type MenuButtonStatic = {
    options: MenuOption[]
}

type MenuButtonCheckbox = {
    checkbox: true
    onChecked: (value: MenuCheckboxOption) => void
} & (MenuButtonCheckboxDynamic | MenuButtonCheckboxStatic)

type MenuButtonRadio = {
    checkbox?: false
    onSelected: (value: MenuOption) => void
} & (MenuButtonDynamic | MenuButtonStatic)



type MenuButtonProps = {
    value: string
    onError?: (errMsg: string) => void
    title?: string
    label?: string
    disabled?: boolean
    visible?: boolean
    titleItem?: boolean
    buttonStyles?: CSSProperties
    menuStyles?: CSSProperties
} & (MenuButtonRadio | MenuButtonCheckbox)


export const MenuButton = ({ optionsFetcher, onError, ...props }: MenuButtonProps) => {
    const title = props.title ? props.title.toString().toLowerCase() : 'item'
    const label = props.label !== undefined ? props.label : props.value
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [loading, setLoading] = useState(false);
    const [options, setOptions] = useState<(MenuOption | MenuCheckboxOption)[]>(props.options || []);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault()
        const e = { ...event }
        if (optionsFetcher) {
            setLoading(true)
            optionsFetcher(e)
                .then(res => {
                    setOptions(res)
                    props.onOptionsFetched && props.onOptionsFetched(res)
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

    const handleMenuItemSelected = (option: MenuOption) => {
        setAnchorEl(null);
        props.value !== option.value && !props.checkbox && props.onSelected(option)
    };

    const handleMenuItemChecked = (option: MenuCheckboxOption) => {
        props.checkbox && props.onChecked(option)
    };

    // const handleMenuItemChecked = (checked: boolean, value: string) => {
    //     // setAnchorEl(anchorEl)
    //     let checkedItems = [...checkedOptions]
    //     if(checked) {
    //         checkedItems.push(value)
    //     } else {
    //         const index = checkedItems.indexOf(value)
    //         if (index !== -1) checkedItems.splice(index)
    //     }
    //     setCheckedOptions(checkedItems)
    // };

    const renderCheckboxMenuItems = () => {
        return (
            props.checkbox && options.map(option => {
                return (
                    <MenuItem key={option.value} value={option.value} onClick={() => { props.onChecked(option) }}>
                        <MenuItemCheckboxWrapper>
                            <MenuLabelWrapper>
                                <MenuLabel>{option.label}</MenuLabel>
                                {option.subLabel && <MenuSubLabel>{option.subLabel}</MenuSubLabel>}
                            </MenuLabelWrapper>
                            <Checkbox checked={option.checked} style={{marginLeft: '10px' }} />
                        </MenuItemCheckboxWrapper>
                    </MenuItem>
                )
            })
        )
    }

    const renderMenuItems = () => {
        return (
            !props.checkbox && options.map(option => {
                return (
                    <MenuItem key={option.value} value={option.value} onClick={() => handleMenuItemSelected(option)}>
                        <MenuLabelWrapper>
                            <MenuLabel>{option.label}</MenuLabel>
                            {option.subLabel && <MenuSubLabel>{option.subLabel}</MenuSubLabel>}
                        </MenuLabelWrapper>
                    </MenuItem>
                )
            })
        )
    }

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
                PaperProps={{
                    style: {
                        minWidth: 'fit-content'
                    }
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                {props.titleItem && <MenuItem disabled value={''}>
                    {`Select ${title}`}
                </MenuItem>}
                {
                    props.checkbox
                        ? renderCheckboxMenuItems()
                        : renderMenuItems()
                }
            </Menu>
        </>
    );
}