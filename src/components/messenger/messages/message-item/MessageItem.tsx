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

    return <ListItem id={MessagesListService.mapMessageToHTMLId(message)}
                     key={message.id}
                     style={{
                         display: 'flex',
                         flexDirection: (message.sender === userId ? 'row-reverse' : 'row'), /* my messages - right, others - left*/
                     }}>
        {message.type === MessageType.WHISPER &&
            <Paper className={style.message_container} style={{
                minWidth: "40%",
                backgroundColor: "#182533"
            }}>
                <ListItemText>
                    <Typography color={"primary"} className={style.message_info}>
                        <TimeSince time={message.created}/>
                        {message.sender !== userId && <span>&nbsp;|&nbsp;</span>}
                        {message.sender !== userId &&
                            <SenderName title={props.chatParticipants[message.sender!]?.title}
                                        id={message.sender}/>}
                    </Typography>
                </ListItemText>

                <ListItemText>
                    <>
                        {message.attachmentsFilenames && <AttachmentsBlock message={message}/>}
                        <Typography color={""} className={style.message}>{message.data}</Typography>
                        {/*<Typography color={"green"}*/}
                        {/*            className={style.message}>{MessagesListService.mapMessageToHTMLId(message)}</Typography>*/}
                    </>
                </ListItemText>
            </Paper>
        }

        {message.type === MessageType.CHAT &&
            <div className={style.system_message}>
                <span>'{message.data}'</span>
            </div>
        }

        {message.type === MessageType.INVITE_CHAT &&
            <div className={style.system_message}>
                <span>'Member {message.data} invited to the chat'</span>
            </div>
        }

        {message.type === MessageType.LEAVE_CHAT &&
            <div className={style.system_message}>
                <span>'Member {message.data} left the room'</span>
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