import { Builder } from "builder-pattern";
import { BotDto } from "../dto/BotDto";
import { User } from "../model/messenger/user";

export class BotMapper {
    static toEntity(bot: BotDto): User {
        return {
            id: bot.id!,
            privateKeyPem: bot.pk!,
            publicKeyPem: bot.pk!,
            webhookUrl: bot.webhookUrl!
        }
    }
}