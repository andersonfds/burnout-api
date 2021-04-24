import { Injectable } from '@nestjs/common';
import { join } from 'path';
import * as pug from 'pug';

@Injectable()
export class TemplateService {

    load(name: string, data: any): string {
        return pug.renderFile(join(__dirname, 'templates', name + '.pug'), data);
    }

}
