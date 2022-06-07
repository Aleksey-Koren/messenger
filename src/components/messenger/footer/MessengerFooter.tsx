import Grid from "@mui/material/Grid/Grid";
import style from "../Messenger.module.css";
import TextField from "@mui/material/TextField/TextField";
import Fab from "@mui/material/Fab/Fab";
import SendIcon from "@mui/icons-material/Send";
import React, {Dispatch, SetStateAction} from "react";
import {useDispatch} from "react-redux";
import {sendMessage} from "../../../redux/messenger/messengerActions";


interface MessengerFooterProps {
    messageText: string;
    setMessageText: Dispatch<SetStateAction<string>>;
}


function MessengerFooter(props: MessengerFooterProps) {
    const dispatch = useDispatch();

    return (
        <Grid item>
            <Grid container className={style.message_input_container}>
                <Grid item xs={11}>
                    <TextField className={style.message_input_field}
                        // InputProps={textFieldInputProps}
                               placeholder="Type your message"
                               fullWidth
                               value={props.messageText}
                               onChange={(event) => props.setMessageText(event.target.value)}
                    />
                </Grid>

                <Grid item xs={1}>
                    <Fab className={style.send_icon} size={"large"}
                         onClick={() => {
                             dispatch(sendMessage(props.messageText));
                             props.setMessageText('');
                             // props.setEditedMessage(null);
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