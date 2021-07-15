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
  return { props: { apitoken } };
}

export default function Home({ apitoken }) {
  const { data } = useQuerySubscription({
    enabled: true,
    query: `
      query AppQuery {
        allCommunities(orderBy: _createdAt_ASC) {
          id
          title
          imageUrl,
          link
        }
      }`,
    token: apitoken,
  });

  const usuarioAleatorio = "ruyarmando";
  const sorte = [
    "O importante não é vencer todos os dias, mas lutar sempre.",
    "Saber encontrar a alegria na alegria dos outros, é o segredo da felicidade.",
    "É melhor conquistar a si mesmo do que vencer mil batalhas.",
    "Não existe um caminho para a felicidade. A felicidade é o caminho.",
    "O período de maior ganho em conhecimento e experiência é o período mais difícil da vida de alguém.",
    "Dê a quem você ama: asas para voar, raízes para voltar e motivos para ficar.",
    "O medo tem alguma utilidade, mas a covardia não.",
    "Nas grandes batalhas da vida, o primeiro passo para a vitória é o desejo de vencer.",
    "O amor é a força mais sutil do mundo.",
    "Se queremos progredir, não devemos repetir a história, mas fazer uma história nova.",
    "O perdão é um catalisador que cria a ambiência necessária para uma nova partida, para um reinício.",
    "Todo o progresso é precário, e a solução para um problema coloca-nos diante de outro problema.",
    "A vantagem é uma dama inconstante.",
    "A persistência é o caminho do êxito.",
    "Enquanto você sonha, você está fazendo o rascunho do seu futuro.",
    "Para quê preocuparmo-nos com a morte? A vida tem tantos problemas que temos de resolver primeiro.",
    "No meio da dificuldade encontra-se a oportunidade.",
    "Tudo o que um sonho precisa para ser realizado é alguém que acredite que ele possa ser realizado.",
  ];

  const [usuario, setUsuario] = useState([]);
  const [community, setCommunity] = useState([]);
  const [following, setFollowing] = useState([]);

  const [comunidadeTitle, setComunidadeTitle] = useState("");
  const [comunidadeImage, setComunidadeImage] = useState("");
  const [mensagemSorte, setMensagemSorte] = useState(sorte[Math.floor(Math.random() * sorte.length)]);

  useEffect(() => {
    fetch(`https://api.github.com/users/${usuarioAleatorio}`)
      .then((response) => response.json())
      .then((result) => {
        setUsuario(result);
      })
      .catch(function (error) {
        console.log(
          "There has been a problem with your fetch operation: " + error.message
        );
      });
  }, []);

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
      <AlurakutMenu githubUser={usuario} />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: "profileArea" }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>
        <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
          <Box>
            <h1 className="title">Bem vindo(a), {usuario.name}</h1>
            <p className="smallText">
              <strong>Sorte de hoje:</strong> {mensagemSorte}
            </p>
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
