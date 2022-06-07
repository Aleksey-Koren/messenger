import Grid from "@mui/material/Grid/Grid";
import style from "../Messenger.module.css";
import TextField from "@mui/material/TextField/TextField";
import Fab from "@mui/material/Fab/Fab";
import SendIcon from "@mui/icons-material/Send";
import React, {Dispatch, SetStateAction} from "react";
import {useDispatch} from "react-redux";
import {sendMessage} from "../../../redux/messenger/messengerActions";
import PerfectScrollbar from "react-perfect-scrollbar";


interface MessengerFooterProps {
    messageText: string;
    setMessageText: Dispatch<SetStateAction<string>>;
}


function MessengerFooter(props: MessengerFooterProps) {
    const dispatch = useDispatch();

    return (
        <div style={{display: "flex", height: 110, paddingBottom: 10, flexDirection: "row", alignItems: "center", borderTop: '1px solid #fec720'}}>
            <PerfectScrollbar style={{height: 110, flex: 1}}>
                <TextField placeholder="Type your message"
                           fullWidth
                           minRows={4}
                           variant="standard"
                           multiline={true}
                           value={props.messageText}
                           onChange={(event) => props.setMessageText(event.target.value)}
                />
            </PerfectScrollbar>
            {<Fab className={style.send_icon} size={"large"}
                     onClick={() => {
                         dispatch(sendMessage(props.messageText));
                         props.setMessageText('');
                         // props.setEditedMessage(null);
                     }}
                >
                    <SendIcon/>
                </Fab>}
        </div>
    );
}

export default MessengerFooter;