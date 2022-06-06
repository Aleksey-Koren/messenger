import React from "react";
import {connect, ConnectedProps} from "react-redux";
import style from "../Messenger.module.css";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import { setIsNewRoomModalOpened } from "../../../redux/messenger-controls/messengerControlsActions";

const CreateNewPublicButton: React.FC<TProps> = (props) => {

    return (
        <div className={style.controls_button_container}>
            <button className={style.controls_button}
                    onClick={() => props.setIsNewRoomModalOpened(true)}
            >

                <div className={style.button_content}>
                    <GroupAddIcon/>
                    <div className={style.button_content_spacer}></div>
                    <span>New public room</span>
                </div>
            </button>
        </div>
    )
}

const mapDispatchToProps = {
	setIsNewRoomModalOpened
}

const connector = connect(null, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(CreateNewPublicButton);