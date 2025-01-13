import {
  ApplySchemaAttributes,
  command,
  CommandFunction,
  extension,
  ExtensionTag,
  MarkExtension,
  MarkExtensionSpec,
  MarkSpecOverride,
  PrimitiveSelection,
  toggleMark,
} from 'remirror';
import type { TagParseRule } from '@remirror/pm/model';

export interface SampOptions {}

@extension<SampOptions>({ defaultOptions: {} })
export class SampExtension extends MarkExtension<SampOptions> {
  get name() {
    return 'samp' as const;
  }

  createTags() {
    return [ExtensionTag.FormattingMark, ExtensionTag.FontStyle];
  }

  createMarkSpec(
    extra: ApplySchemaAttributes,
    override: MarkSpecOverride
  ): MarkExtensionSpec {
    return {
      ...override,
      attrs: extra.defaults(),
      parseDOM: [
        {
          tag: 'samp',
          getAttrs: extra.parse,
        } satisfies TagParseRule,
        ...(override.parseDOM ?? []),
      ],
      toDOM: (node) => {
        return ['samp', extra.dom(node), 0];
      },
    };
  }

  @command()
  toggleSamp(selection?: PrimitiveSelection): CommandFunction {
    return toggleMark({ type: this.type, selection });
  }
}
