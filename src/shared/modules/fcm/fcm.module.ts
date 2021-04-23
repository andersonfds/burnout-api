import { HttpModule, Module } from '@nestjs/common';
import { FcmService } from './fcm.service';

@Module({
  imports: [HttpModule],
  providers: [FcmService],
  exports: [FcmService],
})
export class FcmModule { }
