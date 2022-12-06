import { CustomerDto } from "./CustomerDto";

export class BotDto extends CustomerDto {
    public webhookUrl: string | null = null;
}