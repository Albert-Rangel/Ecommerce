import { fakerES as faker } from '@faker-js/faker'

export const generateProduct = () => {
    const product = {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        descripcion: faker.commerce.productName(),
        email: faker.internet.email(),
        code: faker.string.uuid(),
        price: faker.commerce.price(100, 1000, 2, "$"),
        status: true,
        stock: faker.number.int({min: 1, max:50}),
        category: faker.commerce.department()
    }
    return product

}
