import {Dispatch} from "redux";

import {fetchMessengerStateTF} from "../redux/messenger/messengerActions";
import {User} from "../model/user";

export class SchedulerService {
    private static timerId: NodeJS.Timer | null = null;

    static startScheduler(dispatch: Dispatch<any>, user: User) {
        if(SchedulerService.timerId !== null) {
            clearInterval(SchedulerService.timerId);
        }
        SchedulerService.timerId = setInterval(() => {
            console.log('scheduler')
            dispatch(fetchMessengerStateTF(user))
        }, 5000);
        dispatch(fetchMessengerStateTF(user));
    }

    static stopScheduler() {
        clearInterval(SchedulerService.timerId!);
        SchedulerService.timerId = null;
    }

    static isSchedulerStarted() {

        return !!SchedulerService.timerId;
    }
}