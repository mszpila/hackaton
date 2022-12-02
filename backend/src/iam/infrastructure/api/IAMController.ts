import { Body, Controller, Headers, Post } from '@nestjs/common';
import { IAMApplicationService } from '../../application/IAMApplicationService';
import { TokenDTO } from '../../application/TokenDTO';

@Controller('/auth')
export class IAMController {
  constructor(
    private readonly iamApplicationService: IAMApplicationService,
  ) {
  }

  @Post('/login')
  public async login(
    @Body() body: ILoginBody,
  ): Promise<TokenDTO> {
    return this.iamApplicationService.login({
      ...body,
    });
  }

  @Post('/logout')
  public async logout(
    @Headers('x-token') token: string,
  ): Promise<void> {
    return this.iamApplicationService.logout({ token });
  }

  @Post('/signUp')
  public async signUp(
    @Body() body: ISignUpBody,
  ): Promise<TokenDTO> {
    return this.iamApplicationService.singUp({
      ...body,
    });
  }
}

interface ILoginBody {
  email: string;
  password: string;
}

interface ISignUpBody extends ILoginBody {
  firstName: string;
  lastName: string;
}