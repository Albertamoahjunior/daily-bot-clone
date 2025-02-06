import {useContext} from "react";
import {teamPollsContext} from "../contexts/PollsContextProvider"

export const usePollsContext = () => {
    const context = useContext(teamPollsContext);

    if(!context){
        throw Error('usePollsContext should be used within the PollsContextProvider ')
    }


    return context;
}