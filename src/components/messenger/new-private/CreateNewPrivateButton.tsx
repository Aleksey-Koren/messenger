
import React from "react";
import {connect, ConnectedProps} from "react-redux";
import style from "../Messenger.module.css";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import {setIsNewPrivateModalOpened} from "../../../redux/messenger-controls/messengerControlsActions";

const CreateNewPrivateButton: React.FC<TProps> = (props) => {

    return (
        <div className={style.controls_button_container}>
            <button className={style.controls_button}
                    onClick={() => props.setIsNewPrivateModalOpened(true)}
            >

                <div className={style.button_content}>
                    <PersonAddAlt1Icon/>
                    <div className={style.button_content_spacer}></div>
                    <span>New private room</span>
                </div>
            </button>
        </div>
    )
}

const mapDispatchToProps = {
    setIsNewPrivateModalOpened
}

const connector = connect(null, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(CreateNewPrivateButton);