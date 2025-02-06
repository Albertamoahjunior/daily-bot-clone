
interface AddMemberModalProps{
    isOpen: boolean;
    teamId: string;
    onClose: () => void;
    members?: Member [];
}