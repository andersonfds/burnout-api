import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ResponseStepDto {
    @Expose()
    id: string;

    @Expose()
    type: string;

    @Expose()
    content: any;
}