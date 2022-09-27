import {MessageDto} from "../../dto/messageDto";
import {TChat} from "../../model/messenger/tchat";
import {MessageMapper} from "../../mapper/messageMapper";
import {StringIndexArray} from "../../model/stringIndexArray";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {LocalStorageService} from "../local-data/localStorageService";

export class ChatService {

    static async tryDecryptChatsTitles(chats: MessageDto[], globalUsers: StringIndexArray<GlobalUser>) {
        const chatsLastSeen = LocalStorageService.chatsLastSeenFromLocalStorage() || {};

        return await Promise.all(chats.map<Promise<TChat>>(async chatDto => {
            const sender = globalUsers[chatDto.sender];
            if (sender) {
                const chat = await MessageMapper.toEntity(chatDto, sender.userId);
                return {
                    id: chat.chat!,
                    title: chat.data!,
                    confirmed: false, //TODO: FLAG DECRYPTED / NON-DECRYPTED??
                    isUnreadMessagesExist: chatsLastSeen[chat.chat] ? chatsLastSeen[chat.chat] < new Date(chatDto.created!) : false,
                    lastSeenAt: chatsLastSeen[chat.chat] ? chatsLastSeen[chat.chat] : new Date(),
                }
            }
            return {
                id: chatDto.chat!,
                title: chatDto.chat!,
                confirmed: false,
                isUnreadMessagesExist: false,
                lastSeenAt: new Date()
            }
        }))
    }

}