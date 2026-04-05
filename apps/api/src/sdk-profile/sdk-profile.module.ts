import { Module }              from "@nestjs/common";
import { SdkProfileService }   from "./sdk-profile.service";
import { SdkProfileController } from "./sdk-profile.controller";

@Module({
  controllers: [SdkProfileController],
  providers:   [SdkProfileService],
  exports:     [SdkProfileService],
})
export class SdkProfileModule {}

