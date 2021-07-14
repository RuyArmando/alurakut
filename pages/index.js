import { useState, useEffect } from "react";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";

import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from "../src/lib/AlurakutCommons";

import { useQuerySubscription } from "react-datocms";

import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {props.items.slice(0, 6).map((item) => {
          return (
            <li key={item.id}>
              <a href={item.link}>
                <img src={item.imageUrl} />
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
      {props.items.length > 6 && (
        <>
          <hr />
          <p>
            <a className="boxLink" href="/">
              Ver todos
            </a>
          </p>
        </>
      )}
    </ProfileRelationsBoxWrapper>
  );
}

function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img
        src={`https://github.com/${props.githubUser}.png`}
        style={{ borderRadius: "8px" }}
      />
      <hr />
      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>

      <hr />
      <AlurakutProfileSidebarMenuDefault />
    </Box>
  );
}

export async function getStaticProps() {
  // Using the variables below in the browser will return `undefined`. Next.js doesn't
  // expose environment variables unless they start with `NEXT_PUBLIC_`
  const apitoken = process.env.DATOCMS_API_TOKEN;
  return { props: {apitoken} };
}

export default function Home({apitoken}) {
  const { status, error, data } = useQuerySubscription({
    enabled: true,
    query: `
      query AppQuery {
        allCommunities {
          id
          title
          imageUrl
        }
      }`,
    variables: { first: 10 },
    token: apitoken,
  });

  const statusMessage = {
    connecting: "Connecting to DatoCMS...",
    connected: "Connected to DatoCMS, receiving live updates!",
    closed: "Connection closed",
  };

  const [community, setCommunity] = useState([]);
  const [following, setFollowing] = useState([]);

  const [comunidadeTitle, setComunidadeTitle] = useState("");
  const [comunidadeImage, setComunidadeImage] = useState("");

  const usuarioAleatorio = "ruyarmando";

  useEffect(() => {
    fetch(`https://api.github.com/users/${usuarioAleatorio}/following`)
      .then((response) => response.json())
      .then((result) => {
        const parsedFollowers = result.map((data) => {
          return {
            id: data.login,
            title: data.login,
            imageUrl: data.avatar_url,
            link: `/users/${data.login}`,
          };
        });

        setFollowing(parsedFollowers);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }, []);

  function handleSendCommunity(event) {
    event.preventDefault();

    const newCommunity = {
      id: new Date().toISOString(),
      title: comunidadeTitle,
      imageUrl:
        comunidadeImage.trim() !== ""
          ? comunidadeImage
          : "https://picsum.photos/300/300?" + (1 + Math.random() * (100 - 1)),
      link: "/",
    };

    setCommunity([...community, newCommunity]);
    setComunidadeTitle("");
    setComunidadeImage("");
  }

  return (
    <>
      <AlurakutMenu githubUser={usuarioAleatorio} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a)</h1>

            <OrkutNostalgicIconSet />
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={(event) => handleSendCommunity(event)}>
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
                  list="images"
                  autoComplete="off"
                  required
                  placeholder="Qual vai ser a imagem de capa da sua comunidade?"
                  aria-label="Infome a URL da imagem de capa da sua comunidade"
                  onChange={(event) => setComunidadeImage(event.target.value)}
                  value={comunidadeImage}
                />
                <datalist id="images">
                  <option value="https://picsum.photos/300/300?random=1" />
                  <option value="https://placekitten.com/300/300" />
                  <option value="http://placebacon.net/300/300?image=1" />
                  <option value="https://baconmockup.com/300/300" />
                </datalist>
              </div>
              <button type="submit">Criar comunidade</button>
            </form>
          </Box>
        </div>
        <div
          className="profileRelationsArea"
          style={{ gridArea: "profileRelationsArea" }}
        >
          <ProfileRelationsBox title="Meus amigos" items={following} />
          {data && (
            <ProfileRelationsBox
              title="Minhas comunidades"
              items={data.allCommunities}
            />
          )}
        </div>
      </MainGrid>
    </>
  );
}
