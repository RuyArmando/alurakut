import { SiteClient } from "datocms-client";

async function createRecord(model) {
  // Process a POST request
  const client = new SiteClient(process.env.DATOCMS_API_TOKEN);

  // envia o novo seguidor para o DatoCMS
  client.items.create({
    itemType: "975993", // model ID
    login: model.login,
    imageUrl: model.imageUrl,
    githubUrl: model.githubUrl,
    creatorSlug: model.creatorSlug,
  });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    // envia os seguidores para o DatoCMS
    req.body.data.forEach(async (element) => await createRecord(element));
    res.status(200).json({ ok: true });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ ok: false });
  }
}