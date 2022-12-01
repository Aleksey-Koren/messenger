import { connect, ConnectedProps } from "react-redux";
import { AppState } from "../../../index";
import {
    leaveChatTF,
    setIsLeaveChatConfirmModalOpened
} from "../../../redux/messenger-controls/messengerControlsActions";
import LoginModal from "../../authorization/login-modal/LoginModal";
import RegistrationModal from "../../authorization/registration/RegistrationModal";
import WelcomeModal from "../../authorization/welcome-modal/WelcomeModal";
import ConfirmModal from "../../confirm-modal/ConfirmModal";
import GlobalUserConfigurationModal from "../edit-global-users/global-user-configuration/GlobalUserConfigurationModal";
import GlobalUsersListModal from "../edit-global-users/GlobalUsersListModal";
import EditUserTitleModal from "../edit-user-title/EditUserTitleModal";
import BotsModal from "../menu/bots/BotsModal";
import EditTitleModal from "../menu/edit-room-title/EditRoomTitleModal";
import ParticipantsListModal from "../menu/participants-list/ParticipantsListModal";
import CreateNewRoomModal from "../new-public/CreateNewRoomModal";


function MessengerModalWindows(props: TProps) {

    return (
        <>
            {props.isWelcomeModalOpen && <WelcomeModal/>}
            {props.isLoginModalOpen && <LoginModal/>}
            {props.isRegistrationModalOpen && <RegistrationModal/>}
            {props.isMembersModalOpen && <ParticipantsListModal/>}
            {props.isCreateNewRoomModalOpened && <CreateNewRoomModal/>}
            {props.isEditRoomTitleModalOpen && <EditTitleModal/>}
            {props.isEditUserTitleModalOpen && <EditUserTitleModal/>}
            {props.isEditGlobalUsersModalOpened && <GlobalUsersListModal/>}
            {props.isGlobalUserConfigurationModalOpen && <GlobalUserConfigurationModal/>}
            {props.isLeaveChatConfirmModalOpened && <ConfirmModal
                confirmFunction={() => props.leaveChatTF()}
                text={"Are you sure that you want to leave chat?"}
                closeFunction={() => props.setIsLeaveChatConfirmModalOpened(false)}
            />}
            {props.isBotsModalOpen && <BotsModal/>}
        </>
    )
}

const mapStateToProps = (state: AppState) => ({
    isWelcomeModalOpen: state.authorizationReducer.isWelcomeModalOpen,
    isRegistrationModalOpen: state.authorizationReducer.isRegistrationModalOpen,
    isMembersModalOpen: state.messengerMenu.isMembersModalOpen,
    isBotsModalOpen: state.messengerMenu.isBotsModalOpen,
    isLoginModalOpen: state.authorizationReducer.isLoginModalOpen,
    isCreateNewRoomModalOpened: state.messengerControls.isCreateNewRoomModalOpened,
    isEditRoomTitleModalOpen: state.messengerMenu.isEditRoomTitleModalOpen,
    isEditUserTitleModalOpen: state.messengerControls.isEditUserTitleModalOpen,
    isEditGlobalUsersModalOpened: state.messengerMenu.isEditGlobalUsersModalOpened,
    isGlobalUserConfigurationModalOpen: state.messengerControls.globalUserConfigurationState.isGlobalUserConfigurationModalOpen,
    isLeaveChatConfirmModalOpened: state.messengerControls.isLeaveChatConfirmModalOpened
})

const mapDispatchToProps = {
    setIsLeaveChatConfirmModalOpened,
    leaveChatTF
}


const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(MessengerModalWindows);