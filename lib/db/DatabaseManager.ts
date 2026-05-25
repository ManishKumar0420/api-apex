import {MongooseConnection} from "./providers/MongoDBConnection";
import DBConnectionInterface from "./interfaces/DBConnectionInterface";

class DatabaseManager {
  private static instance: DBConnectionInterface;

  static getConnection(
    type: "mongodb" | "postgres"
  ): DBConnectionInterface {
    if (!DatabaseManager.instance) {
      switch (type) {
        case "mongodb":
          DatabaseManager.instance =
            new MongooseConnection();
          break;

        default:
          throw new Error("Unsupported database");
      }
    }

    return DatabaseManager.instance;
  }
}

export default DatabaseManager;