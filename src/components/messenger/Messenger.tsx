import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid/Grid';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText/ListItemText';
import Paper from '@mui/material/Paper/Paper';
import React, {useEffect, useState} from 'react';
import style from './Messenger.module.css'
import {connect, ConnectedProps, useDispatch} from "react-redux";
import MessengerFooter from "./footer/MessengerFooter";
import MessagesList from "./messages/MessagesList";
import ListItemButton from '@mui/material/ListItemButton';
import MessengerMenu from "./menu/MessengerMenu";
import MessengerSelect from "./select/MessengerSelect";
import CreateRoomButton from "./new-room-modal/CreateRoomButton";
import WelcomeModal from "../authorization/welcome-modal/WelcomeModal";
import LoginModal from "../authorization/login-modal/LoginModal";
import RegistrationModal from "../authorization/registration/RegistrationModal";
import {AppState} from "../../index";
import {setIsWelcomeModalOpen} from "../../redux/authorization/authorizationActions";
import ErrorPopup from "../error-popup/ErrorPopup";
import {setErrorPopupState} from "../../redux/error-popup/errorPopupActions";
import ParticipantsListModal from "./menu/participants-list/ParticipantsListModal";
import {SchedulerService} from "../../service/schedulerService";
import {User} from "../../model/user";
import {Builder} from 'builder-pattern';
import {setUser} from "../../redux/messenger/messengerActions";
import {LocalStorageUser} from "../../model/localStorageUser";

const Messenger: React.FC<TProps> = (props) => {
    const [messageText, setMessageText] = useState<string>('');
    const dispatch = useDispatch();

    useEffect(() => {
        const localStorageData = localStorage.getItem('whisper');

        if (!!localStorageData && !SchedulerService.isSchedulerStarted()) {
            const parsedLocalStorageData = JSON.parse(localStorageData!) as { user: LocalStorageUser }

            const parsedUser = Builder(User)
                .id(parsedLocalStorageData.user?.id!)
                .publicKey(new Uint8Array(parsedLocalStorageData.user?.publicKey!))
                .privateKey(new Uint8Array(parsedLocalStorageData.user?.privateKey!))
                .title(parsedLocalStorageData.user.title!)
                .build();

            props.setUser(parsedUser);
            SchedulerService.startScheduler(dispatch, parsedUser)

        } else if (!localStorageData) {
            props.setIsWelcomeModalOpen(true)
        }
    }, [props]);

    return (
        <div className={style.wrapper}>
            <Grid container component={Paper} className={style.chatSection}>
                <Grid item xs={3} className={style.room_container}>
                    <MessengerSelect/>
                    <Divider/>
                    <List className={style.room_list}>
                        {props.chats?.map(chat => (
                            <ListItemButton key={chat.id} className={style.room_button}
                                            style={{color: (chat.id === props.currentChat?.id ? '#60ad60' : 'white')}}
                                            onClick={() => {
                                            }}>
                                <ListItemText className={style.unread_message_text}
                                              style={{visibility: "visible"}}>
                                    0
                                </ListItemText>
                                <ListItemText>{chat.title}</ListItemText>
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
                            <strong>{props.currentChat?.title}</strong>
                        </Grid>

                        <Grid item xs={1} className={style.room_title}>
                            <MessengerMenu/>
                        </Grid>
                    </Grid>

                    <MessagesList/>

                    <MessengerFooter messageText={messageText} setMessageText={setMessageText}/>

                </Grid>
            </Grid>

            <WelcomeModal/>
            <LoginModal/>
            <RegistrationModal/>
            <ParticipantsListModal/>
            <ErrorPopup autoHideDuration={5000} handlePopupClose={() => props.setErrorPopupState(false)}/>
        </div>
    );
}


const mapStateToProps = (state: AppState) => ({
    chats: state.messenger.chats,
    messages: state.messenger.messages,
    currentChat: state.messenger.currentChat,
    chatParticipants: state.messenger.users,
    user: state.messenger.user
})

const mapDispatchToProps = {
    setIsWelcomeModalOpen,
    setErrorPopupState,
    setUser
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Messenger);