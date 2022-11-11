import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {setIsNewRoomModalOpened} from "../../../redux/messenger-controls/messengerControlsActions";
import IconedButton from "../../button/IconedButton";
import Chat from '@mui/icons-material/Chat';

const CreateNewPublicButton: React.FC<TProps> = (props) => {
    return <IconedButton icon={<Chat style={{marginRight: '10px'}}/>}
                         text={"New chat"}
                         onClick={() => props.setIsNewRoomModalOpened(true)}/>
}

const mapDispatchToProps = {
    setIsNewRoomModalOpened
}

const connector = connect(null, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(CreateNewPublicButton);