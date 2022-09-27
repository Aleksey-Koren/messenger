import {Customer} from "./customer";

export interface Chat {
    id: string;
    title: string;
    members: Customer[];
}