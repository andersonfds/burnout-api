import { createParamDecorator } from "@nestjs/common";
import { TokenData } from "../dto/create-token.dto";

export const getCurrentUser = (req: any): TokenData => req.getArgs()[0].user as TokenData;

export const CurrentUser = createParamDecorator((_, req): TokenData => getCurrentUser(req));