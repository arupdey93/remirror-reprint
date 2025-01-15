function Button({ node }: any) {
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
}

export default Button;
