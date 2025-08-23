import { addLine } from "./addLine";

export function connectResource(source, sink) {
  // check if the source is usable
  if (!source.active) {
    return;
  }

  // check if the resource types match
  if (
    source.getEntity().components.resource.type !==
    sink.getEntity().components.resource.type
  ) {
    return;
  }

  // link em up
  source.connect(sink);

  addLine(source.getEntity(), sink.getEntity());
}
