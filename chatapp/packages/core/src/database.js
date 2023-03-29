import pg from 'pg'
const { Pool } = pg

let pool
function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    pool = new Pool({
      connectionString,
      application_name: "",
      max: 1,
    });
  }
  return pool
}

export async function getChats() {
  const res = await getPool().query(`
  SELECT * FROM chats
  ORDER BY timestamp DESC
  `)
  return res.rows
}

export async function createChat(name, userId, username) {
  const res = await getPool().query(`
  INSERT INTO chats (name, user_id, username)
  VALUES ($1, $2, $3)
  RETURNING *
  `, [name, userId, username])
  return res.rows[0]
}

export async function deleteChat(id, userId) {
  try {
    const res = await getPool().query(`
      DELETE FROM chats
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [id, userId]);
    return res.rows[0];
  } catch (error) {
    console.error(`Error deleting chat with id ${id}:`, error);
    throw error;
  }
}

export async function updateChat(id, name, userId) {
  const res = await getPool().query(`
    UPDATE chats
    SET name = $1
    WHERE id = $2
    AND user_id = $3
    RETURNING *
  `, [name, id, userId]);
  return res.rows[0];
}


export async function getMessages(id) {
    const res = await getPool().query(`
    SELECT * FROM messages
    WHERE chat_id = $1
    ORDER BY timestamp DESC
    `, [id])
    return res.rows
}

export async function createMessage(chat_id, content, content_type, userId, username) {
  const res = await getPool().query(`
    INSERT INTO messages (chat_id, content, content_type, user_id, username)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
  `, [chat_id, JSON.stringify(content), content_type, userId, username]); // Convert content to JSON string
  return res.rows[0];
}

export async function updateMessage(id, content, userId, username) {
  const res = await getPool().query(`
    UPDATE messages
    SET content = $1
    WHERE id = $2
    AND user_id = $3
    AND username = $4
    RETURNING *
  `, [JSON.stringify(content), id, userId, username]); // Convert content to JSON string
  return res.rows[0];
}

export async function deleteMessage(id, userId) {
  const res = await getPool().query(`
    DELETE FROM messages
    WHERE id = $1 AND user_id = $2
    RETURNING *
  `, [id, userId]);
  return res.rows[0];
}



