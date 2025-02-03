
interface IInputTypes{
    labelName: string; 
    inputType: 'text';
    inputValue: string;
    inputPlaceholder: string;
    onInputChange: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

export const TeamInput = ({labelName, inputType,inputValue, inputPlaceholder, onInputChange}: IInputTypes) => {
    
    return (
        <div className="flex flex-col gap-2 mt-4 ">
            <label className="text-black font-medium">
                {labelName}
            </label>
            <input className="transition-all ease-in-out duration-300 focus:shadow-md border-[1px] border-gray-400 p-4 focus:bg-white " type={inputType} placeholder={inputPlaceholder} value={inputValue} onChange={onInputChange}/>
        </div>
    )
}