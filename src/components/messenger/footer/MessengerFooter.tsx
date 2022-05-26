import Grid from "@mui/material/Grid/Grid";
import style from "../Messenger.module.css";
import TextField from "@mui/material/TextField/TextField";
import {IconButton, InputAdornment} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Fab from "@mui/material/Fab/Fab";
import {sendMessage} from "../../../http/webSocket";
import SendIcon from "@mui/icons-material/Send";
import React, {Dispatch, SetStateAction} from "react";
import {MessageEntity} from "../../../model/messenger/message/MessageEntity";
import {retrieveUserId} from "../../../service/authService";
import {useAppSelector} from "../../../index";

interface MessengerFooterProps {
    editedMessage: MessageEntity;
    messageText: string;
    setMessageText: Dispatch<SetStateAction<string>>;
    setEditedMessage: Dispatch<SetStateAction<MessageEntity>>;
}


function MessengerFooter(props: MessengerFooterProps) {
    const selectedRoom = useAppSelector(state => state.messenger.selectedRoom);

    const textFieldInputProps = {
        startAdornment:
            props.editedMessage && (
                <InputAdornment position="start">
                    <IconButton onClick={() => {
                        props.setMessageText('');
                        props.setEditedMessage(null);
                    }}>
                        <CloseIcon style={{color: 'white'}}/>
                    </IconButton>
                </InputAdornment>
            ),
    };

    return (
        <Grid item>
            <Grid container className={style.message_input_container}>
                <Grid item xs={11}>
                    <TextField className={style.message_input_field}
                               InputProps={textFieldInputProps}
                               placeholder="Type your message"
                               fullWidth
                               value={props.messageText}
                               onChange={(event) => props.setMessageText(event.target.value)}
                    />
                </Grid>

                <Grid item xs={1}>
                    <Fab className={style.send_icon} size={"large"}
                         onClick={() => {
                             sendMessage(selectedRoom.id, retrieveUserId(), props.messageText, props.editedMessage);
                             props.setMessageText('');
                             props.setEditedMessage(null);
                         }}
                    >
                        <SendIcon/>
                    </Fab>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default MessengerFooter;