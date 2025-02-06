import { Link } from "react-router-dom";
import { useState } from "react";
import { DeleteModal } from "../components/DeleteModal";
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ITeamProps {
    teamId: string;
    teamName: string;
}

export const TeamCard = ({ teamId, teamName }: ITeamProps) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleDelete = () => {
        console.log('Team deleted');
        // Perform delete logic here
        setModalOpen(false);
    };

    return (
        <div className="items-center rounded-md h-24 px-6 my-2 flex w-full justify-between border-2 border-[#5fb0bc] hover:border-[#1F2937] hover:bg-white hover:text-[#1F2937] text-black hover:shadow-lg hover:shadow-[#5fb0bc]/50 transition-shadow duration-300 ease-in-out">
            <h1 className="text-2xl font-normal uppercase">{teamName}</h1>


            <div className="flex relative items-center">
                <Link to={`edit/${teamId}`} className="mx-2 rounded-lg p-2 px-4 flex hover:text-white hover:bg-black transition duration-500 ease-in-out">

                    Edit Team
                </Link>
                <button onClick={handleOpenModal} className="mx-2 rounded-lg p-1 px-3 border-2 border-black bg-white text-black hover:bg-[#dc966d]">
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
                <div className="relative group">
                    <button className="mx-2 rounded-lg p-1 px-3 border-2 border-black bg-white text-black hover:bg-[#dc966d]">
                        <FontAwesomeIcon icon={faFileExport} />
                    </button>
                    <span className="w-[120px] absolute left-1/2 transform -translate-x-1/2 -translate-y-full mb-2 hidden group-hover:block border border-black bg-gray-100 text-black font-semibold text-xs rounded py-1 px-2" style={{ left: '180%' }}>
                        Generate Team Report
                    </span>
                </div>
            </div>

            {isModalOpen && 
                <DeleteModal
                    isOpen={isModalOpen}
                    title="Delete Item"
                    description="Are you sure you want to delete this item? This action cannot be undone."
                    onClose={handleCloseModal}
                    onConfirm={handleDelete}
                /> 
            }
        </div>
    );
};
