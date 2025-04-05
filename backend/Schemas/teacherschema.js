const studentSchema = {
    userId: { type: String, required: true, unique: true }, // Unique student ID
    userName: { type: String, required: true }, // Student name
    password: { type: String, required: true }, // Hashed password
    email: { type: String, required: true, unique: true }, // Email address
    permission: { type: Boolean, default: false }, // Whether permission is granted
    requestedTeacherId: { type: String }, // Teacher ID the student requested permission from
    projects: [ // List of projects the student is associated with
        {
            projectId: { type: Number },
            title: { type: String }
        }
    ]
};
