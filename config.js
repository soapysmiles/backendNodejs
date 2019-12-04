exports.config = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "user-system",
    connectionLimit: 100
};

exports.jwt = {
    jwtSecret: "06eb3782ff5eb34dada2e24921e77346",
    jwtSession: {
        session: false
    }
};