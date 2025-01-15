import { NodeViewComponentProps } from '@remirror/react';
import { ComponentType } from 'react';
import {
  command,
  CommandFunction,
  DOMCompatibleAttributes,
  ExtensionTag,
  NodeExtension,
  NodeExtensionSpec,
} from 'remirror';
import Button from '../components/Button';

class ButtonNodeExtension extends NodeExtension {
  get name() {
    return 'userCard' as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = Button;

  createTags() {
    return [ExtensionTag.InlineNode];
  }
  createNodeSpec(): NodeExtensionSpec {
    return {
      inline: true,
      group: 'inline',
      atom: true,
      selectable: false,
      draggable: false,
      attrs: {
        id: { default: null },
        name: { default: '' },
      },
      // content: '',
      toDOM: (node) => {
        const attrs: DOMCompatibleAttributes = {
          'data-user-id': node.attrs.id,
          'data-user-name': node.attrs.name,
        };
        return ['span', attrs, 0];
      },
      parseDOM: [
        {
          attrs: {
            id: { default: null },
            name: { default: '' },
          },
          tag: 'span[data-user-id]',
          getAttrs: (dom) => {
            const node = dom as HTMLAnchorElement;
            const id = node.getAttribute('data-user-id');
            const name = node.getAttribute('data-user-name');

            return {
              id,
              name,
            };
          },
        },
      ],
    };
  }

  @command()
  appendButtonWithContent(obj: { name: string; id: string }): CommandFunction {
    return ({ tr, dispatch }) => {
      const { selection } = tr;
      const { $from } = selection;
      // cursor position
      const pos = $from.pos;
      // insert button node
      const node = this.type.createAndFill(obj);
      if (!node) {
        console.error('Failed to create node.');
        return false;
      }
      tr.insert(pos, node);
      // insert content
      if (dispatch) {
        dispatch(tr);
      }

      return true;
    };
  }
}

export { ButtonNodeExtension };
