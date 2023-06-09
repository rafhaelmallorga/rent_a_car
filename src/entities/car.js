const Base = require("./base/base")

class Car extends Base{
    constructor ({id, name, releaseYear, available, gasAvaliable}) {
        super({id, name})
        this.releaseYear = releaseYear;
        this.available = available;
        this.gasAvaliable = gasAvaliable;

    }
}

module.exports = Car