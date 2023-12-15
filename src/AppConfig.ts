import { Config } from "./infra/database/Config";

export default class AppConfig {
  readonly dbConfig: Config;
  readonly httpConfig: { port: number } = { port: 3000 };

  constructor(args: string[]) {
    const isDevMode = process.env.NODE_ENV?.trim() == "development";

    const parsedArgs = this.parseArgs(args);

    const requiredParams = [
      "--DB_HOST",
      "--DB_SCHEMA",
      "--DB_NAME",
      "--DB_USER",
      "--DB_PASSWORD",
      "--DB_PORT",
      "--PORT",
    ];
    const missingParams = requiredParams.filter((param) => param == '--DB_SCHEMA' ? false : !parsedArgs[param]);

    if (!isDevMode && missingParams.length > 0) {
      console.error(`Parâmetros faltando: ${missingParams.join(", ")}`);
      process.exit(1);
    }

    this.dbConfig = {
      host: isDevMode ? process.env.DB_HOST || "" : parsedArgs["--DB_HOST"],
      schema: isDevMode
        ? process.env.DB_SCHEMA || ""
        : parsedArgs["--DB_SCHEMA"] || "",
      database: isDevMode
        ? process.env.DB_NAME || ""
        : parsedArgs["--DB_NAME"],
      user: isDevMode ? process.env.DB_USER || "" : parsedArgs["--DB_USER"],
      password: isDevMode
        ? process.env.DB_PASSWORD || ""
        : parsedArgs["--DB_PASSWORD"],
      port: isDevMode
        ? Number(process.env.DB_PORT) || 1433
        : Number(parsedArgs["--DB_PORT"]),
    };
    this.httpConfig = {
      port: isDevMode
        ? Number(process.env.PORT) || 3000
        : Number(parsedArgs["--PORT"]),
    }
  }

  private parseArgs(args: string[]): { [key: string]: string } {
    const parsedArgs: { [key: string]: string } = {};

    for (let i = 0; i < args.length; i++) {
      if (
        args[i].startsWith("--") &&
        args[i + 1] &&
        !args[i + 1].startsWith("--")
      ) {
        const key = args[i];
        const value = args[i + 1];
        parsedArgs[key] = value;
      }
    }

    return parsedArgs;
  }
}
