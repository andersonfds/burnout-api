import { Injectable } from '@nestjs/common';
import { InjectSendGrid, SendGridService } from '@ntegral/nestjs-sendgrid';
import { ConfigService } from '@nestjs/config';
import { MailDetailsDto } from './dto/mail-details.dto';
import { TemplateService } from './template.service';

@Injectable()
export class MailService {

    constructor(
        @InjectSendGrid() private readonly client: SendGridService,
        private readonly templateService: TemplateService,
        private readonly config: ConfigService,
    ) { }

    async mail(mail: MailDetailsDto) {
        const mailBody = this.templateService.load(mail.template, mail.data);
        try {
            return await this.client.send({
                to: mail.to,
                subject: mail.subject,
                html: mailBody,
                from: {
                    name: this.config.get<string>('SENDER_NAME'),
                    email: this.config.get<string>('SENDER_EMAIL'),
                },
            })
        } catch (error) {
            return error;
        }
    }
}
