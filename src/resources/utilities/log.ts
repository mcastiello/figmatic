import { EventBus } from "@mcastiello/event-bus";
import {
  Channels,
  FigmaticBusConfig,
  type FigmaticBusDefinition,
  FigmaticEvents,
  FigmaticSeverity,
} from "../../types/events";

class FigmaLogger {
  private bus: EventBus<FigmaticBusDefinition> = new EventBus(FigmaticBusConfig);

  get channel() {
    return this.bus.getChannel(Channels.Figmatic);
  }

  log(
    message: string,
    severity: FigmaticSeverity = FigmaticSeverity.Info,
    timestamp: number = Date.now(),
    data?: unknown,
  ) {
    this.channel.publish(FigmaticEvents.Message, {
      message,
      severity,
      timestamp,
      data,
    });
  }
}

export const Logger = new FigmaLogger();
