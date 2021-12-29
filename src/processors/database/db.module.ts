import { Global, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forRootAsync({
      useFactory: () => ({
        uri: process.env.DB_HOST,
        useCreateIndex: true,
        useFindAndModify: false,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
      }),
    }),
  ],
  providers: [],
  exports: [],
})
@Global()
export class DBModule {}
