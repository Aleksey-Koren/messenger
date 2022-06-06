import {Message} from "../model/message";
import {User} from "../model/user";
import {MessageType} from "../model/messageType";
import {Builder} from "builder-pattern";
import {MessageApi} from "../api/messageApi";

import {Chat} from "../model/chat";
import {Customer} from "../model/customer";

export class MessageService {

    static processMessage(message: Message, chatMessages: Message[], users: Map<String, User>,
                          currentChat: Chat, participants: Customer[], user: User) {

        switch (message.type) {
            case MessageType.whisper:
                chatMessages.push(message);
                break;

            case MessageType.who:
                processWhoMessage(currentChat, user, message, participants)
                break;

            case MessageType.iam:
                processIamMessage(message, participants, users)
                break;

            case MessageType.hello:
                break;

                default:
                throw new Error('Unknown message type: ' + message.type);
        }
    }

    static prepareHello(me: User, otherId: string, data: string) {
        return Builder(Message)
            .sender(me.id)
            .receiver(otherId)
            .type(MessageType.hello)
            .data(data)
            .build()
    }

    static prepareHelloToExisting(me: User, otherId: string, chat: Chat) {
        return Builder(Message)
            .sender(me.id)
            .receiver(otherId)
            .type(MessageType.hello)
            .chat(chat.id)
            .data(chat.title)
            .build()
    }
}

function processWhoMessage(currentChat: Chat, user: User, message: Message, participants: Customer[]) {

    const iamMessage = Builder(Message)
        .chat(currentChat.id)
        .type(MessageType.iam)
        .sender(user.id!)
        .receiver(message.sender)
        .data(user.title ? user.title : user.id)
        .build();

    MessageApi.sendSingleMessage(iamMessage, participants.find(participant => participant.id === message.sender)?.pk!)
}

function processIamMessage(message: Message, participants: Customer[], users: Map<String, User>) {

    const chatUser = Builder(User)
        .id(message.sender)
        .title(message.data)
        .publicKey((participants.find(participant => participant.id === message.sender)?.pk!))
        .build();

    users.set(chatUser.id!, chatUser);
}