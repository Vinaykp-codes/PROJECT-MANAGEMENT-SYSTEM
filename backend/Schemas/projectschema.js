const projectSchema = {
    projectId: { type: Number, required: true, unique: true }, // Unique project ID
    title: { type: String, required: true }, // Title of the project
    faculty: { type: String }, // Faculty associated with the project
    designation: { type: String }, // Designation or role
    domain: { type: String }, // Domain of the project
    leadsto: { type: String }, // Where the project leads to (outcome)
    partof: { type: String }, // Larger program or group it's part of
    content: { type: String }, // Project description or content
    category: { type: String }, // Category (e.g., research, development)
    status: { type: Boolean, default: true }, // Active or inactive project
    team: [ // Team members working on the project
        {
            name: { type: String },
            rollNo: { type: String }
        }
    ],
    author: {
        userId: { type: String },
        userName: { type: String }
    }
};
