import {MessageDto} from "../../dto/messageDto";
import {Chat} from "../../model/messenger/chat";
import {MessageMapper} from "../../mapper/messageMapper";
import {GlobalUsers} from "../../model/local-storage/localStorageTypes";
import {ChatApi} from "../../api/chatApi";
import {MessageApi} from "../../api/messageApi";
import {MessageType} from "../../model/messenger/messageType";
import {CustomerService} from "./customerService";
import {setUsers} from "../../redux/messenger/messengerActions";
import {AppDispatch, AppState} from "../../index";

export class ChatService {

    static tryDecryptChatsTitles(chats: MessageDto[], globalUsers: GlobalUsers): Chat[] {

        return chats.map<Chat>(chatDto => {
            const sender = globalUsers[chatDto.sender];
            if (sender) {
                const chat = MessageMapper.toEntity(chatDto, sender.user);
                return {
                    id: chat.chat!,
                    title: chat.data!,
                    confirmed: false, //TODO: FLAG DECRYPTED / NON-DECRYPTED??
                    isUnreadMessagesExist: false,
                    lastSeenAt: new Date()
                }
            }
            return {
                id: chatDto.chat!,
                title: chatDto.chat!,
                confirmed: false,
                isUnreadMessagesExist: false,
                lastSeenAt: new Date()
            }
        })
    }

    static processChatParticipants(dispatch: AppDispatch, chatId: string, globalUsers: GlobalUsers, currentUserId: string) {

        return ChatApi.getParticipants(chatId)
            .then((chatParticipants) => {
                return MessageApi.getMessages({
                    receiver: currentUserId,
                    chat: chatId,
                    type: MessageType.iam,
                }).then(s => {
                    return {
                        knownParticipants: s,
                        chatParticipants: chatParticipants
                    }
                })
            }).then(s => {
                const users = CustomerService.processUnknownChatParticipants(s.chatParticipants, s.knownParticipants, chatId, currentUserId);
                CustomerService.updateChatParticipantsCertificates(globalUsers, s.chatParticipants, dispatch);
                dispatch(setUsers(users, chatId));
            });

            // .then((chatParticipants) => {
            //
            //     MessageApi.getMessages({
            //         receiver: currentUserId,
            //         chat: chatId,
            //         type: MessageType.iam,
            //     }).then(knownParticipants => {
            //             const users = CustomerService.processUnknownChatParticipants(chatParticipants, knownParticipants, chatId, currentUserId);
            //             CustomerService.updateChatParticipantsCertificates(globalUsers, chatParticipants, dispatch);
            //             dispatch(setUsers(users, chatId));
            //         })
            // });
    }
}