import {Message} from "../model/messenger/message";
import {MessageType} from "../model/messenger/messageType";
import {MessageApi} from "../api/messageApi";
import {Chat} from "../model/messenger/chat";
import {User} from "../model/messenger/user";
import {StringIndexArray} from "../model/stringIndexArray";

export class CustomerService {

    static processParticipants(participants: User[], knownParticipants: Message[], currentChat: Chat, senderId: string) {

        const names: StringIndexArray<string> = knownParticipants.reduce((map, participant) => {
            map[participant.sender as string] = participant.data as string;
            return map;
        }, {} as StringIndexArray<string>)

        participants.filter(participant => {
            return !names[participant.id as string];
        }).forEach(unknownParticipant => {
            const whoMessage = {
                chat: currentChat.id,
                type: MessageType.who,
                sender: senderId,
                receiver: unknownParticipant!.id,
                data: ""
            } as Message;
            MessageApi.sendMessages([whoMessage], {});
        })
        return participants.map(participant => {
            return {
                id: participant?.id!,
                title: names[participant.id as string],
                publicKey: participant?.publicKey
            }
        })


    }

}