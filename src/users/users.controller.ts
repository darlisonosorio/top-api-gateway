import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Inject,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
@UseGuards(AuthGuard('jwt'))
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE') private readonly usersClient: ClientProxy,
  ) {}

  @Get()
  async findAll(
    @Query('page') page?: number, 
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ) {
    return this.usersClient.send(
      { cmd: 'find-all-users' }, 
      { 
        page: page ? Number(page) : page, 
        limit: limit ? Number(limit) : limit,
        search: search || undefined
      },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersClient.send(
      { cmd: 'find-user' }, 
      { id }
    );
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: any) {
    return this.usersClient.send({ cmd: 'create-user' }, data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.usersClient.send({ cmd: 'update-user' }, { id, ...data });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usersClient.send({ cmd: 'delete-user' }, { id });
  }
}