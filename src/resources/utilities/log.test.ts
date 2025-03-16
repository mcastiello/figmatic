import { Logger } from "./log";
import { FigmaticEvents, FigmaticSeverity } from "../../types";

describe("Logger", () => {
  const date = Date.now();

  beforeEach(() => {
    jest.spyOn(Date, "now").mockReturnValueOnce(date);
  });

  test("Is should send message events", async () => {
    Logger.log("Hello World!");

    const data = await Logger.channel.once(FigmaticEvents.Message);

    expect(data).toEqual({
      message: "Hello World!",
      severity: FigmaticSeverity.Info,
      timestamp: date,
    });
  });
});
