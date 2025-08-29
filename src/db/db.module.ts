import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
    imports: [TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => {
            // Support both DATABASE_URL (single string) and individual DB_* variables
            const databaseUrl = configService.get<string>('DATABASE_URL');
            if (databaseUrl && databaseUrl.trim() !== '') {
                return {
                    type: 'postgres',
                    url: databaseUrl,
                    autoLoadEntities: true,
                    // entities: [join(__dirname, '/../**/*.entity.{ts,js}')],
                    migrations: [__dirname + '/migrations/*{.ts,.js}'],
                    synchronize: false
                };
            }
            return {
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
            };
        },
        inject: [ConfigService]
    })]
})
export class DbModule {}
