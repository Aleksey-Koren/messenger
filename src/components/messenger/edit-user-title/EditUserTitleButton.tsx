import style from "../Messenger.module.css";
import React from "react";
import EditIcon from '@mui/icons-material/Edit';
import {useAppDispatch} from "../../../index";
import {setIsEditUserTitleModalOpen} from "../../../redux/messenger-controls/messengerControlsActions";

function EditUserTitleButton() {
    const dispatch = useAppDispatch();

    return (
        <div className={style.controls_button_container}>
            <button className={style.controls_button}
                    onClick={() => dispatch(setIsEditUserTitleModalOpen(true))}
            >

                <div className={style.button_content}>
                    <EditIcon/>
                    <div className={style.button_content_spacer}></div>
                    <span>Edit title</span>
                </div>
            </button>
        </div>
    );
}

export default EditUserTitleButton;