const { MoleculerError } = require("moleculer").Errors;
const DbService = require("moleculer-db");
const MongooseAdapter = require("moleculer-db-adapter-mongoose");
const AuthModel = require("../models/auth.model");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const env = require('dotenv')
env.config()


module.exports = {
	name: "auth",
    mixins: [DbService],
    settings: {
        JWT_SECRET: process.env.JWT_SECRET
    },
	adapter: new MongooseAdapter(process.env.MONGO_URI),
    model: AuthModel,

	dependencies: [],
	actions: {
        register: {
            rest: {
                path: '/register',
                method: 'POST'
            },
			async handler(ctx) {
                const { username, password } = ctx.params

                const hashedPassword = await bcrypt.hash(password, 10);
				return { username, password: hashedPassword }
			}
        },
// 		push:{
// 			rest: {
//                 path: '/push-user',
//                 method: 'GET'
//             },
// 			async handler(ctx) {
//                 const userData = [
//   {
//     "id": 1,
//     "firstName": "John",
//     "lastName": "Doe",
//     "email": "john.doe@example.com",
//     "phone": "+1234567890",
//     "address": {
//       "street": "123 Elm St",
//       "city": "Springfield",
//       "state": "IL",
//       "zip": "62701"
//     },
//     "createdAt": "2024-01-15T12:34:56Z",
//     "updatedAt": "2024-01-20T12:34:56Z"
//   },
//   {
//     "id": 2,
//     "firstName": "Jane",
//     "lastName": "Smith",
//     "email": "jane.smith@example.com",
//     "phone": "+0987654321",
//     "address": {
//       "street": "456 Oak St",
//       "city": "Springfield",
//       "state": "IL",
//       "zip": "62702"
//     },
//     "createdAt": "2024-02-10T15:20:30Z",
//     "updatedAt": "2024-02-15T15:20:30Z"
//   },
//   {
//     "id": 3,
//     "firstName": "Alice",
//     "lastName": "Johnson",
//     "email": "alice.johnson@example.com",
//     "phone": "+1122334455",
//     "address": {
//       "street": "789 Pine St",
//       "city": "Springfield",
//       "state": "IL",
//       "zip": "62703"
//     },
//     "createdAt": "2024-03-05T09:45:00Z",
//     "updatedAt": "2024-03-10T09:45:00Z"
//   }
// 			]
// 			userData.forEach((data) =>{
// 				this.adapter.insert(data)
// 			})

// 			}
// 		}
	},

	events: {

	},
	methods: {

	},

	created() {
	},
	async started() {
	},
	async stopped() {
	}
};
