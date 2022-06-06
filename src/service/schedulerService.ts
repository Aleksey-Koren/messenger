import {fetchMessengerStateTF} from "../redux/messenger/messengerActions";
import {User} from "../model/user";
import {Dispatch} from "redux";

export class SchedulerService {
    private static timerId: NodeJS.Timer | null = null;

    static startScheduler(dispatch: Dispatch<any>, user: User) {
        SchedulerService.timerId = setInterval(() => {
            console.log('scheduler')
            dispatch(fetchMessengerStateTF(user))
        }, 500000);
        dispatch(fetchMessengerStateTF(user));
    }

    static stopScheduler() {
        clearInterval(SchedulerService.timerId!);
    }

    static isSchedulerStarted() {

        return !!SchedulerService.timerId;
    }
}