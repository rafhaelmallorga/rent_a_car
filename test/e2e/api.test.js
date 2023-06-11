const { describe, it } = require("mocha");
const supertest = require("supertest");
const assert = require("assert");
const { expect } = require("chai")
const { join } = require("path");
const sinon = require("sinon");
const CarService = require("./../../src/service/carService");
const carsDatabase = join(__dirname, "./../../database", "cars.json");

const mocks = {
    validCarCategory: require("./../mocks/valid-carCategory.json"),
    validCar: require("./../mocks/valid-car.json"),
    validCustomer: require("./../mocks/valid-customer.json")
}

describe("API suit test", () => {
    let App;
    let carService = {};
    let sandBox = {};
    before((done) => {
        App = require("./../../src/api");
        App.once('listening', done);
        carService = new CarService({
            cars: carsDatabase
        })
    });
    after((done) => {
        App.close(done);
    })
    beforeEach(()=>{
        sandBox = sinon.createSandbox( )
    })
    afterEach(()=>{
        sandBox.restore( )
    })

    describe("/calculateFinalPrice:POST", () => {
        it("Should return the final price ticket", async () => {
            const car = mocks.validCar;
            const carCategory = {
                ...mocks.validCarCategory,
                price: 37.6,
                carIds: [car.id]
            }
            const customer = Object.create(mocks.validCustomer);
            customer.age = 20;
            const numberOfDays = 5;

            const now = new Date(2020, 10, 5);
            sandBox.useFakeTimers(now.getTime())

            const dueDate = "10 de novembro de 2020"
            const expectedAmount = carService.currencyFormat.format(206.80);

            const response = await supertest(App)
                .post("/calculateFinalPrice")
                .send({
                    customer,
                    carCategory,
                    numberOfDays
                })
                .expect(200)

            expect(JSON.parse(response.text).amount).to.be.deep.equal(expectedAmount)
            expect(JSON.parse(response.text).dueDate).to.be.deep.equal(dueDate)
        })

        it("Should return de default page if route doesn't exists", async () => {
            const response = await supertest(App)
                .get("/routThatDoesntExists")
                .expect(404)

            expect(response.text).to.be.deep.equal(JSON.stringify({message: "Not found!"}))
            expect(response.statusCode).to.be.deep.equal(404)
        })
    })
})
