import Grid from '@mui/material/Grid/Grid';
import List from '@mui/material/List';
import React, {useEffect} from 'react';
import style from './Messenger.module.css'
import {connect, ConnectedProps} from "react-redux";
import MessengerFooter from "./footer/MessengerFooter";
import MessagesList from "./messages/MessagesList";
import ListItemButton from '@mui/material/ListItemButton';
import MessengerMenu from "./menu/MessengerMenu";
import MessengerSelect from "./select/MessengerSelect";
import {AppState} from "../../index";
import {setIsWelcomeModalOpen} from "../../redux/authorization/authorizationActions";
import {connectStompClient, setGlobalUsers, setMessages, setUser} from "../../redux/messenger/messengerActions";
import MessengerModalWindows from "./modal-windows/MessengerModalWindows";
import {Box, Typography} from "@mui/material";
import PerfectScrollbar from 'react-perfect-scrollbar'
import {LocalStorageService} from "../../service/local-data/localStorageService";
import {getLastMessage} from "../../redux/messages-list/messagesListActions";
import {getChatById, getChatsByCustomerId} from "../../redux/chats/chatsActions";
import {Chat} from "../../model/messenger/chat";

const scrollContext: { container: HTMLElement | null, scrolled: boolean, charged: boolean } = {
    container: null,
    scrolled: false,
    charged: false
}

const Messenger: React.FC<TProps> = (props) => {

    useEffect(() => {
        if (LocalStorageService.isLocalStorageExists() && props.user === null) {
            console.log("isLocalStorageExists")
            const data = LocalStorageService.loadDataFromLocalStorage();
            props.connectStompClient(data!.user.id);
            props.setUser(data!.user);
            props.setGlobalUsers(data!.globalUsers);
            props.getChatsByCustomerId(data!.user.id, 0, 0);
            props.setIsWelcomeModalOpen(false);
        }
    }, [props.user]);


    return (
        <div className={style.wrapper}>
            <Grid container className={style.chatSection}>
                <Grid item xs={3} className={style.room_container}>
                    <div style={{position: "absolute", width: 'calc(100% - 20px)', padding: 10}}>
                        <MessengerSelect/>
                    </div>
                    <List className={style.room_list}>
                        <PerfectScrollbar>
                            {renderChats(props.chats, props.chat, props.getChatById)}
                        </PerfectScrollbar>
                    </List>
                </Grid>
                <Grid item xs={9} style={{height: '100%'}}>
                    <div style={{display: 'flex', flexDirection: "column", height: '100%'}}>
                        <div className={style.room_title_container}>
                            <Box style={{flex: 1}}>
                                <Typography color={'primary'} variant={"h5"} fontWeight={"bold"} align={"center"}
                                            style={{
                                                padding: '10 0',
                                            }}>{props.chat !== null ? props.chat.title : ''}
                                </Typography>
                            </Box>
                            <MessengerMenu/>
                        </div>
                        <div>
                            <MessagesList updateScroll={(container) => {
                                scrollContext.scrolled = container.scrollTop + container.offsetHeight + 20 < container.scrollHeight;
                            }}
                                          setScroll={(container) => scrollContext.container = container}
                            />
                        </div>
                        <div style={{margin: 'auto 15px 0', height: 120}}>
                            <MessengerFooter currentChat={props.chat}/>
                        </div>
                    </div>
                </Grid>
            </Grid>
            <MessengerModalWindows/>
        </div>
    );
}

function renderChats(chats: Chat[], currentChat: Chat | null, getChat: (chatId: string) => void) {
    const out = [];
    for (let key in chats) {
        let chat = chats[key];
        out.push(
            <ListItemButton key={chat.id} className={style.room_button}
                            onClick={() => getChat(chat.id)}>
                {
                    currentChat === null ?
                        <div className={style.chat_unselected}>&nbsp;</div>
                        :
                        <div className={chat.id === currentChat.id ? style.chat_selected : style.chat_unselected}>
                            &nbsp;
                        </div>
                }
                <Typography color={'primary'}>
                    {chat.title}
                </Typography>
            </ListItemButton>);
    }
    return out;
}

const mapStateToProps = (state: AppState) => ({
    messages: state.messenger.messages,
    stompClient: state.messenger.stompClient,
    chatParticipants: state.messenger.users,
    user: state.messenger.user,
    chats: state.chats.chats,
    chat: state.chats.chat,
})

const mapDispatchToProps = {
    setIsWelcomeModalOpen,
    connectStompClient,
    setMessages,
    getLastMessage,
    setUser,
    setGlobalUsers,
    getChatsByCustomerId,
    getChatById,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Messenger);