import {axiosApi} from "../http/axios";
import { BotMapper } from "../mapper/botMapper";
import { Bot } from "../model/messenger/bot";
import { User } from "../model/messenger/user";

export class BotApi {

    static register(bot: Bot): Promise<User> {
        return axiosApi.post<any>('bots/', bot)
            .then(response => {
                return BotMapper.toEntity(response.data);
            })
    }
}