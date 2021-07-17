import nookies from "nookies";
import jwt from "jsonwebtoken";
import styled from "styled-components";

import MainGrid from "../../src/components/MainGrid";
import Box from "../../src/components/Box";

import { AlurakutMenu } from "../../src/lib/AlurakutCommons";

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

function CardBox(props) {
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
    </Box>
  );
}

export default function ProfilePage({
  githubUser,
  profileUser,
  followersData,
  followingData,
  communitiesData,
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
            </Box>
          </div>
          <div
            className="profileRelationsArea"
            style={{ gridArea: "profileRelationsArea" }}
          >
            <CardBox title="amigos" items={followingData} />
            <CardBox title="seguidores" items={followersData} />
            <CardBox title="comunidades" items={communitiesData} />
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
  const { githubUser } = jwt.decode(token);

  const { data } = await fetch(`https://graphql.datocms.com`, {
    method: "POST",
    headers: {
      Authorization: `${apitoken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: `query {
        allCommunities(filter: {creatorSlug: {eq: ${pid}}}, orderBy: createdAt_ASC){
          id,
          title,
          imageUrl,
        }
        allFollowers(filter: {creatorSlug: {eq: ${pid}}}, orderBy: createdAt_ASC){
          id,
          title: login,
          imageUrl,
        }
        allFollowings(filter: {creatorSlug: {eq: ${pid}}}, orderBy: createdAt_ASC){
          id,
          title: login,
          imageUrl,
        }
      }`,
    }),
  }).then((res) => res.json());

  return {
    props: {
      githubUser,
      profileUser: pid,
      followersData: data.allFollowers,
      followingData: data.allFollowings,
      communitiesData: data.allCommunities,
    },
  };
}
