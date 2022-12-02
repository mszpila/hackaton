import { Body, Controller, Delete, Get, Headers, Param, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserApplicationService } from '../../application/UserApplicationService';
import { UserDTO } from '../../application/UserDTO';

@Controller('/users')
export class UserController {
  constructor(
    private readonly userApplicationService: UserApplicationService,
  ) {
  }

  @Get('/:user')
  public async getUser(
    @Headers('x-token') token: string,
    @Param('user') user: string,
  ): Promise<UserDTO> {
    return this.userApplicationService.getUser({
      token,
      user,
    });
  }

  // @Post('/upload-image')
  // @UseInterceptors(FileInterceptor('image'))
  // public async uploadImage(
  //   @Headers('x-token') token: string,
  //   @UploadedFile() file: Express.Multer.File
  // ): Promise<{ url: string }> {
  //   return this.userApplicationService.uploadImage({
  //     token,
  //     image: file.buffer,
  //     mimeType: file.mimetype,
  //     size: file.size
  //   })
  // }

  // @Delete('/delete/image')
  // public async deleteImage(
  //   @Headers('x-token') token: string,
  // ): Promise<{ url: string }> {
  //   return this.userApplicationService.deleteImage({
  //     token
  //   })
  // }

  // @Put('/edit/username')
  // public async editUsername(
  //   @Headers('x-token') token: string,
  //   @Body('username') username: string
  // ): Promise<{ url: string }> {
  //   return this.userApplicationService.editUsername({
  //     token,
  //     username
  //   })
  // }

  // @Put('/edit/email')
  // public async editUserEmail(
  //   @Headers('x-token') token: string,
  //   @Body('email') email: string
  // ): Promise<{ url: string }> {
  //   return this.userApplicationService.editUserEmail({
  //     token,
  //     email
  //   })
  // }

  // @Put('/edit/password')
  // public async editUserPassword(
  //   @Headers('x-token') token: string,
  //   @Body('password') password: string,
  //   @Body('newPassword') newPassword: string
  // ): Promise<{ url: string }> {
  //   return this.userApplicationService.editUserPassword({
  //     token,
  //     password,
  //     newPassword
  //   })
  // }
}