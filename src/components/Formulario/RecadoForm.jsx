import React, { useState } from "react";

function RecadoForm({ tilte, handleSend }) {
  const [recado, setRecado] = useState("");

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSend({ recado });
        setRecado('');
      }} >
      <div>
        <textarea
          name="recado"
          autoComplete="off"
          placeholder={tilte}
          aria-label={tilte}
          onChange={(event) => setRecado(event.target.value)}
          value={recado}
        />
      </div>

      <button type="submit">Enviar Recado</button>
    </form>
  );
}

export default RecadoForm;
