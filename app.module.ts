import { AppController } from "./app.controller";
import Module from "./decorators/module";

@Module({ controllers: [AppController] })
export class AppModule {}
