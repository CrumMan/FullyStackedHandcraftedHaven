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

const reviews = [
 { 
  id: 'd696e808-347c-4ec3-9831-9d3342e62997',
  userId:'410544b2-4001-4271-9855-fec4b6a6442a',
  author: 'Admin Name',
  productId:'3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21',
  comment: 'Beautiful craftsmanship! Exactly as described.',
  rating: 4,

 },
 {
  id: 'dcd4cca0-e2af-4795-8464-48b01c27b5eb',
  userId:'410544b2-4001-4271-9855-fec4b6a6442a',
  author: 'Admin Name',
  productId:'3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21',
  comment: 'Great quality, shipping was fast.',
  rating: 5,


 }

]


export {users, products, reviews};
