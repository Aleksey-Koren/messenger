import {MessageDto} from "../../dto/messageDto";
import {Chat} from "../../model/messenger/chat";
import {MessageMapper} from "../../mapper/messageMapper";
import {GlobalUsers} from "../../model/local-storage/localStorageTypes";

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
}