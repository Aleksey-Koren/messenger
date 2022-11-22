import React from "react";
import {AppState} from "../../../../index";
import {connect, ConnectedProps} from "react-redux";
import {MessagesListService} from "../../../../service/messenger/messagesListService";
import {MessageType} from "../../../../model/messenger/messageType";
import {Button, Paper, Typography} from "@mui/material";
import style from "../../Messenger.module.css";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import AttachmentsBlock from "../../attachments/AttachmentsBlock";
import ListItem from "@mui/material/ListItem/ListItem";
import {SenderName, TimeSince, Uuid} from "./util-components";
import {Message} from "../../../../model/messenger/message";
import {setIsEditUserTitleModalOpen} from "../../../../redux/messenger-controls/messengerControlsActions";

interface IOwnProps {
    message: Message;
}

const MessageItem: React.FC<TProps> = (props) => {
    const message = props.message;
    const userId = props.user.id;

    const getChatTitle = (data: string) => {
        const values = data!.split("__");
        values.pop();
        return values.join("__")
    }

    return <ListItem id={MessagesListService.mapMessageToHTMLId(message)}
                     key={message.id}
                     style={{
                         display: 'flex',
                         flexDirection: (message.sender === userId ? 'row-reverse' : 'row')
                     }}>

        {message.type === MessageType.WHISPER &&
            <Paper color={"primary"} className={style.message_container} style={{
                minWidth: "40%",
                //@TODO WARN theme color
                backgroundColor: "#182533"
            }}>
                <ListItemText>
                    <Typography color={"primary"} className={style.message_info}>
                        {message.sender !== userId &&
                            <SenderName title={props.chatParticipants[message.sender!]?.title}
                                        id={message.sender}/>}
                        {message.sender !== userId && <span>&nbsp;|&nbsp;</span>}
                        <TimeSince time={message.created}/>
                    </Typography>
                </ListItemText>

                <ListItemText>
                    <>
                        {message.attachmentsFilenames && <AttachmentsBlock message={message}/>}
                        <Typography color={""} className={style.message}>{message.data}</Typography>
                    </>
                </ListItemText>
            </Paper>
        }

        {message.type === MessageType.HELLO &&
            <div className={style.system_message}>
                <span>Room title has been set to '{getChatTitle(message.data!)}'</span>
            </div>
        }

        {message.type === MessageType.IAM &&
            <div className={style.system_message}>
                {userId === message.sender
                    ? <span>Your name is '{message.data}'. <Button onClick={() => {
                        props.setIsEditUserTitleModalOpen(true);
                    }}>Change</Button></span>
                    :
                    <span>
                    User&nbsp;<Uuid data={message.sender}/>&nbsp;now known as '{message.data}'
                </span>}
            </div>
        }

    </ListItem>
}

function mapStateTpProps(state: AppState, ownProps: IOwnProps) {
    return {
        message: ownProps.message,
        chatParticipants: state.messenger.users,
        user: state.messenger.user!,
    }
}

const mapDispatchToProps = {
    setIsEditUserTitleModalOpen
}

const connector = connect(mapStateTpProps, mapDispatchToProps);
type TProps = ConnectedProps<typeof connector>;
export default connector(MessageItem);