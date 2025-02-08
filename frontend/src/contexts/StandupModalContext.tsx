import {createContext, useState} from "react";


interface IStandupModalContextProvider {
    children: React.ReactNode;
}

export const standupModalContext = createContext<{
    setTeamId: React.Dispatch<React.SetStateAction<string>>;
    teamId: string;
    selectedTimes: string[],
    selectedOptions: string[],
    selectedTimesError: boolean;
    selectedOptionsError: boolean;
    setSelectedTimesError:  React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedOptionsError:  React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedTimes: React.Dispatch<React.SetStateAction<string[]>>;
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;

} | undefined>(undefined)

const StandupModalContextProvider = ({children}: IStandupModalContextProvider) => {
    const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
    const [selectedTimesError, setSelectedTimesError] = useState<boolean>(false);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
    const [selectedOptionsError, setSelectedOptionsError] = useState<boolean>(false);
    const [teamId, setTeamId] = useState<string>('');
    
    

    return (
        <standupModalContext.Provider value = {{ selectedOptions, selectedTimes,
                                                selectedTimesError, selectedOptionsError, 
                                                setSelectedTimesError, setSelectedOptionsError,
                                                setSelectedOptions, setSelectedTimes,
                                                teamId, setTeamId}}>
            {children}
        </standupModalContext.Provider>
    )

}


export default StandupModalContextProvider;


