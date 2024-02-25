import { ProgramContext } from '../context/ProgramContext'
import { useContext } from 'react'

export const useProgramContext = () => {
    const context = useContext(ProgramContext);

    if(!context) {
        throw Error('useProgramContext must be used inside an ProgramContextProvider')
    }

    return context;
}