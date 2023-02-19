const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("db/contact.json");

const { v4: uuidv4 } = require("uuid");

async function listContacts() {
  fs.readFile(contactsPath)
    .then((data) => console.table(JSON.parse(data)))
    .catch((err) => console.log(err.message));
}

async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath);
    const result = JSON.parse(data).find(
      (contact) => contact.id.toString() === contactId.toString()
    );
    if (result) {
      console.log(result);
    } else {
      console.log("Contact not found");
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function removeContact(contactId) {
  try {
    const contacts = JSON.parse(await fs.readFile(contactsPath));
    const contactIndex = contacts.findIndex(
      (contact) => contact.id.toString() === contactId.toString()
    );
    if (contactIndex === -1) {
      console.log("Contact not found");
      return;
    }
    contacts.splice(contactIndex, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    console.log(`Contact with ID ${contactId} removed`);
  } catch (error) {
    console.error(error.message);
    throw error;
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath);
    const parsedData = JSON.parse(data);
    if (parsedData.some(contact => contact.name.toLowerCase() === name.toLowerCase())) {
      console.log(`${name} is already in contacts`);
      return;
    }
    const newContact = { id: uuidv4(), name, email, phone };
    parsedData.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(parsedData));
    console.log(`${name} is added to contacts`);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = { listContacts, getContactById, removeContact, addContact };