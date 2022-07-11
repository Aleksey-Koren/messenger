import {Dispatch} from "redux";

import {fetchMessagesTF} from "../redux/messenger/messengerActions";

export class SchedulerService {
    private static timerId: NodeJS.Timer | null = null;

    static startScheduler(dispatch: Dispatch<any>) {
        if(SchedulerService.timerId !== null) {
            clearInterval(SchedulerService.timerId);
        }
        SchedulerService.timerId = setInterval(() => {
            dispatch(fetchMessagesTF())
        }, 10000);
    }

    static stopScheduler() {
        clearInterval(SchedulerService.timerId!);
        SchedulerService.timerId = null;
    }

    static isSchedulerStarted() {

        return !!SchedulerService.timerId;
    }
}