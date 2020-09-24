// This is an example of how to access a session from an API route
import { getSession } from 'next-auth/client'
import fetch from 'isomorphic-unfetch'
import nextConnect from 'next-connect'
import middleware from '../../../middleware/db'
import { ObjectId } from 'mongodb'

const handler = nextConnect()

handler.use(middleware)

handler.get(async (req, res) => {
  const session = await getSession({ req })
  const userSession = await req.db.collection("sessions").findOne({ accessToken: `${session.accessToken}` })
  const userId = ObjectId(userSession.userId)
  const userAccount = await req.db.collection("accounts").findOne({ userId: userId })
  const accessToken = userAccount.accessToken
  console.log(accessToken)

  if (session) {
    const response = await fetch(`https://discord.com/api/users/@me/guilds`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })
    const guilds = await response.json()
    const findGuild = guilds.filter(guild => guild.id == "653778768439279676")
    if (findGuild.length > 0) {
      res.send(true)
    }
    else {
      res.send(false)
    }


  }
  else {
    res.send(JSON.stringify(null))
  }
})

export default handler
