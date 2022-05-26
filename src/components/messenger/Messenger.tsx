import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Paper from '@mui/material/Paper/Paper';
import React, {useEffect, useState} from 'react';
import style from './Messenger.module.css'
import {connect, ConnectedProps} from "react-redux";
import MessengerFooter from "./footer/MessengerFooter";
import MessagesList from "./messages/MessagesList";
import ListItemButton from '@mui/material/ListItemButton';
import MessengerMenu from "./menu/MessengerMenu";
import EditTitleModal from "./menu/edit-title/EditTitleModal";
import AddUsersModal from "./menu/add-users/AddUsersModal";
import MessengerSelect from "./select/MessengerSelect";
import ParticipantsListModal from "./menu/participants-list/ParticipantsListModal";
import CreateNewRoomModal from "./new-room-modal/CreateNewRoomModal";
import CreateRoomButton from "./new-room-modal/CreateRoomButton";


const Messenger: React.FC<TProps> = (props) => {
    const [messageText, setMessageText] = useState<string>('');

    return (
        <div className={style.wrapper}>
            <Grid container component={Paper} className={style.chatSection}>
                <Grid item xs={3} className={style.room_container}>
                    <MessengerSelect/>
                    <Divider/>
                    <List className={style.room_list}>

                        {/* This place should start a loop for rooms and create ListItemButton for each room */}
                        <ListItemButton key={1} className={style.room_button}
                                        style={{color: '#60ad60'}} //color for selected room
                                        onClick={() => {
                                        }}>
                            <ListItemText className={style.unread_message_text}
                                          style={{visibility: (2 - 2 === 1 ? "hidden" : "visible")}}> {/* If amount of unread messages = 0  => hidden */}
                                0
                            </ListItemText>
                            <ListItemText>Room title</ListItemText>
                        </ListItemButton>
                    </List>
                </Grid>
                <Grid container direction={'column'} item xs={9}>
                    <Grid container item className={style.room_title_container}>
                        <Grid item xs={2.1}>
                            <CreateRoomButton/>
                        </Grid>
                        <Grid item xs={8.9} className={style.room_title}>
                            <strong>This place for room title</strong>
                        </Grid>

                        <Grid item xs={1} className={style.room_title}>
                            <MessengerMenu/>
                        </Grid>
                    </Grid>

                    <MessagesList currentUserId={2} setMessageText={setMessageText}/>

                    <MessengerFooter /*editedMessage={{}}*/ messageText={messageText} setMessageText={setMessageText}/>

                </Grid>
            </Grid>

            <EditTitleModal/>
            <AddUsersModal/>
            <ParticipantsListModal/>
            <CreateNewRoomModal/>
        </div>
    );
}


const mapStateToProps = (state: any) => ({})

const mapDispatchToProps = {}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Messenger);