"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const faker_1 = require("@faker-js/faker");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        // Create 5 users (you can change the number as needed)
        for (let i = 0; i < 5; i++) {
            const user = yield prisma.user.create({
                data: {
                    name: faker_1.faker.person.fullName(),
                    email: `user${i}@test.com`,
                    password: yield bcrypt_1.default.hash('password123', 10),
                },
            });
            // Create 50 expenses for each user (you can adjust this number as needed)
            for (let j = 0; j < 10; j++) {
                yield prisma.expense.create({
                    data: {
                        title: faker_1.faker.commerce.productName(),
                        amount: parseFloat(faker_1.faker.commerce.price()),
                        category: faker_1.faker.helpers.enumValue(client_1.Category),
                        date: faker_1.faker.date.past(),
                        description: faker_1.faker.lorem.sentence(),
                        userId: user.id,
                    },
                });
            }
        }
        console.log('Seeding completed!');
    });
}
seed()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}));
