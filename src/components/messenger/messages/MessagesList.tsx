import Grid from "@mui/material/Grid/Grid";
import List from "@mui/material/List";
import style from "../Messenger.module.css";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import {IconButton} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Divider from "@mui/material/Divider";
import React, {Dispatch, SetStateAction} from "react";
import {useAppSelector} from "../../../index";
import {MessageEntity} from "../../../model/messenger/message/MessageEntity";
import {MessengerService} from "../../../service/messenger/MessengerService";
import {MessageType} from "../../../model/messenger/message/MessageType";

interface MessagesListProps {
    currentUserId: number;
    setEditedMessage: Dispatch<SetStateAction<MessageEntity>>;
    setMessageText: Dispatch<SetStateAction<string>>;
}

function MessagesList(props: MessagesListProps) {
    const messages = useAppSelector(state => state.messenger.messages);
    const selectedRoom = useAppSelector(state => state.messenger.selectedRoom);

    const createEditIcon = (message: MessageEntity) => (
        props.currentUserId === message.senderId &&
        <IconButton className={style.message_edit_button}
                    onClick={() => {
                        props.setEditedMessage(message);
                        props.setMessageText(message.message)
                    }}>
            <BorderColorIcon fontSize={"small"}/>
        </IconButton>
    );

    return (
        <Grid item>
            <List className={style.message_list} id={'list'}>
                {messages.get(selectedRoom?.id)?.map(message => (
                    <ListItem key={message.id}>
                        <Grid container>
                            <Grid item xs={12}>
                                {message.messageType === MessageType.CHAT &&
                                    <div className={style.message_container} style={{
                                        float: (message.senderId === props.currentUserId ? 'right' : 'left'),
                                        background: (message.senderId === props.currentUserId ? '#60ad60' : 'grey')
                                    }}>
                                        <ListItemText>
                                    <span className={style.message_info}>
                                        {createEditIcon(message)}
                                        {MessengerService.generateMessageInfo(message)}
                                    </span>
                                        </ListItemText>

                                        <ListItemText>
                                            <span className={style.message}>{message.message}</span>
                                        </ListItemText>
                                    </div>
                                }

                                {message.messageType === MessageType.SYSTEM &&
                                    <div className={style.system_message}>
                                        <span>{message.message}</span>
                                    </div>
                                }
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>
            <Divider style={{background: '#ecca19'}}/>
        </Grid>
    );
}


export default MessagesList;