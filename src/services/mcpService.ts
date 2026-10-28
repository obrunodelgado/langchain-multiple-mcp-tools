import { MCPAdapter } from "@langchain/mcp-adapters";
import { getCsvToJsonTool } from "../tools/csvToJsonTool.ts";

export const getMCPTools = async () => {
  const client = new MCPAdapter({
    servers: {
        "MongoDB": {
            transport: 'stdio' as const,
            "command": "npx",
            "args": ["-y", "mongodb-mcp-server@latest"],
            "env": {
                "MDB_MCP_CONNECTION_STRING": "mongodb://localhost:27017/dataprocessing"
            },
            onMessage: (message: any, source: any) => {
                console.log(`[${source.server}] ${message.data}`)
            }
        },
        filesystem: {
          transport: 'stdio' as const,
          command: 'npx',
          args: [
            '-y',
            '@modelcontextprotocol/server-filesystem',
            `${process.cwd()}`
          ]
        }
    },
  })

  const mcpTools = await client.listTools()

  return [
    ...mcpTools,
    getCsvToJsonTool()
  ];
};
