import {Message} from "../model/messenger/message";
import {axiosApi} from "../http/axios";
import {MessageDto} from "../dto/messageDto";
import {MessageMapper} from "../mapper/messageMapper";
import {MessageType} from "../model/messenger/messageType";
import {StringIndexArray} from "../model/stringIndexArray";
import {GlobalUser} from "../model/local-storage/localStorageTypes";

import {store} from "../index";

export class MessageApi {

    static async sendMessages(messages: Message[], users: StringIndexArray<GlobalUser>) {
        return Promise.all(messages.map(message => MessageMapper.toDto(message, users[message.receiver]))).then(dto => {
            return axiosApi.post<MessageDto[]>('messages?iam=' + messages[0].sender, dto);
        })
    }
    
    static async getMessages(request: {
        receiver?: string,
        chat?: string,
        created?: Date,
        before?: Date,
        type?: MessageType,
        page?: number,
        size?: number
    }) {
        let dto = (await axiosApi.get<{ content: MessageDto[] }>('messages', {params: request})).data;
        
        const currentChat = store.getState().messenger.chats[store.getState().messenger.currentChat!];

        // TODO: delete this lines latter
        console.log("current AES key: " + currentChat.keyAES);
        let utf8Encode = new TextEncoder()
        let encodedKey: Uint8Array = utf8Encode.encode(currentChat.keyAES);
        console.log("current AES key in bytes(uint8): " + encodedKey);
        let byteArray = new Int8Array(encodedKey);
        console.log("real byte array: " + byteArray);
        

        
        
        return await Promise.all(dto.content.map(async dto => await MessageMapper.toEntity(dto, dto.sender)));
    }

    static async updateUserTitle(messages: Message[], users: StringIndexArray<GlobalUser>): Promise<Message[]> {
        const dto = await Promise.all(messages.map(async message => await MessageMapper.toDto(message, users[message.receiver])));
        return await axiosApi.put<MessageDto[]>('messages/title?iam=' + messages[0].sender, dto).then(async response => {
            return await Promise.all(response.data.map(async dto => await MessageMapper.toEntity(dto, users[dto.sender].userId)));
        })
    }
}