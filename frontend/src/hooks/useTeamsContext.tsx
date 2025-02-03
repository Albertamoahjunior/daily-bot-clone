import {useContext} from "react";
import {teamsContext} from "../contexts/TeamsContextProvider"

export const useTeamsContext = () => {
    const context = useContext(teamsContext);

    if(!context){
        throw Error('useTeamsContext should be used within the TeamsContextProvider ')
    }


    return context;
}