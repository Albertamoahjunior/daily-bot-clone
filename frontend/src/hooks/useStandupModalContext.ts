import {useContext} from "react";
import {standupModalContext} from "../contexts/StandupModalContext"

export const useStandupModalContext = () => {
    const context = useContext(standupModalContext);

    if(!context){
        throw Error('useStandupModalContext should be used within the StandupModalContextProvider ')
    }


    return context;
}