// services/upload.service.js
const { MoleculerError } = require("moleculer").Errors;
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const formidable = require("formidable");
const credential = require('../credentials.json');

module.exports = {
    name: "upload",
    
    settings: {
        folderId: '12bbbYaMjQtt6esT2X_oe0XZEN6sXy1p7', // Your Google Drive folder ID
    },
    
    actions: {
        uploadImage: {
            rest: "POST /file",
            async handler(ctx) {
                return new Promise((resolve, reject) => {
                    // Log to verify the presence of the request object
                    if (!ctx.meta.$req) {
                        return reject(new MoleculerError("Request object not found", 500, "REQUEST_ERROR"));
                    }

                    console.log("Parsing incoming form data...");

                    // Create a new Formidable form instance
                    const form = new formidable.IncomingForm();

                    // Parse the incoming request with Formidable
                    form.parse(ctx.meta.$req, async (err, fields, files) => {
                        if (err) {
                            console.error("Error parsing form data:", err);
                            return reject(new MoleculerError("File upload failed", 500, "UPLOAD_ERROR", err));
                        }

                        // Log the parsed files object
                        console.log("Files parsed:", files);

                        // Access the uploaded file
                        const file = files.file; // `files.file` matches the name of the form field in your client

                        if (!file) {
                            return reject(new MoleculerError("No file uploaded", 400, "UPLOAD_ERROR"));
                        }

                        try {
                            // Authenticate with Google Drive
                            console.log("Authenticating with Google Drive...");
                            const auth = await this.getAuth();
                            const drive = google.drive({ version: "v3", auth });

                            // Upload the file to Google Drive
                            console.log("Uploading file to Google Drive...");
                            const res = await drive.files.create({
                                resource: {
                                    name: file.originalFilename || file.name, // The name of the file on Google Drive
                                    mimeType: file.mimetype || file.type,
                                    parents: [this.settings.folderId], // The folder ID
                                },
                                media: {
                                    mimeType: file.mimetype || file.type,
                                    body: fs.createReadStream(file.filepath), // Read the file from the temporary path
                                },
                                fields: "id",
                            });

                            // Clean up local file
                            fs.unlinkSync(file.filepath);

                            resolve({ fileId: res.data.id });
                        } catch (err) {
                            console.error("Error uploading to Google Drive:", err);
                            reject(new MoleculerError("File upload to Google Drive failed", 500, "UPLOAD_ERROR", err));
                        }
                    });
                });
            },
        }
    },

    methods: {
        async getAuth() {
            const auth = new google.auth.JWT(
                credential.client_email,
                null,
                credential.private_key,
                ['https://www.googleapis.com/auth/drive'],
            );
            await auth.authorize();
            return auth;
        },
    }
};
