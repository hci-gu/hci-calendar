/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ff4qygim75cpw9n")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sdbe7qlr",
    "name": "Title",
    "type": "text",
    "required": true,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ff4qygim75cpw9n")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "sdbe7qlr",
    "name": "Title",
    "type": "text",
    "required": false,
    "presentable": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
