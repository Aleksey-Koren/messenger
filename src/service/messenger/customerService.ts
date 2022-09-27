import {User} from "../../model/messenger/user";
import {StringIndexArray} from "../../model/stringIndexArray";
import {CustomerApi} from "../../api/customerApi";
import {CryptService} from "../cryptService";
import {MessageDto} from "../../dto/messageDto";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../../index";
import {Action} from "redux";
import {setGlobalUsers} from "../../redux/messenger/messengerActions";
import {GlobalUser} from "../../model/local-storage/localStorageTypes";

export class CustomerService {

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

