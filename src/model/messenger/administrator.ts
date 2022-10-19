import {UserType} from "./userType";

export interface Administrator {
    id: string;
    userId: string;
    chatId: string;
    userType: UserType;
}