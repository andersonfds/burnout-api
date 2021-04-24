import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { TemplateService } from './template.service';
import { SendGridModule } from '@ntegral/nestjs-sendgrid';


@Module({
    imports: [SendGridModule],
    providers: [MailService, TemplateService],
    exports: [MailService],
})
export class MailModule { }
