import { SiteClient } from "datocms-client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Process a POST request
    const client = new SiteClient(process.env.DATOCMS_API_TOKEN);

    const records = await client.items.all({
      filter: {
        type: "user",
        fields: {
          login: {
            eq: req.body.login,
          },
        },
      },
    });

    if (records.length > 0) {
      res.status(202).json({ created: false, data: records[0] });
      return;
    }

    // envia a nova comunidade para o DatoCMS
    const newRecord = await client.items.create({
      itemType: "976027", // model ID
      login: req.body.login,
      imageUrl: req.body.imageUrl,
      name: req.body.name,
      bio: req.body.bio,
      githubUrl: req.body.githubUrl,
    });

    res.status(201).json({ created: true, data: newRecord });
    return;

  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}
