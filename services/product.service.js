const { MoleculerError } = require("moleculer").Errors;
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const ProductModel = require("../models/product.model");
const products = require('../products.json')
const env = require('dotenv');
env.config();

module.exports = {
  name: "product",
  mixins: [DbService],
  settings: {
    JWT_SECRET: process.env.JWT_SECRET
  },
  adapter: new MongooseAdapter(process.env.MONGO_URI),
  model: ProductModel,

  actions: {
    insert: {
      rest: 'GET /insert',
      async handler(ctx) {
        products.map((data) => {
          this.adapter.insert(data)
        })
      }
    }
  },

  events: {},

  methods: {},

  created() {},
  async started() {},
  async stopped() {}
};
