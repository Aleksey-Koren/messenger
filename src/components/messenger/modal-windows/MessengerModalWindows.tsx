import WelcomeModal from "../../authorization/welcome-modal/WelcomeModal";
import LoginModal from "../../authorization/login-modal/LoginModal";
import RegistrationModal from "../../authorization/registration/RegistrationModal";
import ParticipantsListModal from "../menu/participants-list/ParticipantsListModal";
import CreateNewRoomModal from "../new-public/CreateNewRoomModal";
import EditTitleModal from "../menu/edit-room-title/EditRoomTitleModal";
import EditUserTitleModal from "../edit-user-title/EditUserTitleModal";
import React from "react";
import {AppState} from "../../../index";
import {connect, ConnectedProps} from "react-redux";
import GlobalUsersListModal from "../edit-global-users/GlobalUsersListModal";
import GlobalUserConfigurationModal from "../edit-global-users/global-user-configuration/GlobalUserConfigurationModal";
import ConfirmModal from "../../confirm-modal/ConfirmModal";
import {
    leaveChatTF,
    setIsLeaveChatConfirmModalOpened
} from "../../../redux/messenger-controls/messengerControlsActions";




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
        </>
    )
}

const mapStateToProps = (state: AppState) => ({
    isWelcomeModalOpen: state.authorizationReducer.isWelcomeModalOpen,
    isRegistrationModalOpen: state.authorizationReducer.isRegistrationModalOpen,
    isMembersModalOpen: state.messengerMenu.isMembersModalOpen,
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