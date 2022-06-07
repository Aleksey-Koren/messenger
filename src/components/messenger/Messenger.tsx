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
import {AppState} from "../../index";
import {setIsWelcomeModalOpen} from "../../redux/authorization/authorizationActions";
import ErrorPopup from "../error-popup/ErrorPopup";
import {setErrorPopupState} from "../../redux/error-popup/errorPopupActions";
import {SchedulerService} from "../../service/schedulerService";
import {User} from "../../model/user";
import {Builder} from 'builder-pattern';
import {openChatTF, setCurrentChat, setUser} from "../../redux/messenger/messengerActions";
import CreateNewPublicButton from "./new-public/CreateNewPublicButton";
import EditUserTitleButton from "./edit-user-title/EditUserTitleButton";
import MessengerModalWindows from "./modal-windows/MessengerModalWindows";
import {LocalStorageService} from "../../service/localStorageService";
import {Chat} from "../../model/chat";
import {Box, ListSubheader, Typography} from "@mui/material";
import PerfectScrollbar from 'react-perfect-scrollbar'


interface LocalStorageUser {
    id: string,
    publicKey: number[],
    privateKey: number[],
    title: string
}

const Messenger: React.FC<TProps> = (props) => {
    const [messageText, setMessageText] = useState<string>('');
    const dispatch = useDispatch();

    useEffect(() => {
        const user = LocalStorageService.retrieveUserFromLocalStorage();
        if (user && !SchedulerService.isSchedulerStarted()) {
            props.setUser(user);
            SchedulerService.startScheduler(dispatch, user);
        } else if(!user) {
            props.setIsWelcomeModalOpen(true)
        }
    });

    return (
        <div className={style.wrapper}>
            <Grid container className={style.chatSection}>
                <Grid item xs={3} className={style.room_container}>
                    <div style={{position: "absolute", width: 'calc(100% - 20px)', padding: 10}}>
                        <MessengerSelect/>
                    </div>
                    <List className={style.room_list}>
                        <PerfectScrollbar>
                            {props.chats?.map(chat => (
                                <ListItemButton key={chat.id} className={style.room_button}
                                                onClick={() => props.openChatTF(chat)}>
                                    <div className={chat.id === props.currentChat?.id ? style.chat_selected : style.chat_unselected}>&nbsp;</div>
                                    <ListItemText>{chat.title}<span className={style.unread_count}>0</span></ListItemText>
                                </ListItemButton>
                            ))}
                        </PerfectScrollbar>
                    </List>
                </Grid>
                <Grid item xs={9} style={{height: '100%'}}>
                    <div style={{display: 'flex', flexDirection: "column", height: '100%'}}>
                        <div className={style.room_title_container}>
                            <Box style={{flex: 1}}>
                                <Typography variant={"h5"} fontWeight={"bold"} align={"center"} style={{padding: '10 0', color: '#fec720'}}>{props.currentChat?.title}</Typography>
                            </Box>
                            <MessengerMenu/>
                        </div>

                        <div style={{flex: 1, overflow: 'hidden', padding: '15px 0'}}>
                            <MessagesList/>
                        </div>
                        <div style={{margin: 'auto 15px 0' , height: 120}}>
                            <MessengerFooter messageText={messageText} setMessageText={setMessageText}/>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <MessengerModalWindows/>
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
    setCurrentChat,
    setErrorPopupState,
    setUser,
    openChatTF
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Messenger);