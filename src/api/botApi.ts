import {axiosApi} from "../http/axios";
import { BotMapper } from "../mapper/botMapper";
import { Bot } from "../model/messenger/bot";

export class BotApi {

    static register(bot: Bot) {
        return axiosApi.post<any>('bots/', bot)
            .then(response => {
                return BotMapper.toEntity(response.data);
            })
    }
}