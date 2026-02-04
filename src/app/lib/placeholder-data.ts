const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    username: "admin",
    name: "Admin User",
    role: "Admin",
    email: "admin@handcraftedhaven.com",
    password: "admin123",
    bio: "Site administrator",
    userPhoto: "/placeholder-user.jpg",
    approved: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    username: "janecrafts",
    name: "Jane Artisan",
    role: "Seller",
    email: "jane@example.com",
    password: "seller123",
    bio: "I create beautiful handmade ceramics and pottery. Each piece is unique and made with love.",
    userPhoto: "/placeholder-user.jpg",
    approved: true,
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002",
    username: "johndoe",
    name: "John Buyer",
    role: "Buyer",
    email: "john@example.com",
    password: "buyer123",
    bio: "Love collecting handmade items",
    userPhoto: "/placeholder-user.jpg",
    approved: true,
  },
];

const products = [
  {
    id: "3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    name: "Ceramic Vase",
    price: 45.99,
    quantity: 3,
    description: "A beautiful handcrafted ceramic vase, perfect for displaying fresh flowers.",
    productImg: "https://picsum.photos/id/1060/1200/900",
  },
  {
    id: "3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c22",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    name: "Clay Bowl",
    price: 32.50,
    quantity: 5,
    description: "Handmade clay bowl, great for serving or decoration.",
    productImg: "https://picsum.photos/id/1080/1200/900",
  },
  {
    id: "3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c23",
    userId: "550e8400-e29b-41d4-a716-446655440001",
    name: "Decorative Pot",
    price: 55.00,
    quantity: 2,
    description: "A stunning decorative pot with intricate hand-painted designs.",
    productImg: "https://picsum.photos/id/1040/1200/900",
  },
];

const reviews = [
 { 
  id: 'd696e808-347c-4ec3-9831-9d3342e62997',
  userId:'550e8400-e29b-41d4-a716-446655440001',
  productId:'3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21',
  comment: 'Beautiful craftsmanship! Exactly as described.',
  rating: 4,
 },
 {
  id: 'dcd4cca0-e2af-4795-8464-48b01c27b5eb',
  userId:'550e8400-e29b-41d4-a716-446655440002',
  productId:'3f2c8e9b-7a4d-4d6c-b9f2-6e1b0d4a8c21',
  comment: 'Great quality, shipping was fast.',
  rating: 5,
 }

]


export {users, products, reviews};
