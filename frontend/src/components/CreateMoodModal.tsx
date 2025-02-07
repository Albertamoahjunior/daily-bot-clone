import {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import {TeamInputDropdown } from './TeamDropdownInput';
import { ICreateMoodProps } from '@/types/Mood';
import {useTeamsContext} from '../hooks/useTeamsContext';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Smile, Frown, Meh, Laugh, Angry } from 'lucide-react';
import { toast } from 'react-toastify';
import {moodService} from '../services/api'

interface MoodScoreItem {
    score: number;
    emoji: string;
    label: string;
    comment: string;
    error: string;
    emojiId: string;
  }

export const CreateMoodModal = ({isOpen, onClose}:ICreateMoodProps) => {
    const { teams, members } = useTeamsContext();
    const [allTeamsList, setAllTeamsList] = useState<{ value: string; label: string }[] | undefined>(undefined);
    const [moodQuestion, setMoodQuestion] = useState("");
    const [moodInputFields, setMoodInputFields] = useState<MoodScoreItem[]>([]);
    const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

    const handleScoreChange = (index: number, value: string) => {
        const score = parseInt(value) || 0;
        setMoodInputFields(prevFields => 
            prevFields.map((field, i) => 
                i === index ? { ...field, score, error: '' } : field
            )
        );
    };

    const handleLabelChange = (index: number, value: string) => {
        setMoodInputFields(prevFields => 
            prevFields.map((field, i) => 
                i === index ? { ...field, label: value, error: '' } : field
            )
        );
    };

    const validateMoodInputs = () => {
        let hasErrors = false;
        const updatedMoodInputFields = moodInputFields.map((item) => {
            const newItem = { ...item };

            // Clear previous errors
            newItem.error = "";

            // Check for empty fields
            if (!newItem.score || newItem.score === 0) {
                newItem.error = "Score is required.";
                hasErrors = true;
            } else if (!newItem.label.trim()) {
                newItem.error = "Label is required.";
                hasErrors = true;
            }

            return newItem;
        });

        // Calculate total score
        const totalScore = updatedMoodInputFields.reduce((sum, item) => sum + (item.score || 0), 0);
        if (totalScore > 10 || totalScore < 10) {
            toast.error('All scores must add up to 10');
            hasErrors = true;
        }

        setMoodInputFields(updatedMoodInputFields);
        return !hasErrors;
    };

    //create mood over here....
    const createMoodCheckIn = async ( ) => {
        if(moodInputFields && moodInputFields.length < 3){
            toast.error("Choose At Least Three Emojis");
            return
        }


        if(!validateMoodInputs()){
            toast.error("Your Form Has Errors");
            return;
        }

        //mood data
        // Gather data in one object
        const moodData = {
            selectedTeam,
            question: moodQuestion,
            selectedEmojiIds: selectedEmojis, // Emoji names or IDs
            moodResponses: moodInputFields.map(item => ({
                emoji: item.emojiId, 
                score: item.score,
                moodLabel: item.label
            }))
        };


        const individualMoodObjects = moodData.moodResponses.map(response => ({
            teamId: moodData.selectedTeam,
            mood: moodData.question,
            emojiId: response.emoji,
            moodScore: response.score,
            description: response.moodLabel
          }));

        //run submit functionality here/api call
          const moodCreated = await moodService.createMood(individualMoodObjects)
          if(moodCreated){
            onClose();
          }
        
    }

    const removeEmoji = (emoji:string) => {
        setSelectedEmojis((prevEmojis) => {
            if (prevEmojis.includes(emoji)) {
                return prevEmojis.filter((prevEmoji) => prevEmoji !== emoji);
            }
            return prevEmojis;
        });
        setMoodInputFields((prevMoodFields) => prevMoodFields.filter((moodField) => moodField.comment !== emoji ));

    }

    const handleEmojiClick = (emoji: string) => {
        setSelectedEmojis((prevEmojis) => {
            if (!prevEmojis.includes(emoji)) {
              return [...prevEmojis, emoji];
            }
            return prevEmojis;
        });

        switch(emoji){
            case "Excited": 
                setMoodInputFields((prevFields) => [...prevFields, {emoji: '😄', score: 0, label: "", comment:"Excited", error: "", emojiId: "001" }])
                break;
            case "Sad": 
                setMoodInputFields((prevFields) => [...prevFields, {emoji: '🙁', score: 0, label: "", comment:"Sad", error: "", emojiId: "002" }])
                break;
            case "Smile": 
                setMoodInputFields((prevFields) => [...prevFields, {emoji: '🙂', score: 0, label: "", comment:"Smile", error: "", emojiId: "003" }])
                break;
            case "Meh": 
                setMoodInputFields((prevFields) => [...prevFields, {emoji: '😐', score: 0, label: "", comment:"Meh", error: "", emojiId: "004" }])
                break;
            case "Angry": 
                setMoodInputFields((prevFields) => [...prevFields, {emoji: '😡', score: 0, label: "", comment:"Angry", error: "", emojiId: "005" }])
                break;
            default:
                break;
        }
    }


    // Populate teamsList
    useEffect(() => {
        setAllTeamsList(
            teams?.map((team) => ({
            value: team.id,
            label: team.teamName,
            }))
        );

    }, [teams]);
      
    
    const [selectedTeam, setSelectedTeam] = useState("");


    const handleTeamSelect = (value: string) => {
        setSelectedTeam(value);
      };
   
    // Function to close the modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    
    if (!isOpen) return null; // Do not render the modal if it's not open

    return (
        <div onClick={handleBackdropClick} className="fixed  inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm ">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[1200px] h-[700px] overflow-scroll relative">
    
                {/* Close Button */}
                <button
                    className="absolute top-7 right-8  text-gray-500 hover:text-black"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faCircleXmark} size={"xl"}/>
                </button>
        
                <div className="w-full items-center text-center justify-center">
                    <h2 className="text-xl font-bold mb-4">Configure Team Modal</h2>
                </div>

                <div className='space-y-8 my-6 mb-8 mx-20'>
                    <TeamInputDropdown
                        inputName="Select a Team"
                        className=""
                        options={allTeamsList}
                        selectedValue={selectedTeam}
                        onOptionChange={handleTeamSelect}
                    />

                    <div className="flex flex-col gap-2 mt-4 ">
                        <label className="text-black font-medium">
                            Question
                        </label>
                        <input className="transition-all ease-in-out duration-300 focus:shadow-md border-[1px] border-gray-400 p-4 focus:bg-white " 
                        type="text" placeholder="Enter your Mood question" value={moodQuestion} onChange={(e:React.ChangeEvent<HTMLInputElement> ) => {setMoodQuestion(e.target.value)}}/>
                    </div>

                    <div className="flex flex-col gap-2 mt-4 ">
                        <label className="text-black font-medium">
                            Mood Score Scale
                        </label>
                        {/* <div className='justify-start flex w-full'> */}
                            <div className='border border-black rounded-lg p-3 bg-gray-100 w-full text-black text-xl'>1-10</div>
                        {/* </div> */}
                        
                    </div>

                    <div className="flex flex-col gap-2 mt-4 ">
                        <label className="text-black font-medium">
                            Select Emoji To Represent Mood
                        </label>
                        <div className='mx-auto px-20 flex justify-between rounded-lg border-gray-700 border-2  bg-gray-100 h-30 w-full items-center'>
                            {/* <Smile onClick={() => {selectedEmojis.includes("Smile")? removeEmoji("Smile"): handleEmojiClick("Smile") }} className={`${selectedEmojis.includes("Smile") && 'text-yellow-500'} h-10 w-10 hover:text-yellow-500 transition-colors duration-300`} />
                            <Frown onClick={() => {selectedEmojis.includes("Sad")? removeEmoji("Sad"):handleEmojiClick("Sad")}} className={`${selectedEmojis.includes("Sad") && 'text-red-500'} h-10 w-10 hover:text-red-500 transition-colors duration-300`} />
                            <Meh onClick={() => {selectedEmojis.includes("Meh")? removeEmoji("Meh"):handleEmojiClick("Meh")}} className={`${selectedEmojis.includes("Meh") && 'text-gray-500'} h-10 w-10 hover:text-gray-500 transition-colors duration-300`} />
                            <Laugh onClick={() => {selectedEmojis.includes("Excited")? removeEmoji("Excited"):handleEmojiClick("Excited")}} className={`${selectedEmojis.includes("Excited") && 'text-green-500'}  h-10 w-10 hover:text-green-500 transition-colors duration-300`} />
                            <Angry onClick={() => {selectedEmojis.includes("Angry")? removeEmoji("Angry"):handleEmojiClick("Angry")}} className={`${selectedEmojis.includes("Angry") && 'text-orange-500'} h-10 w-10 hover:text-orange-500 transition-colors duration-300`} /> */}
                            <Smile onClick={() => {selectedEmojis.includes("Smile")? removeEmoji("Smile"): handleEmojiClick("Smile") }} className={`${selectedEmojis.includes("Smile") && 'text-yellow-500'} h-10 w-10 hover:text-yellow-500 transition-colors duration-300`} />
                            <Frown onClick={() => {selectedEmojis.includes("Sad")? removeEmoji("Sad"):handleEmojiClick("Sad")}} className={`${selectedEmojis.includes("Sad") && 'text-red-500'} h-10 w-10 hover:text-red-500 transition-colors duration-300`} />
                            <Meh onClick={() => {selectedEmojis.includes("Meh")? removeEmoji("Meh"):handleEmojiClick("Meh")}} className={`${selectedEmojis.includes("Meh") && 'text-gray-500'} h-10 w-10 hover:text-gray-500 transition-colors duration-300`} />
                            <Laugh onClick={() => {selectedEmojis.includes("Excited")? removeEmoji("Excited"):handleEmojiClick("Excited")}} className={`${selectedEmojis.includes("Excited") && 'text-green-500'}  h-10 w-10 hover:text-green-500 transition-colors duration-300`} />
                            <Angry onClick={() => {selectedEmojis.includes("Angry")? removeEmoji("Angry"):handleEmojiClick("Angry")}} className={`${selectedEmojis.includes("Angry") && 'text-orange-500'} h-10 w-10 hover:text-orange-500 transition-colors duration-300`} />
                        </div>
                    </div>


                    <div className="space-y-8 w-full  mt-12 ">

                        {moodInputFields.length ? 
                            moodInputFields.map((item, index) => (
                                <div className="flex flex-col"> 
                                    <div key={index} className="flex items-center justify-between border rounded-sm p-4">
                                        <div className="flex justify-between items-center w-full gap-10">
                                            <div className="flex gap-2 items-center">
                                                <span className="text-2xl">{item.emoji}</span>
                                                <span className="text-base text-gray-400">{item.comment}</span>
                                            </div>
                                            
                                            <input placeholder='Enter score' type='number' min='0' max='10' 
                                            onChange={(e) => handleScoreChange(index, e.target.value)}
                                            className="w-80 items-center border rounded-md p-2 placeholder:text-gray-500 text-black "/>
                                            
                                            <input placeholder='Enter Mood Label' type='text' 
                                            onChange={(e) => handleLabelChange(index, e.target.value)}
                                            className=" w-80 items-center border rounded-md p-2 placeholder:text-gray-500 text-black "/>
                                            
                                            <div className="text-center ">        
                                                <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className=' rounded-full hover:bg-red-400 transition-all ease-in-out duration-300'
                                                onClick={() => removeEmoji(item.comment)}
                                                >
                                                    <X className="h-6 w-6" />
                                                </Button>
                                            </div>
                                        </div>
                                        {item.error && <p className="text-red-500 text-sm text-center">{item.error}</p>}
                                    </div>
                                </div>
                            )): <p className='text-gray-400 text-center'>Select an Emoji To Represent The Mood Option For Your Team</p> }

                    </div>


                </div>


        

                <div className="mt-20 w-full flex justify-center">
                    <button onClick={createMoodCheckIn} className='text-white bg-purple-600  hover:bg-purple-700 rounded-lg w-full mx-10 px-6 py-4'>
                        Configure Mood Checkin
                    </button>
                </div>

            </div>
        </div>
    )
}