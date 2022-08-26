import List from "@mui/material/List";
import style from "../Messenger.module.css";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import {AppState} from "../../../index";
import React, {useEffect, useRef, useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {MessageType} from "../../../model/messenger/messageType";
import {Alert, Button, CircularProgress, Paper, Typography} from "@mui/material";
import {
    setIsEditUserTitleModalOpen,
    setIsNewRoomModalOpened
} from "../../../redux/messenger-controls/messengerControlsActions";
import {Message} from "../../../model/messenger/message";
import AttachmentsBlock from "../attachments/AttachmentsBlock";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchNextPageTF, onScrollTF} from "../../../redux/messages-list/messagesListActions";
import {EndMessage} from "./EndMessage";


// function mergeMessages(messages?: Message[]): Message[][] {
//
//     if (!messages) {
//         return [];
//     }
//     const out: Message[][] = [];
//     let current: Message[] | undefined = undefined;
//     for (let i = 0; i < messages.length; i++) {
//         let message = messages[i];
//         if (!current || current[0].sender !== message.sender || current[0].type !== MessageType.whisper || message.type !== MessageType.whisper) {
//             current = []
//             out.push(current);
//         }
//         current.push(message)
//     }
//     return out;
// }

const MessagesList: React.FC<Props> = (props) => {

    const userId = props.user?.id;
    return (
        <>
            {!props.currentChat ?
                <Alert severity="info" style={{margin: 15}}>
                    <Button onClick={() => {
                        props.setIsNewRoomModalOpened(true)
                    }}>Start new chat</Button>
                </Alert> : null}
            <List id={'list'}
                  onScroll={e => props.onScrollTF(e)}
                  className={style.messages_list}
                  style={{height: 680, overflow: 'auto', display: 'flex', flexDirection: 'column-reverse'}}>
                <InfiniteScroll dataLength={props.messages.length}
                                hasMore={props.hasMore}
                                loader={<div style={{margin: '10px 50%'}}><CircularProgress/></div>}
                                next={props.fetchNextPageTF}
                                style={{display: 'flex', flexDirection: 'column-reverse'}}
                                inverse={true}
                                scrollableTarget={"list"}
                                endMessage={<EndMessage/>}
                >
                    {/* This place should start a loop for room messages and create ListItem for each message */}
                    {props.messages.map((message, index) => {
                        return (
                            <ListItem id={'listItem'}
                                      key={message.id} style={{
                                display: 'flex',
                                flexDirection: (message.sender === userId ? 'row-reverse' : 'row'), /* my messages - right, others - left*/
                            }}>
                                {message.type === MessageType.whisper &&
                                <Paper color={"primary"} className={style.message_container}>
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

                                {message.type === MessageType.hello &&
                                <div className={style.system_message}>
                                    <span>Room title has been set to '{message.data}'</span>
                                </div>
                                }
                                {message.type === MessageType.iam &&
                                <div className={style.system_message}>
                                    {userId === message.sender
                                        ? <span>Your name is '{message.data}'. <Button onClick={() => {
                                            props.setIsEditUserTitleModalOpen(true);
                                        }}>Change name</Button></span>
                                        :
                                        <span>User&nbsp;<Uuid data={message.sender}/>&nbsp;now known as '{message.data}'</span>}
                                </div>
                                }
                            </ListItem>
                        )
                    })}
                </InfiniteScroll>
            </List>
        </>
    );
}

function SenderName({title, id}: { title?: string, id: string }) {
    const [showId, setShowId] = useState<boolean>(false);
    return <Button size={"small"}
                   onClick={() => setShowId(!showId)}>{showId ? id : (title ? title : id.substring(0, 5))}</Button>;
}

function Uuid({data}: { data: string }) {
    const [full, setFull] = useState<boolean>(false);
    return <Button size={"small"} onClick={() => setFull(!full)}>{full ? data : data.substring(0, 5)}</Button>;
}

function TimeSince(props: { time?: Date }) {
    const [time, setTime] = useState<string>('');
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(timeSince(props.time!));
        }, 1000);
        setTime(timeSince(props.time!));
        return () => {
            clearInterval(interval);
        }
    }, [setTime, props.time]);
    if (time) {
        return <span>{time} ago</span>
    } else {
        return null;
    }
}

function timeSince(date?: Date) {
    if (!date) {
        return '';
    }
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
    return "minute";
}

// function onScroll(econtainer: ) {
//     if(container.scrollTop + container.offsetHeight + 20 >= container.scrollHeight) {
//         console.log('ON BOTTOM')
//     } else {
//         console.log('OUT OF BOTTOM!!!!!')
//     }
// }

const mapStateToProps = (state: AppState, ownState: { setScroll: (div: HTMLElement | null) => void, updateScroll: (div: HTMLElement) => void, scroll: (force: boolean) => void }) => ({
    messages: state.messenger.messages,
    chatParticipants: state.messenger.users,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat,
    hasMore: state.messagesList.hasMore
})

const mapDispatchToProps = {
    setIsNewRoomModalOpened,
    setIsEditUserTitleModalOpen,
    fetchNextPageTF,
    onScrollTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(MessagesList);