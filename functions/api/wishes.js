export async function onRequestGet(context) {

  const { results } = await context.env.DB
    .prepare(
      `SELECT * FROM wishes
       ORDER BY created_at DESC`
    )
    .all();
 const website = document.getElementById("website").value;
  return Response.json(results);
}

export async function onRequestPost(context) {

  const body = await context.request.json();

  const name = body.name || "Anonim";
  const message = body.message;

  if (!message) {
    return new Response(
      "Mesaj lipsă",
      { status: 400 }
    );
  }
  if (message.length > 500) {
  return new Response(
    "Mesaj prea lung",
    { status: 400 }
  );
}
  if (name.length > 50) {
  return new Response(
    "Nume prea lung",
    { status: 400 }
  );
}

  if(body.website){
   return new Response(
      "Spam detectat",
      {status:400}
   );
}
  
  await context.env.DB
    .prepare(
      `INSERT INTO wishes
      (name,message)
      VALUES (?1,?2)`
    )
    .bind(name,message)
    .run();

  return Response.json({
    success:true
  });
}
