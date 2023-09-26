import {Environment} from "@doctor_internet/interenv"
const env = new Environment({
    NODE_ENV: "test",
    DB_HOST: "example.com",
    DB_USER: "testuser",
    DB_PASS: "testpass",
    DB_MAIN_DB: "test_database_eu",
    DB_BACKUP_DB: "test_database_us"
})

const sub = env.prefixed("DB_")
console.log("DB_ / NODE_ENV?", sub.has("NODE_ENV"))
console.log("DB_ / HOST:", sub.raw("HOST"))

const main = sub.prefixed("MAIN_")
console.log("DB_ / MAIN_ / DB:", main.raw("DB"))

const backup = sub.prefixed("BACKUP_")
console.log("DB_ / BACKUP_ / DB:", backup.raw("DB"))
