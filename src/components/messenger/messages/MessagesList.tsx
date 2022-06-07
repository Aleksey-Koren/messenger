import Grid from "@mui/material/Grid/Grid";
import List from "@mui/material/List";
import style from "../Messenger.module.css";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import {IconButton} from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import Divider from "@mui/material/Divider";
import {AppState} from "../../../index";
import {Message} from "../../../model/message";
import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {MessageType} from "../../../model/messageType";
import PerfectScrollbar from "react-perfect-scrollbar";


const MessagesList: React.FC<Props> = (props) => {

    const userId = props.user?.id;

    const createEditIcon = (message: Message) => (

        userId === message.sender &&
        <IconButton className={style.message_edit_button} onClick={() => {
        }}>
            <BorderColorIcon fontSize={"small"}/>
        </IconButton>
    );

    return (
        <PerfectScrollbar>
            <List id={'list'}>
                {/* This place should start a loop for room messages and create ListItem for each message */}
                {props.messages?.map(message => (
                    <ListItem key={message.id} style={{display: 'flex', flexDirection: (message.sender === userId ? 'row-reverse' : 'row'), /* my messages - right, others - left*/}}>
                                {message.type === MessageType.whisper &&
                                    <div className={style.message_container} style={{
                                        background: (message.sender === userId ? '#60ad60' : 'grey') // my messages #60ad60, others - grey
                                    }}>
                                        <ListItemText color={'#000'}>
                                            <span className={style.message_info}>
                                                {createEditIcon(message)}
                                                {message.sender !== userId && (props.chatParticipants?.get(message.sender!)?.title || message.sender)}
                                                {message.sender !== userId && <span>&nbsp;|&nbsp;</span>}
                                                {(message.created ? timeSince(new Date(message.created)) + " ago" : 'sending...')}
                                            </span>
                                        </ListItemText>

                                        <ListItemText style={{color: 'black'}} color={'#000'}>
                                            <span className={style.message}>{message.data}</span>
                                        </ListItemText>
                                    </div>
                                }

                                {message.type === MessageType.hello &&
                                    <div className={style.system_message}>
                                        <span>Room title has been set to '{message.data}'</span>
                                    </div>
                                }
                    </ListItem>
                ))}
            </List>
        </PerfectScrollbar>
    );
}


function timeSince(date:Date) {

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}

const mapStateToProps = (state: AppState) => ({
    messages: state.messenger.messages,
    chatParticipants: state.messenger.users,
    user: state.messenger.user
})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(MessagesList);