import { HttpException } from "@nestjs/common";

export class ArgumentException extends HttpException {

    constructor(property: string, value: string) {
        const statusCode = 400;
        const errors = [{ property, value: [value] }];
        super({ statusCode, errors }, statusCode);
    }

}