import { createParamDecorator } from "@nestjs/common";
import { TokenData } from "../dto/create-token.dto";

export const CurrentUser = createParamDecorator((_, req) : TokenData => req.args[0].user as TokenData);