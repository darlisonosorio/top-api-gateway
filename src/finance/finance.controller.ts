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

@Controller('finance')
@UseGuards(AuthGuard('jwt'))
export class FinanceController {
  constructor(
    @Inject('FINANCE_SERVICE') private readonly financeClient: ClientProxy,
  ) {}

  @Get()
  async findAll(
      @Query('page') page?: number, 
      @Query('limit') limit?: number,
      @Query('search') search?: string
  ) {
    return this.financeClient.send(
      { cmd: 'find-all-finances' }, 
      { 
        page: page ? Number(page) : page, 
        limit: limit ? Number(limit) : limit,
        search: search || undefined,
      },
    );
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.financeClient.send(
      { cmd: 'find-finance' }, 
      { id }
    );
  }

  @Post()
  @HttpCode(201)
  async create(@Body() data: any) {
    return this.financeClient.send({ cmd: 'create-finance' }, data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: any) {
    return this.financeClient.send({ cmd: 'update-finance' }, { id, ...data });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.financeClient.send({ cmd: 'delete-finance' }, { id });
  }
}