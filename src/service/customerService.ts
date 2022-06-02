import {Builder} from "builder-pattern";
import {User} from "../model/user";
import {retrieveUnit8Array} from "../redux/authorization/authorizationActionsUtil";
import {Message} from "../model/message";
import {MessageType} from "../model/messageType";
import {MessageApi} from "../api/messageApi";
import {Customer} from "../model/customer";
import {Chat} from "../model/chat";

export class CustomerService {

    static processUnknownChatParticipants(participants: Customer[], users: Map<string, User>, currentChat: Chat, senderId: string) {
        const unknownParticipants: Customer[] = participants.filter(participant => !users.has(participant.id!));

        unknownParticipants.forEach(unknownParticipant => {
            const userWithoutTitle = Builder(User)
                .id(unknownParticipant?.id!)
                .publicKey(retrieveUnit8Array(unknownParticipant?.pk!))
                .build();

            users.set(unknownParticipant?.id!, userWithoutTitle)

            const whoMessage = Builder(Message)
                .chat(currentChat.id)
                .type(MessageType.who)
                .sender(senderId)
                .receiver(unknownParticipant!.id)
                .build();

            MessageApi.sendSingleMessage(whoMessage, unknownParticipant!.pk!);
        })
    }

}