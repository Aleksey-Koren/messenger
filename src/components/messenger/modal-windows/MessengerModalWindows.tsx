import WelcomeModal from "../../authorization/welcome-modal/WelcomeModal";
import LoginModal from "../../authorization/login-modal/LoginModal";
import RegistrationModal from "../../authorization/registration/RegistrationModal";
import ParticipantsListModal from "../menu/participants-list/ParticipantsListModal";
import CreateNewRoomModal from "../new-public/CreateNewRoomModal";
import AddUserModal from "../menu/add-users/AddUserModal";
import EditTitleModal from "../menu/edit-room-title/EditRoomTitleModal";
import EditUserTitleModal from "../edit-user-title/EditUserTitleModal";
import React from "react";

function MessengerModalWindows() {

    return (
        <>
            <WelcomeModal/>
            <LoginModal/>
            <RegistrationModal/>
            <ParticipantsListModal/>
            <CreateNewRoomModal/>
            <AddUserModal/>
            <EditTitleModal/>
            <EditUserTitleModal/>
        </>
    )
}

export default MessengerModalWindows;