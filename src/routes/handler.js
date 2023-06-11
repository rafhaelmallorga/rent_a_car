const CarService = require("./../service/carService")
const { join } = require("path")
const carsDatabase = join(__dirname, "./../../database", "cars.json");
const { once } = require('events')

class Handler {
    async routes (req, res) {
        const { url, method } = req;
        const routeRequest = `${url}:${method}`.toLowerCase();
        switch (routeRequest) {
            case "/calculatefinalprice:post":
                const data = JSON.parse(await once(req, 'data'))
                const { customer, carCategory, numberOfDays } = data;
                
                const carService = new CarService({
                    cars: carsDatabase
                })

                const result = await carService.rent(
                    customer,
                    carCategory,
                    numberOfDays
                );

                res.writeHead(200)
                res.end(JSON.stringify(result))
                break
            default:
                res.writeHead(404)
                res.end(JSON.stringify(
                    {
                        message: "Not found!"
                    }
                ))
        }
    }
}


module.exports = Handler;