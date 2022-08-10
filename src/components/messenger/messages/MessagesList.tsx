import List from "@mui/material/List";
import style from "../Messenger.module.css";
import ListItem from "@mui/material/ListItem/ListItem";
import ListItemText from "@mui/material/ListItemText/ListItemText";
import {AppState} from "../../../index";
import React, {useEffect, useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {MessageType} from "../../../model/messenger/messageType";
import PerfectScrollbar from "react-perfect-scrollbar";
import {Alert, Button, Paper, Typography} from "@mui/material";
import {
    setIsEditUserTitleModalOpen,
    setIsNewRoomModalOpened
} from "../../../redux/messenger-controls/messengerControlsActions";
import {Message} from "../../../model/messenger/message";
import AttachmentsBlock from "../attachments/AttachmentsBlock";


function mergeMessages(messages?:Message[]):Message[][] {
    if(!messages) {
        return [];
    }
    const out:Message[][] = [];
    let current:Message[]|undefined = undefined;
    for(let i = 0; i < messages.length; i++) {
        let message = messages[i];
        if(!current || current[0].sender !== message.sender || current[0].type !== MessageType.whisper || message.type !== MessageType.whisper) {
            current = []
            out.push(current);
        }
        current.push(message)
    }
    return out;
}

const MessagesList: React.FC<Props> = (props) => {

    const userId = props.user?.id;

    const message = mergeMessages(props.messages);

    return (
        <PerfectScrollbar onScroll={(e) => {props.updateScroll(e.currentTarget)}} containerRef={container => {
            props.setScroll(container);
            props.scroll(true);
        }}>
            {!props.currentChat ? <Alert severity="info" style={{margin: 15}}>
                <Button onClick={() => {
                    props.setIsNewRoomModalOpened(true)
                }}>Start new chat</Button>
            </Alert> : null}
            <List id={'list'}>
                {/* This place should start a loop for room messages and create ListItem for each message */}
                {message.map(message => {
                    const first = message[0];
                    return (
                    <ListItem key={first.id} style={{display: 'flex', flexDirection: (first.sender === userId ? 'row-reverse' : 'row'), /* my messages - right, others - left*/}}>
                                {first.type === MessageType.whisper &&

                                    <Paper color={"primary"} className={style.message_container}>
                                        <ListItemText>
                                            <Typography color={"primary"} className={style.message_info}>
                                                {/*createEditIcon(message, userId)*/}
                                                {first.sender !== userId && <SenderName title={props.chatParticipants[first.sender!]?.title} id={first.sender}/>}
                                                {first.sender !== userId && <span>&nbsp;|&nbsp;</span>}
                                                <TimeSince time={first.created}/>
                                            </Typography>
                                        </ListItemText>

                                        {/*{first.attachmentsFilenames &&*/}
                                        {/*    <AttachmentsBlock message={first}/>*/}
                                        {/*}*/}

                                        <ListItemText>
                                            {message.map(text =>
                                                <>
                                                    {text.attachmentsFilenames &&
                                                    <AttachmentsBlock message={text}/>
                                                    }
                                                    <Typography color={""}
                                                                className={style.message}>{text.data}</Typography>
                                                </>)}
                                        </ListItemText>
                                    </Paper>
                                }

                                {first.type === MessageType.hello &&
                                    <div className={style.system_message}>
                                        <span>Room title has been set to '{first.data}'</span>
                                    </div>
                                }
                                {first.type === MessageType.iam &&
                                    <div className={style.system_message}>
                                        {userId === first.sender
                                            ? <span>Your name is '{first.data}'. <Button onClick={() => {
                                                props.setIsEditUserTitleModalOpen(true);
                                            }}>Change name</Button></span>
                                            : <span>User&nbsp;<Uuid data={first.sender}/>&nbsp;now known as '{first.data}'</span>}
                                    </div>
                                }
                    </ListItem>
                )})}
            </List>
        </PerfectScrollbar>
    );
}

function SenderName({title, id}:{title?:string, id:string}) {
    const [showId, setShowId] = useState<boolean>(false);
    return <Button size={"small"} onClick={() => setShowId(!showId)}>{showId ? id : (title ? title : id.substring(0, 5))}</Button>;
}
function Uuid({data}:{data:string}) {
    const [full, setFull] = useState<boolean>(false);
    return <Button size={"small"} onClick={() => setFull(!full)}>{full ? data : data.substring(0, 5)}</Button>;
}

function TimeSince(props:{time?:Date}) {
    const [time, setTime] = useState<string>('');
    useEffect(() => {
        const interval = setInterval(() => {
            //@ts-ignore
            setTime(timeSince(props.time));
        }, 1000);
        //@ts-ignore
        setTime(timeSince(props.time));
        return () => {
            clearInterval(interval);
        }
    }, [setTime, props.time]);
    if(time) {
        return <span>{time} ago</span>
    } else {
        return null;
    }
}
function timeSince(time:string|null) {
    if(!time) {
        return '';
    }
    const date = new Date(time);
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

const mapStateToProps = (state: AppState, ownState:{setScroll:(div:HTMLElement|null) => void, updateScroll:(div:HTMLElement) => void, scroll:(force:boolean) => void}) => ({
    messages: state.messenger.messages,
    chatParticipants: state.messenger.users,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat,

    setScroll: ownState.setScroll,
    scroll: ownState.scroll,
    updateScroll: ownState.updateScroll,
})

const mapDispatchToProps = {
    setIsNewRoomModalOpened, setIsEditUserTitleModalOpen
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type Props = ConnectedProps<typeof connector>;

export default connector(MessagesList);