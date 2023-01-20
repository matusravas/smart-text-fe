import { createRef, useEffect } from "react"
import { Dictionary } from "../../model/dictionary/types"
import { useDictionaryViewModel } from "../../viewmodel/DictionaryViewModel"
import { Card } from "./components/Card"
import { Dialog } from "./components/Dialog"
import SearchBar from "./components/SearchBar"
import { DictionaryWrapper } from "./components/styles/dictionary.dashboard.styles"

function DictionaryDashboard() {
    const { dictionaries, dictionary, searchQuery,
             handleDictionaryChange, handleDictionarySelect, 
             handleSearchQueryChange } = useDictionaryViewModel()
    const ref = createRef<HTMLDivElement>();

    useEffect(() => {
        if (!dictionary) return
        function handleClickOutsideDialog(event: MouseEvent) {
            // console.log(ref)
            // console.log(event.target)
            if (ref.current && ref.current === event.target as Node) {
                // setDialogOpen(false)
                handleDictionarySelect()
            }
        }
        document.body.style.overflow = 'hidden'
        document.addEventListener('mousedown', handleClickOutsideDialog)
        return () => {
            document.body.style.overflow = 'auto'
            document.removeEventListener('mousedown', handleClickOutsideDialog)
        }
    }, [dictionary])

    return (
        <DictionaryWrapper size={dictionaries.length}>
            <SearchBar searchQuery={searchQuery} handleSearchQueryChange={handleSearchQueryChange} />
            {dictionaries.map((item, idx) => (
                <Card key={idx} value={item} onClick={() => handleDictionarySelect(item)} />
            ))}
            {dictionary &&
                <Dialog dictionary={dictionary} ref={ref} handleDictionaryChange={handleDictionaryChange} />
            }
        </DictionaryWrapper>
    )
}

export default DictionaryDashboard