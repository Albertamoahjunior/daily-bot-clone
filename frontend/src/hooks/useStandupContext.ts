import {useContext} from "react";
import {standupContext} from "../contexts/StandupsContextProvider"

export const useStandupContext = () => {
    const context = useContext(standupContext);

    if(!context){
        throw Error('useStandupContext should be used within the StandupsContextProvider ')
    }


    return context;
}