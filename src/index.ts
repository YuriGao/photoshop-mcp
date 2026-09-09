#!/usr/bin/env node

import { PhotoshopMCPServer } from './core/server.js';
import { getAppVersion } from './utils/app-version.js';
import { Logger } from './utils/logger.js';

const logger = new Logger('Main');

let mcpServer: PhotoshopMCPServer | null = null;
let shuttingDown = false;

async function main() {
  try {
    logger.info('Starting Photoshop MCP Server...');

    mcpServer = new PhotoshopMCPServer({ serverVersion: getAppVersion() });
    await mcpServer.start();

    logger.info('Photoshop MCP Server is running');
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

async function handleShutdown(signal: string): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;

  logger.info(`Received ${signal}, shutting down`);

  if (mcpServer) {
    await mcpServer.stop();
    mcpServer = null;
  }

  process.exit(0);
}

process.on('SIGINT', () => {
  void handleShutdown('SIGINT');
});
process.on('SIGTERM', () => {
  void handleShutdown('SIGTERM');
});

process.stdin.on('end', () => {
  void handleShutdown('stdio_closed');
});

main();
