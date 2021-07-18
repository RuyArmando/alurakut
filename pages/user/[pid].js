import nookies from "nookies";
import jwt from "jsonwebtoken";
import styled from "styled-components";

import MainGrid from "../../src/components/MainGrid";
import Box from "../../src/components/Box";
import { CardBox } from "../../src/components/BoxMensagem";

import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
  AlurakutProfileSidebarMenuFriend,
} from "../../src/lib/AlurakutCommons";

export const CardBoxWrapper = styled(Box)`
  ul {
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 1fr 1fr;
    max-height: 220px;
    list-style: none;
  }
  img {
    object-fit: cover;
    background-position: center center;
    width: 100%;
    height: 100%;
    position: relative;
  }
  ul li a {
    display: inline-block;
    height: 102px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;
    span {
      color: #ffffff;
      font-size: 10px;
      position: absolute;
      left: 0;
      bottom: 10px;
      z-index: 2;
      padding: 0 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
    &:after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      bottom: 0;
      z-index: 1;
      background-image: linear-gradient(0deg, #00000073, transparent);
    }
  }
`;

function CardBoxImage(props) {
  return (
    <CardBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {props.items.slice(0, 6).map((item) => {
          return (
            <li key={item.id}>
              <a>
                <img src={item.imageUrl} />
                <span>{item.title}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </CardBoxWrapper>
  );
}

function CardBoxText(props) {
  return (
    <Box>
      <h2 className="smallTitle">
        {props.title} ({props.items ? props.items.length : 0})
      </h2>

      {props.items.slice(0, 3).map((data) => {
        return (
          <CardBox key={data.id}>
            <p>{data.content}</p>
            <footer>
              <div className="userinfo">
                <img src={data.imageUrl} alt="logo" />
                <span>{data.creatorSlug}</span>
              </div>
            </footer>
          </CardBox>
        );
      })}
    </Box>
  );
}

function ProfileBox(props) {
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
      <AlurakutProfileSidebarMenuFriend githubUser={props.githubUser} />
    </Box>
  );
}

export default function ProfilePage({
  githubUser,
  profileUser,
  followersData,
  followingData,
  communitiesData,
  testimonialData,
  scrapData,
}) {
  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <div
        style={{
          width: "100%",
        }}
      >
        <MainGrid>
          <div className="profileArea" style={{ gridArea: "profileArea" }}>
            <ProfileBox githubUser={profileUser} />
          </div>
          <div className="welcomeArea" style={{ gridArea: "welcomeArea" }}>
            <Box>
              <h1 className="title">{profileUser}</h1>
              <hr />
              <OrkutNostalgicIconSet
                fas={followersData.length}
                recados={scrapData ? scrapData.length : 0}
                mensagens={testimonialData ? testimonialData.length : 0}
              />
            </Box>
            <CardBoxText title="Depoimentos" items={testimonialData} />
            <CardBoxText title="Recados" items={scrapData} />
          </div>
          <div
            className="profileRelationsArea"
            style={{ gridArea: "profileRelationsArea" }}
          >
            <CardBoxImage title="Amigos" items={followingData} />
            <CardBoxImage title="Seguidores" items={followersData} />
            <CardBoxImage title="Comunidades" items={communitiesData} />
          </div>
        </MainGrid>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;
  const apitoken = process.env.DATOCMS_READ_API_TOKEN;

  const { isAuthenticated } = await fetch(
    "https://alurakut.vercel.app/api/auth",
    {
      headers: {
        Authorization: token,
      },
    }
  ).then((res) => res.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const { pid } = context.query;

  if(!pid){
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const { githubUser } = jwt.decode(token);
  const URL_GITHUB = `https://api.github.com/users/${pid}`;

  const followers = await fetch(`${URL_GITHUB}/followers`).then((res) =>
    res.json()
  );

  const parsedFollowers = followers.map((data) => {
    return {
      id: data.id,
      title: data.login,
      imageUrl: data.avatar_url,
      githubUrl: data.html_url,
      creatorSlug: githubUser,
    };
  });

  const following = await fetch(`${URL_GITHUB}/following`).then((res) =>
    res.json()
  );

  const parsedFollowing = following.map((data) => {
    return {
      id: data.id,
      title: data.login,
      imageUrl: data.avatar_url,
      githubUrl: data.html_url,
      creatorSlug: githubUser,
    };
  });

  const { data } = await fetch(`https://graphql.datocms.com`, {
    method: "POST",
    headers: {
      Authorization: `${apitoken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query {
        allCommunities(filter: {creatorSlug: {eq: ${pid.toLowerCase()}}}, orderBy: createdAt_ASC){
          id,
          title,
          imageUrl,
        }
        allScraps(filter: {ownerSlug: {eq: ${pid.toLowerCase()}}}, orderBy: createdAt_DESC){
            id,
            content,
            imageUrl,
            creatorSlug
        }
        allTestimonials(filter: {ownerSlug: {eq: ${pid.toLowerCase()}}}, orderBy: createdAt_DESC){
            id,
            content,
            imageUrl,
            creatorSlug
        }
      }`,
    }),
  }).then((res) => res.json());

  return {
    props: {
      githubUser,
      profileUser: pid.toLowerCase(),
      followersData: parsedFollowers,
      followingData: parsedFollowing,
      communitiesData: data.allCommunities,
      testimonialData: data.allTestimonials,
      scrapData: data.allScraps,
    },
  };
}
