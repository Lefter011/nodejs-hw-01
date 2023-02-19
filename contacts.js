const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("db/contact.json");

const { v4: uuidv4 } = require("uuid");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath);
    console.table(JSON.parse(data));
  } catch (err) {
    console.log(err.message);
    throw err;
  }
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
    const data = await fs.readFile(contactsPath);
    const parsedData = JSON.parse(data);
    const result = parsedData.find(
      (contact) => contact.id.toString() === contactId.toString()
    );
    if (!result) {
      console.log("Contact not found");
      return;
    }
    const filteredData = parsedData.filter(
      (contact) => contact.id.toString() !== contactId.toString()
    );
    await fs.writeFile(contactsPath, JSON.stringify(filteredData));
    console.log(`Contact with ID ${contactId} removed`);
  } catch (err) {
    console.log(err.message);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath);
    const parsedData = JSON.parse(data);
    if (
      parsedData.find(
        (contact) => contact.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      console.log(`${name} is already in contacts`);
      return;
    }
    const newContact = { id: uuidv4(), name, email, phone };
    parsedData.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(parsedData));
    console.log(`${name} is added to contacts`);
  } catch (err) {
    console.log(err.message);
  }
}


module.exports = { listContacts, getContactById, removeContact, addContact };