import styled from "styled-components";

const MainGrid = styled.main`
  display: block;
  grid-gap: 10px;
  padding: 16px;
  max-width: 1110px;
  margin: auto;

  .profileArea {
    display: none;
  }

  @media (min-width: 860px) {
    display: grid;
    grid-template-areas: "profileArea welcomeArea profileRelationsArea";
    grid-template-columns: 160px 1fr 312px;

    .profileArea {
      display: flex;
    }
  }
`;

export default MainGrid;
