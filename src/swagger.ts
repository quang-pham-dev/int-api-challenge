import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * https://docs.nestjs.com/recipes/swagger
 */

export function bootstrapSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .setTitle('Intranet API')
    .setDescription('The API for intranet system')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
}
