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

export class ChatService {

    //!!!
    static async tryDecryptChatsTitles(chats: MessageDto[], globalUsers: StringIndexArray<GlobalUser>) {
        const chatsLastSeen = LocalStorageService.chatsLastSeenFromLocalStorage() || {};

        return await Promise.all(chats.map<Promise<Chat>>(async chatDto => {
            const sender = globalUsers[chatDto.sender];
            if (sender) {
                const chat = await MessageMapper.toEntity(chatDto, sender.userId);
                const values = chat.data!.split("__");
                const title = values[0];
                const keyAES = values[1];

                return {
                    id: chat.chat!,
                    title: title,
                    confirmed: false, //TODO: FLAG DECRYPTED / NON-DECRYPTED??
                    isUnreadMessagesExist: chatsLastSeen[chat.chat] ? chatsLastSeen[chat.chat] < new Date(chatDto.created!) : false,
                    lastSeenAt: chatsLastSeen[chat.chat] ? chatsLastSeen[chat.chat] : new Date(),
                    keyAES: keyAES,
                }
            }
            const values = chatDto.chat!.split("__");
            const title = values[0];
            const keyAES = values[1];

            return {
                id: chatDto.chat!,
                title: title,
                confirmed: false,
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
                    type: MessageType.iam,
                }).then(s => {
                    return {
                        knownParticipants: s,
                        chatParticipants: chatParticipants
                    }
                })
            }).then(s => {
                CustomerService.processUnknownChatParticipants(s.chatParticipants, s.knownParticipants, chatId, currentUserId, dispatch, getState);
                CustomerService.updateChatParticipantsCertificates(globalUsers, s.chatParticipants, dispatch);
            });

    }
}