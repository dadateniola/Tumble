const Model = require("./Model");

class User extends Model{
    get fullname(){
        return `${this.first_name || ''} ${this.last_name || ''}`
    }
}

module.exports = User;