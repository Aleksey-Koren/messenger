import WelcomeModal from "../../authorization/welcome-modal/WelcomeModal";
import LoginModal from "../../authorization/login-modal/LoginModal";
import RegistrationModal from "../../authorization/registration/RegistrationModal";
import ParticipantsListModal from "../menu/participants-list/ParticipantsListModal";
import CreateNewRoomModal from "../new-public/CreateNewRoomModal";
import EditTitleModal from "../menu/edit-room-title/EditRoomTitleModal";
import EditUserTitleModal from "../edit-user-title/EditUserTitleModal";
import React from "react";
import {AppState, useAppSelector} from "../../../index";
import {createNewRoomTF} from "../../../redux/messenger-controls/messengerControlsActions";
import {setUserTitle} from "../../../redux/messenger/messengerActions";
import {connect, ConnectedProps} from "react-redux";



function MessengerModalWindows(props:TProps) {

    return (
        <>
            {props.isWelcomeModalOpen && <WelcomeModal/>}
            {props.isLoginModalOpen && <LoginModal/>}
            {props.isRegistrationModalOpen && <RegistrationModal/>}
            {props.isMembersModalOpen && <ParticipantsListModal/>}
            {props.isCreateNewRoomModalOpened && <CreateNewRoomModal/>}
            {props.isEditRoomTitleModalOpen && <EditTitleModal/>}
            {props.isEditUserTitleModalOpen && <EditUserTitleModal/>}
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
})


const connector = connect(mapStateToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(MessengerModalWindows);