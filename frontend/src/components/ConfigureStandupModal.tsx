//import {useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircleXmark } from '@fortawesome/free-regular-svg-icons';

import {StandupForm} from './StandupForm';
import StandupModalContextProvider from '@/contexts/StandupModalContext'



export const ConfigureStandupModal = ({isOpen, onClose, teamId}:ICreateTeamProps) => {

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
                    <h2 className="text-xl font-bold mb-4">Create New Standup Question</h2>
                </div>

                <div className="mt-10 mx-20">
                <StandupModalContextProvider>
                 <StandupForm teamId={teamId? teamId : undefined}/>
                </StandupModalContextProvider>
                </div>

            </div>
        </div>
    )
}