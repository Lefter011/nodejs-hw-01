const fs = require("fs").promises;
const path = require("path");
const contactsPath = path.resolve("db/contact.json");

const { v4: uuidv4 } = require("uuid");

function listContacts() {
  fs.readFile(contactsPath)
    .then((data) => console.table(JSON.parse(data)))
    .catch((err) => console.log(err.message));
}

function getContactById(contactId) {
  fs.readFile(contactsPath)
    .then((data) =>
      JSON.parse(data).find(
        (contact) => contact.id.toString() === contactId.toString()
      )
    )
    .then((result) =>
      result ? console.log(result) : console.log("Contact not found")
    )
    .catch((err) => console.log(err.message));
}

function removeContact(contactId) {
  fs.readFile(contactsPath)
    .then((data) =>
      JSON.parse(data).find(
        (contact) => contact.id.toString() === contactId.toString()
      )
        ? JSON.parse(data).filter(
            (contact) => contact.id.toString() !== contactId.toString()
          )
        : (result = null)
    )
    .then((result) =>
      result !== null
        ? fs
            .writeFile(contactsPath, JSON.stringify(result))
            .then(() => console.log(`Contact with ID ${contactId} removed`))
            .catch((err) => console.log(err.message))
        : console.log("Contact not found")
    )
    .catch((err) => console.log(err.message));
}

function addContact(name, email, phone) {
  fs.readFile(contactsPath)
    .then((data) => {
      const parsedData = JSON.parse(data);
      if (
        parsedData.find(
          (contact) => contact.name.toLowerCase() === name.toLowerCase()
        )
      ) {
        console.log(`${name} is already in contacts`);
        return;
      }

      parsedData.push({ id: uuidv4(), name, email, phone });
      fs.writeFile(contactsPath, JSON.stringify(parsedData)).then(
        console.log(`${name} is added to contacts`)
      );
      return;
    })

    .catch((err) => console.log(err.message));
}

module.exports = { listContacts, getContactById, removeContact, addContact };