    const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    username: 'userConrol',
    name:'Admin Name',
    authorization: 'Admin',
    email: 'usertest@test.com',
    password: '123456',
    bio: "I am admin number 1"
  },
];

const listings = [
  {
    id: 'b1a1c1d1-0001-0001-0001-000000000001',
    artist_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    description: 'Handcrafted Wooden Bowl',
    quantity: 5,
    price: 45.00,
    keywords: ['wood', 'handmade', 'kitchen']
  },
  {
    id: 'b1a1c1d1-0002-0002-0002-000000000002',
    artist_id: '410544b2-4001-4271-9855-fec4b6a6442a',
    description: 'Ceramic Coffee Mug',
    quantity: 12,
    price: 25.50,
    keywords: ['ceramic', 'mug', 'coffee']
  }
];


export {users, listings};