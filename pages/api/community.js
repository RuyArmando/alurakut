import { SiteClient } from "datocms-client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const client = new SiteClient(process.env.DATOCMS_API_TOKEN);

    // envia a nova comunidade para o DatoCMS
    const newRecord = await client.items.create({
      itemType: "968035", // model ID
      title: req.body.title,
      imageUrl: req.body.imageUrl,
      link: req.body.link,
      creatorSlug: req.body.creatorSlug,
    });

    res.status(200).json({ data: newRecord });
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
