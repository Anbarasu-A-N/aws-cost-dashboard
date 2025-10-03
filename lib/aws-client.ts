// lib/aws-client.ts
import { CostExplorerClient } from '@aws-sdk/client-cost-explorer';

const client = new CostExplorerClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export default client;