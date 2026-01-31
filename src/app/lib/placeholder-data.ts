  const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    username: 'userConrol',
    name:'Admin Name',
    role: "Admin",
    email: 'usertest@test.com',
    password: '123456',
    bio: "I am admin number 1",
    userPhoto: `@/public/410544b2-4001-4271-9855-fec4b6a6442a.jpg`,
  },
];

const products = [
  {
  id:'3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21',
  userId:'410544b2-4001-4271-9855-fec4b6a6442a',
  name:'First Product',
  price:12.99,
  quantity:1,
  description: "The first handcrafted object",
  productImg: "@/public/3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21.jpg",
  },
]

export {users, products};
