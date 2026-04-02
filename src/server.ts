import { config } from "./shared/config/env";
import app from "./app";

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${config.port}`);
});
