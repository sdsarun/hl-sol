import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { Logger } from 'src/logger/logger.service';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      inject: [ConfigurationService],
      useFactory: (configurationService: ConfigurationService) => {
        return configurationService.databaseConfig;
      },
    }),
  ],
})
export class DatabaseModule {
  constructor(
    private readonly logger: Logger,
    private readonly sqz: Sequelize
  ) {
    this.testConnection();
  }

  private async testConnection() {
    this.logger.setContext(this.testConnection.name);

    try {
      await this.sqz.authenticate();
      this.logger.log("Database connection success.");
    } catch (error) {
      this.logger.error("Database connection failed", error);
    }
  }
}
