import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );
  const config=new DocumentBuilder()
  .setTitle('Asset management system')
  .setDescription('Asset management system')
  .setVersion('1.0')
  .addTag('Asset management system')
  .addBearerAuth(
    {
      type:'http',
      scheme:'bearer',
      bearerFormat:'JWT',
      name:'JWT',
      description:'Token here...',
      in:'header'
    }
  )
  .build()

  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('documentation',app,document)

  const configService:ConfigService=app.get(ConfigService);

  await app.listen(configService.get("PORT","0.0.0.0"))
  console.log("Listening on port:" +configService.get("PORT"))
}
bootstrap();
