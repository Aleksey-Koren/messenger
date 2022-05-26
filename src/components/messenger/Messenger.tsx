import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Paper from '@mui/material/Paper/Paper';
import React, {useEffect, useRef, useState} from 'react';
import style from './Messenger.module.css'
import {AppState, useAppDispatch} from "../../index";
import {connect, ConnectedProps} from "react-redux";
import {MessageEntity} from "../../model/messenger/message/MessageEntity";
import {messengerInitializationTF, openRoomTF, setIsNewRoomModalOpened} from "../../redux/messenger/messengerActions";
import {retrieveUserId} from "../../service/authService";
import MessengerFooter from "./footer/MessengerFooter";
import MessagesList from "./messages/MessagesList";
import ListItemButton from '@mui/material/ListItemButton';
import {MessengerService} from "../../service/messenger/MessengerService";
import MessengerMenu from "./menu/MessengerMenu";
import EditTitleModal from "./menu/edit-title/EditTitleModal";
import AddUsersModal from "./menu/add-users/AddUsersModal";
import MessengerSelect from "./select/MessengerSelect";
import ParticipantsListModal from "./menu/participants-list/ParticipantsListModal";
import CreateNewRoomModal from "./new-room-modal/CreateNewRoomModal";
import CreateRoomButton from "./new-room-modal/CreateRoomButton";
import TitleAlreadyExistsModal from "./new-room-modal/TitleAlreadyExistsModal";


const Messenger: React.FC<TProps> = (props) => {
    const [messageText, setMessageText] = useState<string>('');
    const [editedMessage, setEditedMessage] = useState<MessageEntity>(null);
    const dispatch = useAppDispatch();
    const currentUserId = retrieveUserId();

    const ref = useRef(null);

    useEffect(() => {
        props.messengerInitializationTF();
    }, [props.messengerInitializationTF]);

    useEffect(() => {
        const element = document.getElementById('list');
        element.scrollTop = element.scrollHeight;
        MessengerService.retrieveRoomTitle(props.selectedRoom)
    }, [props.messages]);


    return (
        <div className={style.wrapper} ref={ref}>
            <Grid container component={Paper} className={style.chatSection}>
                <Grid item xs={3} className={style.room_container}>
                    <MessengerSelect/>
                    <Divider/>
                    <List className={style.room_list}>
                        {props.rooms.map(room => (
                            <ListItemButton key={room.id} className={style.room_button} style={{color: props.selectedRoom?.id === room.id && '#60ad60'}}
                                            onClick={() => props.openRoomTF(room)}>
                                <ListItemText className={style.unread_message_text}
                                              style={{visibility: (room.amount === 0 ? "hidden" : "visible")}}>
                                    {room.amount}
                                </ListItemText>
                                <ListItemText>{MessengerService.retrieveRoomTitle(room)}</ListItemText>
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
                <Grid container direction={'column'} item xs={9}>
                    <Grid container item className={style.room_title_container}>
                        <Grid item xs={2.1}>
                            <CreateRoomButton/>
                        </Grid>
                        <Grid item xs={8.9} className={style.room_title}>
                            <strong>{MessengerService.retrieveRoomTitle(props.selectedRoom)}</strong>
                        </Grid>

                        <Grid item xs={1} className={style.room_title}>
                            <MessengerMenu/>
                        </Grid>
                    </Grid>

                    <MessagesList currentUserId={currentUserId}
                                  setEditedMessage={setEditedMessage} setMessageText={setMessageText}/>

                    <MessengerFooter editedMessage={editedMessage} messageText={messageText}
                                     setEditedMessage={setEditedMessage} setMessageText={setMessageText}
                    />

                </Grid>
            </Grid>

            <EditTitleModal/>
            <AddUsersModal/>
            <ParticipantsListModal parentRef={ref}/>
            <CreateNewRoomModal/>
        </div>
    );
}


const mapStateToProps = (state: AppState) => ({
    rooms: state.messenger.rooms,
    messages: state.messenger.messages,
    roomMembers: state.messenger.roomMembers,
    selectedRoom: state.messenger.selectedRoom
})

const mapDispatchToProps = {
    messengerInitializationTF,
    openRoomTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Messenger);