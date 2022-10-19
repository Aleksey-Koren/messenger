import {Message} from "../../model/messenger/message";
import {MessageType} from "../../model/messenger/messageType";
import {User} from "../../model/messenger/user";
import {StringIndexArray} from "../../model/stringIndexArray";
import {CustomerApi} from "../../api/customerApi";
import {CryptService} from "../cryptService";
import {MessageDto} from "../../dto/messageDto";
import {ThunkDispatch} from "redux-thunk";
import {AppDispatch, AppState} from "../../index";
import {Action} from "redux";
import {setGlobalUsers, setUsers} from "../../redux/messenger/messengerActions";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";
import {UserMapper} from "../../mapper/userMapper";
import {MessageMapper} from "../../mapper/messageMapper";

export class CustomerService {

    static processUnknownChatParticipants(participants: User[],
                                          knownParticipants: Message[],
                                          currentChatId: string,
                                          senderId: string,
                                          dispatch: AppDispatch,
                                          getState: () => AppState) {

        const knownParticipantsTitles: StringIndexArray<string> = knownParticipants.reduce((map, participant) => {
            map[participant.sender] = participant.data!;
            return map;
        }, {} as StringIndexArray<string>)

        const whoMessages: Message[] = [];

        const participantsIndexArray = participants.reduce((array, participant) => {
            array[participant.id] = {
                id: participant?.id!,
                title: knownParticipantsTitles[participant.id],
                publicKey: participant?.publicKey
            }
            return array;
        }, {} as StringIndexArray<User>);

        participants.filter(participant => !knownParticipantsTitles[participant.id])
            .forEach(unknownParticipant => {
                whoMessages.push({
                    chat: currentChatId,
                    type: MessageType.who,
                    sender: senderId,
                    receiver: unknownParticipant!.id,
                    data: ""
                } as Message);
            })

        if (whoMessages.length !== 0) {
            console.log("sendMessages = WHO")

            const user = getState().messenger.user;

            Promise.all(whoMessages.map(message => MessageMapper
                .toDto(message, UserMapper.toGlobalUsers(participants)[message.receiver])))
                .then(dto => {
                    getState().messenger.stompClient
                        .send(`/app/chat/send-message/${user?.id}`, {}, JSON.stringify(dto))
                })
        }
        dispatch(setUsers(participantsIndexArray, currentChatId));
    }

    static addUnknownUsersToGlobalUsers(helloMessages: MessageDto[], globalUsers: StringIndexArray<GlobalUser>) {
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
                    userId: user.id,
                    certificates: [CryptService.uint8ToBase64(user.publicKey)],
                    titles: {}
                };
            }));
    }

    static updateChatParticipantsCertificates(globalUsers: StringIndexArray<GlobalUser>, chatParticipants: User[], dispatch: ThunkDispatch<AppState, void, Action>) {
        // console.log("updateChatParticipantsCertificates")
        let isGlobalUsersUpdate = false;

        chatParticipants.forEach(participant => {
            const globalUser = globalUsers[participant.id];
            const actualParticipantPublicKey = CryptService.uint8ToBase64(participant.publicKey);

            if (!globalUser) {
                globalUsers[participant.id] = {
                    userId: participant.id,
                    certificates: [actualParticipantPublicKey],
                    titles: {}
                };
                isGlobalUsersUpdate = true;

            } else {
                const participantCertificates = globalUser.certificates;

                if (participantCertificates.indexOf(actualParticipantPublicKey) === -1) {
                    participantCertificates.push(actualParticipantPublicKey)
                    isGlobalUsersUpdate = true;
                }
            }
        })

        if (isGlobalUsersUpdate) {
            dispatch(setGlobalUsers(globalUsers));
        }
    }
}

