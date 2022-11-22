import {MessageDto} from "../../dto/messageDto";
import {Chat} from "../../model/messenger/chat";
import {MessageMapper} from "../../mapper/messageMapper";
import {ChatApi} from "../../api/chatApi";
import {MessageApi} from "../../api/messageApi";
import {MessageType} from "../../model/messenger/messageType";
import {CustomerService} from "./customerService";
import {AppDispatch, AppState} from "../../index";
import {StringIndexArray} from "../../model/stringIndexArray";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {LocalStorageService} from "../local-data/localStorageService";
import Notification from "../../Notification";

export class ChatService {

    static async tryDecryptChatsTitles(chats: MessageDto[], globalUsers: StringIndexArray<GlobalUser>) {
        const chatsLastSeen = LocalStorageService.chatsLastSeenFromLocalStorage() || {};

        return await Promise.all(chats.map<Promise<Chat>>(async chatDto => {
            const sender = globalUsers[chatDto.sender];
            if (sender) {
                const chat = await MessageMapper.toEntity(chatDto, sender.userId);
                const values = chat.data!.split("__");
                const keyAES = values.pop() || "";
                const title = values.join("__");

                return {
                    id: chat.chat!,
                    title: title,
                    isUnreadMessagesExist: chatsLastSeen[chat.chat] ? chatsLastSeen[chat.chat] < new Date(chatDto.created!) : false,
                    lastSeenAt: chatsLastSeen[chat.chat] ? chatsLastSeen[chat.chat] : new Date(),
                    keyAES: keyAES,
                }
            }
            const values = chatDto.data!.split("__");
            const keyAES = values.pop() || "";
            const title = values.join("__");

            return {
                id: chatDto.chat!,
                title: title,
                isUnreadMessagesExist: false,
                lastSeenAt: new Date(),
                keyAES: keyAES,
            }
        }))
    }

    static processChatParticipants(dispatch: AppDispatch, chatId: string, globalUsers: StringIndexArray<GlobalUser>, currentUserId: string, getState: () => AppState) {
        return ChatApi.getParticipants(chatId)
            .then((chatParticipants) => {
                return MessageApi.getMessages({
                    receiver: currentUserId,
                    chat: chatId,
                    type: MessageType.IAM,
                }).then(s => {
                    return {
                        knownParticipants: s,
                        chatParticipants: chatParticipants
                    }
                })
                    .catch(() => {
                        return {
                            knownParticipants: [],
                            chatParticipants: []
                        }
                    })
            }).then(s => {
                CustomerService.processUnknownChatParticipants(s?.chatParticipants, s?.knownParticipants, chatId, currentUserId, dispatch, getState);
                CustomerService.updateChatParticipantsCertificates(globalUsers, s.chatParticipants, dispatch);
            }).catch(error => {
                Notification.add({
                    message: `Error to get participants: ${error.response.data.message}`,
                    severity: "error"
                });
            });

    }
}