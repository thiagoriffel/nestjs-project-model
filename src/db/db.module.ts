import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
            type: 'postgres',
            host: configService.getOrThrow('DB_HOST'),
            port: Number(configService.getOrThrow('DB_PORT')),
            username: configService.getOrThrow('DB_USERNAME'),
            password: configService.getOrThrow('DB_PASSWORD'),
            database: configService.getOrThrow('DB_NAME'),
            autoLoadEntities: true,
            // entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
            migrations: [__dirname + '/migrations/*{.ts,.js}'],
            synchronize: false
        }),
        inject: [ConfigService]
    })]
})
export class DbModule {}
