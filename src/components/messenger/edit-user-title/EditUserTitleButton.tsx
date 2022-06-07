import React from "react";
import {useAppDispatch} from "../../../index";
import {setIsEditUserTitleModalOpen} from "../../../redux/messenger-controls/messengerControlsActions";
import IconedButton from "../../button/IconedButton";
import Person from "@mui/icons-material/Person";

function EditUserTitleButton() {
    const dispatch = useAppDispatch();

    return <IconedButton onClick={() => dispatch(setIsEditUserTitleModalOpen(true))}
                         icon={<Person  style={{marginRight: '10px'}} />}
                         text={"Change my name"} />;
}

export default EditUserTitleButton;