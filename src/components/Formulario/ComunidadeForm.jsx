import React, { useState } from "react";

function ComunidadeForm({ handleSend }) {
  const [comunidadeTitle, setComunidadeTitle] = useState("");
  const [comunidadeImage, setComunidadeImage] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSend({ comunidadeTitle, comunidadeImage });
        setComunidadeTitle('');
        setComunidadeImage('');
      }} >
      <div>
        <input
          name="title"
          type="text"
          autoComplete="off"
          required
          placeholder="Qual vai ser o nome da sua comunidade?"
          aria-label="Infome o nome da sua comunidade"
          onChange={(event) => setComunidadeTitle(event.target.value)}
          value={comunidadeTitle}
        />
      </div>

      <div>
        <input
          name="image"
          type="url"
          autoComplete="off"
          required
          placeholder="Qual vai ser a imagem de capa da sua comunidade?"
          aria-label="Infome a URL da imagem de capa da sua comunidade"
          onChange={(event) => setComunidadeImage(event.target.value)}
          value={comunidadeImage}
        />
      </div>
      <button type="submit">Criar comunidade</button>
    </form>
  );
}

export default ComunidadeForm;
