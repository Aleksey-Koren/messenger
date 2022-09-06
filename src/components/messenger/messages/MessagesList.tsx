import List from "@mui/material/List";
import style from "../Messenger.module.css";
import {AppState} from "../../../index";
import React, {useEffect, useRef, useState} from "react";
import {connect, ConnectedProps} from "react-redux";
import {Alert, Button, CircularProgress} from "@mui/material";
import {
    setIsEditUserTitleModalOpen,
    setIsNewRoomModalOpened
} from "../../../redux/messenger-controls/messengerControlsActions";
import InfiniteScroll from "react-infinite-scroll-component";
import {fetchNextPageTF, onScrollTF} from "../../../redux/messages-list/messagesListActions";
import {EndMessage} from "./EndMessage";
import {MessagesListService} from "../../../service/messenger/messagesListService";
import ScrollToUnreadButton from "./ScrollToUnreadButton";
import MessageItem from "./message-item/MessageItem";
import {UnreadDelimiter} from "./message-item/util-components";


const MessagesList: React.FC<Props> = (props) => {

    const scrollRef = useRef<HTMLUListElement | null>(null);
    const lastReadUuid = props.lastRead ? props.lastRead.split(':')[0] : null;
    const messages = props.messages;
    const areUnreadMessagesExist = MessagesListService.areUnreadMessagesExist(lastReadUuid, messages);
    let unreadQuantity = 0;

    console.log('!!!Render ' + areUnreadMessagesExist);

    return (
        <>
            {!props.currentChat ?
                <Alert severity="info" style={{margin: 15}}>
                    <Button onClick={() => {
                        props.setIsNewRoomModalOpened(true)
                    }}>Start new chat</Button>
                </Alert> : null}
            <List id={'list'}
                  ref={scrollRef}
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
                    {/* This place should start a loop for room messages and create Message for each message */}
                    {messages.map((message, index) => {
                        if (MessagesListService.isMessageLastRead(message.id!, lastReadUuid) && areUnreadMessagesExist) {
                            unreadQuantity = index;
                            return <div id={MessagesListService.mapMessageToHTMLId(message)} key={message.id}>
                                <MessageItem message={message}/>
                                <UnreadDelimiter/>
                            </div>
                        } else {
                            return <MessageItem message={message}/>
                        }
                    })}

                </InfiniteScroll>
            </List>
            {areUnreadMessagesExist &&
            <ScrollToUnreadButton unreadQuantity={unreadQuantity} scrollRef={scrollRef.current}/>
            }
        </>
    );
}

const mapStateToProps = (state: AppState, ownState: { setScroll: (div: HTMLElement | null) => void, updateScroll: (div: HTMLElement) => void }) => ({
    setScrollRef: ownState.setScroll,
    messages: state.messenger.messages,
    chatParticipants: state.messenger.users,
    user: state.messenger.user,
    currentChat: state.messenger.currentChat,
    hasMore: state.messagesList.hasMore,
    lastRead: state.messagesList.lastRead
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