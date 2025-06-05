const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            
            
        })
        console.log('mongo db is connectd jibin joby p')
        const dbs = await mongoose.connection.db.admin().listDatabases();
        console.log("📂 Databases:", dbs.databases);
    }catch(error){
        console.error('something went wrong jibin')
        process.exit(1)
    }
}
module.exports = connectDB