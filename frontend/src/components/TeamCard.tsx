import { Link } from "react-router-dom";
import {useState} from "react";
import { DeleteModal } from "../components/DeleteModal";
import {  faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import {  faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

interface ITeamProps{
    teamId: string;
    teamName: string;
}
{/* <FontAwesomeIcon icon={faEllipsisVertical} /> */}

export const TeamCard = ({teamId, teamName}:ITeamProps) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleDelete = () => {
        console.log('Team deleted');
        // Perform delete logic here
        setModalOpen(false);
    };


    return (
        <div className="items-center rounded-md  h-24 px-6 my-2 flex w-full justify-between border-2 border-[#5fb0bc] hover:border-[#1F2937] hover:bg-white hover:text-[#1F2937] text-black hover:shadow-lg hover:shadow-[#5fb0bc]/50 transition-shadow duration-300 ease-in-out ">
            <h1 className="text-2xl font-normal uppercase">{teamName}</h1>

            <div className="flex">
                <Link to={`edit/${teamId}`} className="mx-2 rounded-lg p-2 px-4 flex hover:text-white hover:bg-black  transition duration-500 ease-in-out">
                    Edit Team
                </Link>
                <button onClick={handleOpenModal}  className="mx-2  rounded-lg p-1 px-3 border-2 border-black  bg-white text-black hover:bg-[#dc966d]">
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
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
    {/* //   <DeleteTeamPage isOpen={isModalOpen} onClose={handleCloseModal} onDelete={handleDelete}/>} */}
        </div>
    )
}