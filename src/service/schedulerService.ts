import {Action, Dispatch} from "redux";

import {fetchMessagesTF, setLastMessagesFetch} from "../redux/messenger/messengerActions";
import {LocalStorageService} from "./local-data/localStorageService";
import {MessageApi} from "../api/messageApi";
import {MessageType} from "../model/messenger/messageType";
import {Message} from "../model/messenger/message";
import {MessageProcessingService} from "./messenger/messageProcessingService";
import {ThunkDispatch} from "redux-thunk";
import {AppState} from "../index";

export class SchedulerService {
    private static timerId: NodeJS.Timer | null = null;

    static startScheduler(dispatch: Dispatch<any>, getState: () => AppState) {
        if (SchedulerService.timerId !== null) {
            clearInterval(SchedulerService.timerId);
        }

        console.log('START SCHEDULER')

        processTechnicalMessages(dispatch, getState);

        SchedulerService.timerId = setInterval(() => {
            dispatch(fetchMessagesTF())
        }, 1500);
    }

    static stopScheduler() {
        clearInterval(SchedulerService.timerId!);
        SchedulerService.timerId = null;
    }

    static isSchedulerStarted() {

        return !!SchedulerService.timerId;
    }
}

function processTechnicalMessages(dispatch: ThunkDispatch<AppState, void, Action>, getState: () => AppState) {
    const lastMessagesFetch = LocalStorageService.lastMessagesFetchFromLocalStorage() || new Date();
    const currentDate = new Date();
    const user = LocalStorageService.retrieveUserFromLocalStorage()!;

    console.log('LAST MESSAGES FETCH --- ' + lastMessagesFetch)
    console.log('CURRENT DATE --- ' + currentDate)

    const iamMessages = MessageApi.getMessages({
        receiver: user.id,
        type: MessageType.iam,
        created: lastMessagesFetch,
        before: currentDate
    });
    const whoMessages = MessageApi.getMessages({
        receiver: user.id,
        type: MessageType.who,
        created: lastMessagesFetch,
        before: currentDate
    });
    const helloMessages = MessageApi.getMessages({
        receiver: user.id,
        type: MessageType.hello,
        created: lastMessagesFetch,
        before: currentDate
    });

    Promise.all([helloMessages, iamMessages, whoMessages])
        .then(([helloResp, iamResp, whoResp]) => {
            const messages = [...helloResp, ...iamResp, ...whoResp];

            MessageProcessingService.processMessages(dispatch, getState, messages)
        })

    dispatch(setLastMessagesFetch(currentDate));
}