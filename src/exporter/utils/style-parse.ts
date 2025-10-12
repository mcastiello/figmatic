import { FontStyle, FontWeight, TextCase, TextDecoration, TextTruncation, type TypeStyle } from "../../types";
import { FontsCollection } from "../../resources/utilities";
import { rem } from "./styles";

export const parseTextStyles = (style: Partial<TypeStyle>): Map<string, string> => {
  const map: Map<string, string> = new Map();
  if (style.fontFamily) {
    const fontFamily = FontsCollection.get(style.fontFamily) || style.fontFamily;

    map.set("font-family", fontFamily);
  }

  if (style.fontStyle?.toLowerCase() === "italic" || style.italic || style.semanticItalic === FontStyle.Italic) {
    map.set("font-style", "italic");
  }

  if ((style.fontStyle?.toLowerCase() === "bold" || style.semanticWeight === FontWeight.Bold) && !style.fontWeight) {
    map.set("font-weight", "bold");
  }

  if (style.fontWeight) {
    map.set("font-weight", style.fontWeight.toString());
  }

  if (style.fontSize) {
    map.set("font-size", rem(style.fontSize));
  }

  if (style.lineHeightPx) {
    map.set("line-height", rem(style.lineHeightPx));
  }

  if (style.letterSpacing) {
    map.set("letter-spacing", rem(style.letterSpacing));
  }

  if (style.paragraphIndent) {
    map.set("text-indent", rem(style.paragraphIndent));
  }

  switch (style.textCase) {
    case TextCase.Lower:
      map.set("text-transform", "lowercase");
      break;
    case TextCase.Upper:
      map.set("text-transform", "uppercase");
      break;
    case TextCase.Title:
      map.set("text-transform", "capitalize");
      break;
    case TextCase.SmallCaps:
    case TextCase.SmallCapsForced:
      map.set("font-variant", "small-caps");
  }

  switch (style.textDecoration) {
    case TextDecoration.Strikethrough:
      map.set("text-decoration", "line-through");
      break;
    case TextDecoration.Underline:
      map.set("text-decoration", "underline");
      break;
  }

  switch (style.textTruncation) {
    case TextTruncation.Enabled:
      map.set("text-overflow", "ellipsis");
      map.set("white-space", "nowrap");
      map.set("overflow", "hidden");
      break;
  }

  return map;
};
