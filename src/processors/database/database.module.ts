import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProvider } from './database.provider';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [...databaseProvider],
  exports: [...databaseProvider],
})
export class DatabaseModule {}
