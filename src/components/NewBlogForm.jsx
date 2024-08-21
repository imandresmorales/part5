import styled from "styled-components";

const CreateButton = styled.button`
  background: #b3e5fc;
  font-size: 1.25em;
  margin: 5px;
  border: 1px solid;
  border-radius: 4px;
`;

const CancelButton = styled.button`
  background: #ffe5b4;
  font-size: 1.25em;
  margin: 5px;
  border: 1px solid;
  border-radius: 4px;
`;

const Input = styled.input`
  background: #e8f5e9;
  border-radius: 9px;
  margin: 0px 5px 2px 5px;
`;

const newBlogForm = ({
  title,
  setTitle,
  author,
  setAuthor,
  url,
  setUrl,
  handleCreate,
  handleNewBlog,
}) => {
  return (
    <>
      <h2>Create new</h2>
      <div>
        title:
        <Input
          type="text"
          value={title}
          name="title"
          onChange={({ target }) => setTitle(target.value)}
        />
      </div>
      <div>
        author:
        <Input
          type="text"
          value={author}
          name="author"
          onChange={({ target }) => setAuthor(target.value)}
        />
      </div>
      <div>
        url:
        <Input
          type="text"
          value={url}
          name="url"
          onChange={({ target }) => setUrl(target.value)}
        />
      </div>
      <CreateButton onClick={handleCreate}>create</CreateButton>
      <CancelButton onClick={handleNewBlog}>cancel</CancelButton>
    </>
  );
};

export default newBlogForm;
