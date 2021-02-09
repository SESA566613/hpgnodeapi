const Pool = require('pg').Pool


//const isProduction = process.env.NODE_ENV === 'production'
//const connectionString = `postgresql://${process.env.USER}:${process.env.PASSWORD}@${process.env.HOST}:${process.env.PORT}/${process.env.DATABASE}`
require('dotenv').config();
const pool = new Pool({

  // user: process.env.USER,
  // host: process.env.HOST,
  // database: process.env.DATABASE,
  // password: process.env.PASSWORD,
  // port: process.env.PORT,
  connectionString: process.env.DATABASE_URL,
  // connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
   //ssl: true
   ssl: {
    rejectUnauthorized: false
  }
})
const getUsers = (request, response) => {
  pool.query('SELECT * FROM public.users ORDER BY id ASC;', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createUser = (request, response) => {
  console.log(request.body);
  const { id, name, email } = request.body[0];

  pool.query('INSERT INTO users (id, name, email) VALUES ($1, $2, $3)', [id, name, email], (error, results) => {
    if (error) {

      throw error
    }
    response.status(201).send(`User added `)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body[0]

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with ID: ${id}`)
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}