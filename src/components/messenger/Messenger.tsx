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
import {
    connectStompClient,
    fetchMessengerStateTF,
    openChatTF,
    setCurrentChat,
    setGlobalUsers,
    setUser,
} from "../../redux/messenger/messengerActions";
import MessengerModalWindows from "./modal-windows/MessengerModalWindows";
import {Box, Typography} from "@mui/material";
import PerfectScrollbar from 'react-perfect-scrollbar'
import {LocalStorageService} from "../../service/local-data/localStorageService";
import {Chat} from "../../model/messenger/chat";
import {StringIndexArray} from "../../model/stringIndexArray";


const scrollContext: { container: HTMLElement | null, scrolled: boolean, charged: boolean } = {
    container: null,
    scrolled: false,
    charged: false
}

const Messenger: React.FC<TProps> = (props) => {

    useEffect(() => {
        if (LocalStorageService.isLocalStorageExists()) {
            const data = LocalStorageService.loadDataFromLocalStorage();
            props.setUser(data!.user);
            props.connectStompClient(data!.user.id);
            props.setGlobalUsers(data!.globalUsers);
            props.fetchMessengerStateTF(data!.user.id);
            props.setIsWelcomeModalOpen(false);
        }
    }, []);

    const currentChat = props.chats[props.currentChat] || {};

    return (
        <div className={style.wrapper}>
            <Grid container className={style.chatSection}>
                <Grid item xs={3} className={style.room_container}>
                    <div style={{position: "absolute", width: 'calc(100% - 20px)', padding: 10}}>
                        <MessengerSelect/>
                    </div>
                    <List className={style.room_list}>
                        <PerfectScrollbar>
                            {renderChats(props.chats, props.openChatTF, props.currentChat)}
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
                                            }}>{currentChat.title}</Typography>
                            </Box>
                            <MessengerMenu/>
                        </div>

                        <div style={{overflow: 'hidden'}}>
                            <MessagesList updateScroll={(container) => {
                                scrollContext.scrolled = container.scrollTop + container.offsetHeight + 20 < container.scrollHeight;
                            }}
                                          setScroll={(container) => scrollContext.container = container}/>
                        </div>
                        <div style={{margin: 'auto 15px 0', height: 120}}>
                            <MessengerFooter currentChat={props.currentChat}/>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <MessengerModalWindows/>
        </div>
    );
}

function renderChats(chats: StringIndexArray<Chat>, openChatTF: (chatId: string) => void, currentChat: string | null) {
    const out = [];
    for (let key in chats) {
        let chat = chats[key];
        out.push(<ListItemButton key={chat.id} className={style.room_button}
                                 onClick={() => openChatTF(chat.id)}>
            <div
                className={chat.id === currentChat ? style.chat_selected : style.chat_unselected}>&nbsp;</div>
            <Typography color={'primary'}>
                {chat.title} {chat.isUnreadMessagesExist &&
                <span style={{color: "red", fontWeight: "bold", fontSize: "24px"}}>*</span>}
            </Typography>
        </ListItemButton>);
    }
    return out;
}

// function scrollTo(force: boolean) {
//     if (force || !scrollContext.scrolled) {
//         scrollContext.charged = true;
//     }
// }


const mapStateToProps = (state: AppState) => ({
    chats: state.messenger.chats,
    messages: state.messenger.messages,
    currentChat: state.messenger.currentChat || '',
    chatParticipants: state.messenger.users,
    user: state.messenger.user
})

const mapDispatchToProps = {
    setIsWelcomeModalOpen,
    setCurrentChat,
    setUser,
    openChatTF,
    fetchMessengerStateTF,
    setGlobalUsers,
    connectStompClient,
}

const connector = connect(mapStateToProps, mapDispatchToProps);

type TProps = ConnectedProps<typeof connector>;

export default connector(Messenger);