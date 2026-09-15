import { SQSClient, SQSClientConfig } from '@aws-sdk/client-sqs';
import { DynamoDBClient, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { Provider } from '@nestjs/common';

export interface AwsConfigOptions {
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  endpoint?: string;
  maxAttempts?: number;
  tls?: boolean;
}

export const DEFAULT_AWS_CONFIG: AwsConfigOptions = {
  region: 'us-east-1',
  maxAttempts: 3,
  tls: true,
};

export class AwsConfig {
  private readonly config: AwsConfigOptions;
  private sqsClient: SQSClient | null = null;
  private dynamoClient: DynamoDBClient | null = null;

  constructor(config: Partial<AwsConfigOptions> = {}) {
    this.config = { ...DEFAULT_AWS_CONFIG, ...config };
    this.validateConfig();
  }

  private validateConfig(): void {
    if (!this.config.region || this.config.region.trim() === '') {
      throw new Error('AWS region es requerida');
    }
    if (this.config.endpoint && !this.isValidEndpoint(this.config.endpoint)) {
      throw new Error('El endpoint de AWS debe ser una URL válida');
    }
  }

  private isValidEndpoint(endpoint: string): boolean {
    try {
      new URL(endpoint);
      return true;
    } catch {
      return false;
    }
  }

  getSqsClientConfig(): SQSClientConfig {
    const config: SQSClientConfig = {
      region: this.config.region,
      maxAttempts: this.config.maxAttempts,
      tls: this.config.tls,
    };

    if (this.config.endpoint) {
      config.endpoint = this.config.endpoint;
    }

    if (this.config.accessKeyId && this.config.secretAccessKey) {
      config.credentials = {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      };
    }

    return config;
  }

  getDynamoClientConfig(): DynamoDBClientConfig {
    const config: DynamoDBClientConfig = {
      region: this.config.region,
      maxAttempts: this.config.maxAttempts,
      tls: this.config.tls,
    };

    if (this.config.endpoint) {
      config.endpoint = this.config.endpoint;
    }

    if (this.config.accessKeyId && this.config.secretAccessKey) {
      config.credentials = {
        accessKeyId: this.config.accessKeyId,
        secretAccessKey: this.config.secretAccessKey,
      };
    }

    return config;
  }

  getSqsClient(): SQSClient {
    if (!this.sqsClient) {
      this.sqsClient = new SQSClient(this.getSqsClientConfig());
    }
    return this.sqsClient;
  }

  getDynamoClient(): DynamoDBClient {
    if (!this.dynamoClient) {
      this.dynamoClient = new DynamoDBClient(this.getDynamoClientConfig());
    }
    return this.dynamoClient;
  }

  getRegion(): string {
    return this.config.region;
  }

  getConfig(): Readonly<AwsConfigOptions> {
    return { ...this.config };
  }

  isLocalDevelopment(): boolean {
    return !!this.config.endpoint;
  }

  async destroy(): Promise<void> {
    if (this.sqsClient) {
      await this.sqsClient.destroy();
      this.sqsClient = null;
    }
    if (this.dynamoClient) {
      await this.dynamoClient.destroy();
      this.dynamoClient = null;
    }
  }
}

export const AWS_CONFIG_TOKEN = 'AWS_CONFIG';

export const createAwsConfigProvider = (options?: Partial<AwsConfigOptions>): Provider => {
  return {
    provide: AWS_CONFIG_TOKEN,
    useFactory: () => new AwsConfig(options),
  };
};

export const createSqsClientProvider = (): Provider => {
  return {
    provide: SQSClient,
    useFactory: (awsConfig: AwsConfig) => awsConfig.getSqsClient(),
    inject: [AWS_CONFIG_TOKEN],
  };
};

export const createDynamoClientProvider = (): Provider => {
  return {
    provide: DynamoDBClient,
    useFactory: (awsConfig: AwsConfig) => awsConfig.getDynamoClient(),
    inject: [AWS_CONFIG_TOKEN],
  };
};

export const AWS_PROVIDERS = [
  createAwsConfigProvider(),
  createSqsClientProvider(),
  createDynamoClientProvider(),
];

export function getAwsConfigFromEnvironment(): AwsConfigOptions {
  return {
    region: process.env.AWS_REGION || DEFAULT_AWS_CONFIG.region,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    endpoint: process.env.AWS_ENDPOINT,
    maxAttempts: DEFAULT_AWS_CONFIG.maxAttempts,
    tls: DEFAULT_AWS_CONFIG.tls,
  };
}

export function createAwsConfigFromEnvironment(): AwsConfig {
  return new AwsConfig(getAwsConfigFromEnvironment());
}