import './style/card.css';

import { ComponentType, useCallback } from 'react';
import {
  command,
  CommandFunction,
  DOMCompatibleAttributes,
  ExtensionTag,
  NodeExtension,
  NodeExtensionSpec,
  RemirrorJSON,
} from '@remirror/core';
import {
  EditorComponent,
  NodeViewComponentProps,
  OnChangeJSON,
  Remirror,
  useCommands,
  useRemirror,
} from '@remirror/react';

class UserCardExtension extends NodeExtension {
  get name() {
    return 'userCard' as const;
  }

  ReactComponent: ComponentType<NodeViewComponentProps> = ({ node }) => {
    const { name } = node.attrs;

    return (
      <span
        className="card"
        onClick={() => console.log('btn clicked')}
        contentEditable="false"
        draggable="false"
      >
        {name}
      </span>
    );
  };

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

  // createCommands() {
  //   return {
  //     appendButtonWithContent: this.appendButtonWithContent,
  //   };
  // }
}

const extensions = () => [
  new UserCardExtension({ disableExtraAttributes: true }),
];

const VariableButton = () => {
  const commands = useCommands();

  const handleAddUserCard = () => {
    commands.appendButtonWithContent({ name: 'test', id: 'test' });
  };

  return (
    <button type="button" onClick={handleAddUserCard}>
      Add variable
    </button>
  );
};

export const UserCard = () => {
  const { manager, state } = useRemirror({
    extensions,
    stringHandler: 'html',
  });

  const handleEditorChange = useCallback((json: RemirrorJSON) => {
    // Store the JSON in localstorage
    // console.log(JSON.stringify(json, null, 2));
  }, []);

  return (
    <div style={{ background: '#f9f9f9' }}>
      <Remirror manager={manager} initialContent={state}>
        <EditorComponent />
        <VariableButton />
        <OnChangeJSON onChange={handleEditorChange} />
      </Remirror>
    </div>
  );
};
