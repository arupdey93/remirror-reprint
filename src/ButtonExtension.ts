import { DOMCompatibleAttributes, NodeExtension, NodeExtensionSpec } from "remirror";

export class ButtonExtension extends NodeExtension {
    get name() {
      return 'user-card' as const;
    }
  
     createNodeSpec(): NodeExtensionSpec {
       return {
         attrs: {
           id: { default: null },
           name: { default: '' },
           imageSrc: { default: '' },
         },
         content: "",
         toDOM: (node) => {
           const attrs: DOMCompatibleAttributes = {
             'data-user-id': node.attrs.id,
             'data-user-name': node.attrs.name,
             'data-user-image-url': node.attrs.imageSrc,
           };
           return ['div', attrs, 0];
         },
        };
      }
    }
   

