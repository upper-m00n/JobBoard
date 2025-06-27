import {Client, Storage, ID} from 'appwrite'

const client = new Client();

client.setEndpoint('https://cloud.appwrite.io/v1').setProject('685d2648003036c2714a')

const storage = new Storage(client);

export {client, storage , ID};