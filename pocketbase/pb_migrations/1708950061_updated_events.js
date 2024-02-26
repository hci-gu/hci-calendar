/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ff4qygim75cpw9n")

  // remove
  collection.schema.removeField("ryhdxopy")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("ff4qygim75cpw9n")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ryhdxopy",
    "name": "icon",
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
})
