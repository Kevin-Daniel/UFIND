import { createContext, useReducer } from 'react'

export const ProgramContext = createContext()

export const programReducer = (state, action) => {
    switch (action.type) {
        case 'SET_PROGRAM':
            return {
                program: action.payload
            }
        default:
            return state;
    }
}

export const ProgramContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(programReducer, {
        program: null
    })

    return(
        <ProgramContext.Provider value={{...state, dispatch}}>
            { children }
        </ProgramContext.Provider>
    )
}