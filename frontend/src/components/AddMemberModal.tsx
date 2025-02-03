import {AddMembersTable} from "./AddMembersTable";
import { MembersSearch } from "./MembersSearch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faCircleXmark } from '@fortawesome/free-regular-svg-icons';


export const AddMemberModal: React.FC<AddMemberModalProps> = ({isOpen, teamId, onClose}) => {
    // const [searchValue, setSearchValue] = useState("");

    if (!isOpen) return null; // Do not render the modal if it's not open

    const teams = [
        {
            teamID: "ddsdsd",
            teamName: "sdsd",
            standup: {
                name: "addad",
            }
        },
        {
            teamID: "adadd",
            teamName: "Dev-watch",
            standup: {
                name: "sweew",
            },
        }
    ]

    // Function to close the modal when clicking outside
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (e.target === e.currentTarget) {
        onClose();
        }
    };



    return (
    <div onClick={handleBackdropClick} className="fixed  inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[1200px] h-[700px] relative">

        {/* Close Button */}
        <button
          className="absolute top-7 right-8  text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faCircleXmark} size={"xl"}/>
        </button>

        <div className="w-full items-center text-center justify-center">
            <h2 className="text-xl font-bold mb-4">{teams.find(team => team.teamID === teamId)?.teamName.toUpperCase()} Team Members</h2>
            <p className="text-gray-700 mb-6">2 members</p>
        </div>


        <div className="flex flex-col gap-2 mt-4 mx-20">
            <MembersSearch />
        </div>

        <div className="w-full mt-10 flex justify-center">
            <AddMembersTable />
        </div>

      </div>
    </div>
    )
}