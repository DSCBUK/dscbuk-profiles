import PouchDB from 'pouchdb'
import remoteDB from './remoteDB'


const db = new PouchDB('github-profiles')
let remoteDb = new PouchDB(remoteDB)

export const fetchUser = async(userID) => {
    try {
        const req = await fetch(`https://api.github.com/users/${userID}`)
        const user = await req.json()
        if (!user.login) {
            throw new Error()
        }
        const profile = { _id: '' + user.id, avatar_url: user.avatar_url, name: user.name, html_url: user.html_url, login: user.login }
        await db.put(profile)
        return profile
    } catch (err) {
        return {}
    }
}

const syncDb = () => {
    db.sync(remoteDb).on('complete', function() {
        console.log("Sync success")
    }).on('error', function(err) {
        console.log("Error")
    });
}

export const getAllUsers = async() => {
    try {
        const req = await db.allDocs({ include_docs: true })
        const users = req.rows.map(row => row.doc);
        syncDb()
        return users
    } catch (err) {
        return {}
    }
}