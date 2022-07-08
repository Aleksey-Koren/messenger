import {Message} from "../../model/messenger/message";
import {MessageType} from "../../model/messenger/messageType";
import {MessageApi} from "../../api/messageApi";
import {Chat} from "../../model/messenger/chat";
import {User} from "../../model/messenger/user";
import {StringIndexArray} from "../../model/stringIndexArray";
import {CustomerApi} from "../../api/customerApi";
import {CryptService} from "../cryptService";
import {GlobalUsers} from "../../model/local-storage/localStorageTypes";
import {MessageDto} from "../../dto/messageDto";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {setGlobalUsers} from "../../redux/messenger/messengerActions";

export class CustomerService {

    static processUnknownChatParticipants(participants: User[], knownParticipants: Message[], currentChat: Chat, senderId: string) {
        const knownParticipantsTitles: StringIndexArray<string> = knownParticipants.reduce((map, participant) => {
            map[participant.sender] = participant.data!;
            return map;
        }, {} as StringIndexArray<string>)

        const whoMessages: Message[] = [];

        participants.filter(participant => !knownParticipantsTitles[participant.id])
            .forEach(unknownParticipant => {
                whoMessages.push({
                    chat: currentChat.id,
                    type: MessageType.who,
                    sender: senderId,
                    receiver: unknownParticipant!.id,
                    data: ""
                } as Message);
            })
        MessageApi.sendMessages(whoMessages, {});

        return participants.reduce((array, participant) => {
            array[participant.id] = {
                id: participant?.id!,
                title: knownParticipantsTitles[participant.id],
                publicKey: participant?.publicKey
            }
            return array;
        }, {} as StringIndexArray<User>)
    }

    static addUnknownUsersToGlobalUsers(helloMessages: MessageDto[], globalUsers: GlobalUsers) {
        const requiredUsers: string[] = [];

        helloMessages.forEach(helloMessage => {
            const sender = globalUsers[helloMessage.sender];
            if (!sender) {
                requiredUsers.push(helloMessage.sender);
            }
        });

        return CustomerApi.getUsers(requiredUsers).then(response =>
            response.forEach((user) => {
                globalUsers[user.id!] = {
                    user: user.id,
                    certificates: [CryptService.uint8ToBase64(user.publicKey)],
                    titles: {}
                };
            }));
    }

    static updateChatParticipantsCertificates(globalUsers: GlobalUsers, chatParticipants: User[], dispatch: ThunkDispatch<AppState, void, Action>) {
        let isGlobalUsersUpdate = false;

        chatParticipants.forEach(participant => {
            const participantCertificates = globalUsers[participant.id].certificates;
            const actualParticipantPublicKey = CryptService.uint8ToPlainString(participant.publicKey);

            if (participantCertificates.indexOf(actualParticipantPublicKey) == -1) {
                participantCertificates.push(actualParticipantPublicKey)
                isGlobalUsersUpdate = true;
            }
        })

        if (isGlobalUsersUpdate) {
            dispatch(setGlobalUsers(globalUsers));
        }
    }
}

