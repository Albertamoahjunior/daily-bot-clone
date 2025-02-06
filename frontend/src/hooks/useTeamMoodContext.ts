import {useContext} from "react";
import {teamMoodContext} from "@/contexts/TeamMoodContextProvider";

export const useTeamMoodContext = () => {
    const context = useContext(teamMoodContext);

    if(!context){
        throw Error('useTeamMoodContext should be used within the TeamMoodContextProvider ')
    }


    return context;
}